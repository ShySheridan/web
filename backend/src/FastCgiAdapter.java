import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;

final class FastCgiAdapter {
    private static final int MAX_BODY_BYTES = 4096;
    private final Router router;
    private final JsonResponses responses;
    private final PrintStream log;

    FastCgiAdapter(Router router, JsonResponses responses, PrintStream log) {
        this.router = router;
        this.responses = responses;
        this.log = log;
    }

    void run() {
        if (System.getProperty("FCGI_PORT") == null) {
            throw new IllegalStateException("Укажите порт запуска через -DFCGI_PORT.");
        }
        var fcgi = new FCGIInterface();
        while (accept(fcgi)) {
            serve(FCGIInterface.request.params, System.in, System.out);
        }
        log.println("FastCGI завершил приём запросов. Проверьте порт и журнал сервера.");
        throw new IllegalStateException("FastCGIaccept завершился с ошибкой.");
    }

    private void serve(Properties params, InputStream in, PrintStream out) {
        long started = System.nanoTime();
        try {
            HttpRequest request = read(params, in);
            var fields = router.dispatch(request);
            responses.write(out, "200 OK", Map.of(), fields, started);
        } catch (HttpError error) {
            responses.write(out, error.status(), error.headers(), Map.of("error", error.getMessage()), started);
        } catch (IOException | RuntimeException error) {
            error.printStackTrace(log);
            responses.write(out, "500 Internal Server Error", Map.of(),
                    Map.of("error", "Внутренняя ошибка сервера."), started);
        }
    }

    private HttpRequest read(Properties params, InputStream in) throws IOException, HttpError {
        String rawLength = params.getProperty("CONTENT_LENGTH", "");
        int length;
        try {
            length = rawLength.isEmpty() ? 0 : Integer.parseInt(rawLength);
        } catch (NumberFormatException error) {
            throw new HttpError("Некорректная длина тела запроса.");
        }
        if (length < 0) throw new HttpError("Некорректная длина тела запроса.");
        if (length > MAX_BODY_BYTES) throw new HttpError("413 Payload Too Large", "Слишком длинный запрос.");
        byte[] body = in.readNBytes(length);
        if (body.length != length) throw new HttpError("Получено неполное тело запроса.");

        String uri = params.getProperty("REQUEST_URI", params.getProperty("SCRIPT_NAME", ""));
        String path = uri.split("\\?", 2)[0];
        return new HttpRequest(params.getProperty("REQUEST_METHOD", ""), path,
                params.getProperty("CONTENT_TYPE", ""), new String(body, StandardCharsets.UTF_8));
    }

    private boolean accept(FCGIInterface fcgi) {
        for (;;) {
            try {
                return fcgi.FCGIaccept() >= 0;
            } catch (IndexOutOfBoundsException error) {
                var request = FCGIInterface.request;
                if (request == null || request.socket == null) throw error;
                try {
                    request.socket.close();
                } catch (IOException ignored) {
                }
                FCGIInterface.request = null;
            }
        }
    }
}

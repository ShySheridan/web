import java.util.Map;

final class HttpError extends Exception {
    private final String status;
    private final Map<String, String> headers;

    HttpError(String message) {
        this("400 Bad Request", message);
    }

    HttpError(String status, String message) {
        this(status, message, Map.of());
    }

    HttpError(String status, String message, Map<String, String> headers) {
        super(message);
        this.status = status;
        this.headers = Map.copyOf(headers);
    }

    String status() {
        return status;
    }

    Map<String, String> headers() {
        return headers;
    }
}

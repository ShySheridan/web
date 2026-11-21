import java.io.PrintStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.StringJoiner;

final class JsonResponses {
    private static final DateTimeFormatter TIMESTAMP = new DateTimeFormatterBuilder().appendInstant(9).toFormatter();
    private final Clock clock;

    JsonResponses(Clock clock) {
        this.clock = clock;
    }

    void write(PrintStream out, String status, Map<String, String> headers, Map<String, ?> fields, long started) {
        var result = new LinkedHashMap<String, Object>(fields);
        result.put("timestamp", TIMESTAMP.format(clock.instant()));
        result.put("elapsedNanos", System.nanoTime() - started);
        var json = new StringJoiner(",", "{", "}");
        result.forEach((key, value) -> json.add(quote(key) + ":" + scalar(value)));
        byte[] body = json.toString().getBytes(StandardCharsets.UTF_8);

        var head = new StringBuilder("Status: ").append(status).append("\r\n");
        headers.forEach((key, value) -> head.append(key).append(": ").append(value).append("\r\n"));
        head.append("Content-Type: application/json; charset=UTF-8\r\n")
                .append("Content-Length: ").append(body.length).append("\r\n")
                .append("Cache-Control: no-store\r\n\r\n");
        out.writeBytes(head.toString().getBytes(StandardCharsets.US_ASCII));
        out.writeBytes(body);
        out.flush();
    }

    private String scalar(Object value) {
        if (value instanceof String text) return quote(text);
        if (value instanceof BigDecimal decimal) return decimal.toPlainString();
        if (value instanceof Integer || value instanceof Long || value instanceof Boolean) return value.toString();
        throw new IllegalArgumentException("Неподдерживаемый тип значения JSON.");
    }

    private String quote(String text) {
        var quoted = new StringBuilder("\"");
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == '"' || c == '\\') quoted.append('\\').append(c);
            else if (c < 0x20) quoted.append("\\u%04x".formatted((int) c));
            else quoted.append(c);
        }
        return quoted.append('"').toString();
    }
}

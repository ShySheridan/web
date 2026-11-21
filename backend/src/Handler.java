import java.util.Map;

@FunctionalInterface
interface Handler {
    Map<String, ?> handle(HttpRequest request) throws HttpError;
}

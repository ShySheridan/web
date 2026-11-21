import java.util.Map;
import java.util.TreeSet;

final class Router {
    private final Map<String, Map<String, Handler>> routes;

    Router(Map<String, Map<String, Handler>> routes) {
        this.routes = Map.copyOf(routes);
    }

    Map<String, ?> dispatch(HttpRequest request) throws HttpError {
        var methods = routes.get(request.path());
        if (methods == null) {
            throw new HttpError("404 Not Found", "Такой адрес не зарегистрирован.");
        }
        var handler = methods.get(request.method());
        if (handler == null) {
            String allowed = String.join(", ", new TreeSet<>(methods.keySet()));
            throw new HttpError("405 Method Not Allowed", "Допустимые методы: " + allowed,
                    Map.of("Allow", allowed));
        }
        return handler.handle(request);
    }
}

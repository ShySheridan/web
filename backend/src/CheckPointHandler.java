import java.util.Map;
import java.util.UUID;

final class CheckPointHandler implements Handler {
    private final PointForm form;

    CheckPointHandler(PointForm form) {
        this.form = form;
    }

    @Override
    public Map<String, ?> handle(HttpRequest request) throws HttpError {
        String mediaType = request.contentType().split(";", 2)[0].trim();
        if (!mediaType.equalsIgnoreCase("application/x-www-form-urlencoded")) {
            throw new HttpError("415 Unsupported Media Type", "Ожидается форма application/x-www-form-urlencoded.");
        }
        if (request.body().isEmpty()) throw new HttpError("Пустое тело запроса.");
        Point point = form.parse(request.body());
        return Map.of(
                "id", UUID.randomUUID().toString(),
                "x", point.x(),
                "y", point.y().toPlainString(),
                "r", point.r(),
                "hit", point.isHit());
    }
}

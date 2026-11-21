import java.math.BigDecimal;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

final class PointForm {
    private static final Set<String> FIELD_NAMES = Set.of("x", "y", "r");
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)");
    private static final BigDecimal HALF = new BigDecimal("0.5");

    Point parse(String body) throws HttpError {
        Map<String, BigDecimal> fields = parseForm(body);
        BigDecimal x = fields.get("x");
        BigDecimal y = fields.get("y");
        BigDecimal r = fields.get("r");
        if (x.abs().compareTo(BigDecimal.valueOf(2)) > 0 || x.remainder(HALF).signum() != 0) {
            throw new HttpError("X должен быть от −2 до 2 с шагом 0,5.");
        }
        if (y.compareTo(BigDecimal.valueOf(-5)) < 0 || y.compareTo(BigDecimal.valueOf(3)) > 0) {
            throw new HttpError("Y должен быть от −5 до 3 включительно.");
        }
        if (r.compareTo(BigDecimal.ONE) < 0 || r.compareTo(BigDecimal.valueOf(5)) > 0 || r.scale() > 0) {
            throw new HttpError("R должен быть целым числом от 1 до 5.");
        }
        return new Point(x, y, r.intValueExact());
    }

    private Map<String, BigDecimal> parseForm(String body) throws HttpError {
        Map<String, BigDecimal> fields = new HashMap<>();
        for (String pair : body.split("&", -1)) {
            int separator = pair.indexOf('=');
            if (separator < 1) throw new HttpError("Некорректная запись поля формы.");
            String name = decode(pair.substring(0, separator));
            if (!FIELD_NAMES.contains(name) || fields.containsKey(name)) {
                throw new HttpError("Передайте x, y и r ровно по одному разу.");
            }
            String value = decode(pair.substring(separator + 1)).trim().replace(',', '.').replace('−', '-');
            if (!DECIMAL.matcher(value).matches()) throw new HttpError("Параметр " + name + " должен быть числом.");
            fields.put(name, new BigDecimal(value).stripTrailingZeros());
        }
        if (fields.size() != FIELD_NAMES.size()) throw new HttpError("Нужны три параметра: x, y и r.");
        return fields;
    }

    private String decode(String value) throws HttpError {
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException error) {
            throw new HttpError("Некорректное URL-кодирование формы.");
        }
    }
}

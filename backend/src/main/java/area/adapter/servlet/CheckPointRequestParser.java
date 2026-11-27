package area.adapter.servlet;

import area.application.CheckPointCommand;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.regex.Pattern;

final class CheckPointRequestParser {
    private static final Pattern DECIMAL =
            Pattern.compile("[+-]?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)");

    CheckPointCommand parse(HttpServletRequest request) {
        String[] radii = request.getParameterValues("r");
        if (radii == null || radii.length != 1) {
            throw new IllegalArgumentException("Выберите ровно один радиус R.");
        }

        return new CheckPointCommand(
                parseDecimal(request.getParameter("x"), "X"),
                parseDecimal(request.getParameter("y"), "Y"),
                parseDecimal(radii[0], "R"));
    }

    private BigDecimal parseDecimal(String raw, String name) {
        if (raw == null) {
            throw new IllegalArgumentException("Не указано значение " + name + ".");
        }

        String value = raw.trim().replace('−', '-').replace(',', '.');
        if (!DECIMAL.matcher(value).matches()) {
            throw new IllegalArgumentException("Параметр " + name + " должен быть числом.");
        }

        return new BigDecimal(value).stripTrailingZeros();
    }
}

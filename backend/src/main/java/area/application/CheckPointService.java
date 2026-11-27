package area.application;

import java.math.BigDecimal;
import area.domain.Point;

public final class CheckPointService {
    public CheckPointResult check(CheckPointCommand command) throws CheckPointValidationException {
        BigDecimal x = command.x();
        BigDecimal y = command.y();
        BigDecimal r = command.r();
        if (x.compareTo(BigDecimal.valueOf(-4)) < 0 || x.compareTo(BigDecimal.valueOf(4)) > 0
                || x.stripTrailingZeros().scale() > 0) {
            throw new CheckPointValidationException("X должен быть целым числом от −4 до 4.");
        }
        if (y.compareTo(BigDecimal.valueOf(-3)) < 0 || y.compareTo(BigDecimal.valueOf(3)) > 0) {
            throw new CheckPointValidationException("Y должен быть от −3 до 3 включительно.");
        }
        if (r.compareTo(BigDecimal.ONE) < 0 || r.compareTo(BigDecimal.valueOf(5)) > 0 || r.scale() > 0) {
            throw new CheckPointValidationException("R должен быть целым числом от 1 до 5.");
        }
        Point point = new Point(x, y, r.intValueExact());
        return new CheckPointResult(point, point.isHit());
    }
}

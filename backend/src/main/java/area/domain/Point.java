package area.domain;

import java.math.BigDecimal;

public record Point(BigDecimal x, BigDecimal y, int r) {
    public boolean isHit() {
        BigDecimal radius = BigDecimal.valueOf(r);
        BigDecimal half = radius.divide(BigDecimal.valueOf(2));

        boolean square = x.compareTo(radius.negate()) >= 0 && x.signum() <= 0
                && y.signum() >= 0 && y.compareTo(radius) <= 0;

        boolean triangle = x.signum() >= 0 && x.compareTo(radius) <= 0 && y.signum() <= 0
                && y.multiply(BigDecimal.valueOf(2)).compareTo(x.subtract(radius)) >= 0;

        boolean quarterDisk = x.signum() <= 0 && y.signum() <= 0
                && x.multiply(x).add(y.multiply(y)).compareTo(half.multiply(half)) <= 0;

        return square || triangle || quarterDisk;
    }
}

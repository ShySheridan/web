package area.application;

import java.math.BigDecimal;

public record CheckPointCommand(BigDecimal x, BigDecimal y, BigDecimal r) {}

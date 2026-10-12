export class AreaChecker {

    isHit(x, y, r) {
        return (
            this.isInTriangle(x, y, r) ||
            this.isInCircle(x, y, r) ||
            this.isInRectangle(x, y, r)
        );
    }

    isInTriangle(x, y, r) {
        return (
            x >= -r &&
            x <= 0 &&
            y >= 0 &&
            y <= x + r
        );
    }

    isInCircle(x, y, r) {
     return (
            x >= 0 &&
            y >= 0 &&
            x * x + y * y <= r * r
        );
    }

    isInRectangle(x, y, r) {
      return (
            x >= 0 &&
            x <= r / 2 &&
            y >= -r &&
            y <= 0
        );
    }
}
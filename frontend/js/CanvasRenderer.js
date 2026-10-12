export class CanvasRenderer {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;

        this.scale = 1;
        this.currentR = 1;
    }

    draw(r) {
        this.currentR = r;

        const radiusInPixels =
            Math.min(this.canvas.width, this.canvas.height) * 0.32;

        this.scale = radiusInPixels / r;

        this.clear();

        this.drawArea(r);
        this.drawAxes(r);
        this.drawLabels(r);
    }

    clear() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    toCanvas(x, y) {
        return {
            x: this.centerX + x * this.scale,
            y: this.centerY - y * this.scale
        };
    }

    drawArea(r) {
        this.ctx.save();

        this.ctx.fillStyle = "rgba(52, 152, 219, 0.85)";

        this.drawTriangle(r);
        this.drawCircleSector(r);
        this.drawRectangle(r);

        this.ctx.restore();
    }

    drawTriangle(r) {
        const first = this.toCanvas(-r, 0);
        const second = this.toCanvas(0, r);
        const third = this.toCanvas(0, 0);

        this.ctx.beginPath();

        this.ctx.moveTo(first.x, first.y);
        this.ctx.lineTo(second.x, second.y);
        this.ctx.lineTo(third.x, third.y);

        this.ctx.closePath();
        this.ctx.fill();
    }

    drawCircleSector(r) {
        const radius = r * this.scale;


        this.ctx.beginPath();

        this.ctx.moveTo(
            this.centerX,
            this.centerY
        );

        this.ctx.lineTo(
            this.centerX,
            this.centerY - radius
        );

        this.ctx.arc(
            this.centerX,
            this.centerY,
            radius,
            -Math.PI / 2,
            0,
            false
        );

        this.ctx.closePath();

        this.ctx.fill();
    }

    drawRectangle(r) {
        const topLeft = this.toCanvas(0, 0);
        const bottomRight = this.toCanvas(r / 2, -r);

        const width =
            bottomRight.x - topLeft.x;

        const height =
            bottomRight.y - topLeft.y;

        this.ctx.fillRect(
            topLeft.x,
            topLeft.y,
            width,
            height
        );
    }

    drawAxes(r) {
        this.ctx.save();

        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";
        this.ctx.lineWidth = 1.5;

        const axisLength = r * 1.25 * this.scale;


        this.ctx.beginPath();

        this.ctx.moveTo(
            this.centerX - axisLength,
            this.centerY
        );

        this.ctx.lineTo(
            this.centerX + axisLength,
            this.centerY
        );

        this.ctx.stroke();


        this.drawArrow(
            this.centerX + axisLength,
            this.centerY,
            "right"
        );


        this.ctx.beginPath();

        this.ctx.moveTo(
            this.centerX,
            this.centerY + axisLength
        );

        this.ctx.lineTo(
            this.centerX,
            this.centerY - axisLength
        );

        this.ctx.stroke();


        this.drawArrow(
            this.centerX,
            this.centerY - axisLength,
            "up"
        );

        this.ctx.restore();
    }

    drawArrow(x, y, direction) {
        const size = 7;

        this.ctx.beginPath();

        if (direction === "right") {

            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - size, y - size / 2);

            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - size, y + size / 2);

        } else if (direction === "up") {

            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - size / 2, y + size);

            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + size / 2, y + size);
        }

        this.ctx.stroke();
    }

    drawLabels(r) {
        this.ctx.save();

        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "black";

        this.ctx.font = "14px Arial";


        this.drawXTick(-r, "-R");
        this.drawXTick(-r / 2, "-R/2");

        this.drawXTick(r / 2, "R/2");
        this.drawXTick(r, "R");


        this.drawYTick(r, "R");
        this.drawYTick(r / 2, "R/2");

        this.drawYTick(-r / 2, "-R/2");
        this.drawYTick(-r, "-R");


        const axisLength = r * 1.25 * this.scale;

        this.ctx.fillText(
            "X",
            this.centerX + axisLength + 8,
            this.centerY - 7
        );

        this.ctx.fillText(
            "Y",
            this.centerX + 8,
            this.centerY - axisLength - 5
        );

        this.ctx.restore();
    }

    drawXTick(value, label) {
        const point = this.toCanvas(value, 0);

        const tickSize = 5;

        this.ctx.beginPath();

        this.ctx.moveTo(
            point.x,
            point.y - tickSize
        );

        this.ctx.lineTo(
            point.x,
            point.y + tickSize
        );

        this.ctx.stroke();

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";

        this.ctx.fillText(
            label,
            point.x,
            point.y + 8
        );
    }

    drawYTick(value, label) {
        const point = this.toCanvas(0, value);

        const tickSize = 5;

        this.ctx.beginPath();

        this.ctx.moveTo(
            point.x - tickSize,
            point.y
        );

        this.ctx.lineTo(
            point.x + tickSize,
            point.y
        );

        this.ctx.stroke();

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(
            label,
            point.x + 9,
            point.y
        );
    }

    drawPoint(x, y, hit) {
        const point = this.toCanvas(x, y);

        this.ctx.save();

        this.ctx.beginPath();

        this.ctx.arc(
            point.x,
            point.y,
            5,
            0,
            Math.PI * 2
        );

        this.ctx.fillStyle = hit
            ? "green"
            : "red";

        this.ctx.fill();

        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;

        this.ctx.stroke();

        this.ctx.restore();
    }
}
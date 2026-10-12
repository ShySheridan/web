import { AreaChecker } from "./AreaChecker.js";
import { CanvasRenderer } from "./CanvasRenderer.js";
import { ResultStorage } from "./ResultStorage.js";

class App {
    constructor() {
        this.form = document.getElementById("point-form");
        this.xInput = document.getElementById("x");
        this.rInput = document.getElementById("r");

        this.errorMessage = document.getElementById("error-message");

        this.resultsBody = document.getElementById("results-body");

        this.canvas = document.getElementById("graph");

        this.areaChecker = new AreaChecker();
        this.storage = new ResultStorage();
        this.renderer = new CanvasRenderer(this.canvas);
    }

    init() {
        this.form.addEventListener("submit", (event) => {
            this.handleSubmit(event);
        });

        this.renderTable();

        this.renderer.draw(3);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.clearError();

        const x = this.parseNumber(this.xInput.value);
        const y = this.getSelectedY();
        const r = this.parseNumber(this.rInput.value);

        if (!this.validate(x, y, r)) {
            return;
        }

        const hit = this.areaChecker.isHit(x, y, r);

        const result = {
            x: x,
            y: y,
            r: r,
            hit: hit,

            timestamp: Date.now()
        };

        this.storage.add(result);

        this.renderTable();

        this.renderer.draw(r);
        this.renderer.drawPoint(x, y, hit);
    }


    parseNumber(value) {
        const normalizedValue = value
            .trim()
            .replace(",", ".");

        if (normalizedValue === "") {
            return NaN;
        }


        if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(normalizedValue)) {
            return NaN;
        }

        return Number(normalizedValue);
    }

    getSelectedY() {
        const selectedY = document.querySelector(
            'input[name="y"]:checked'
        );

        if (selectedY === null) {
            return null;
        }

        return Number(selectedY.value);
    }

    validate(x, y, r) {
        if (!Number.isFinite(x)) {
            this.showError("X должен быть числом.");
            return false;
        }

        if (x < -5 || x > 3) {
            this.showError(
                "X должен находиться в диапазоне от -5 до 3."
            );
            return false;
        }

        if (y === null) {
            this.showError("Выберите значение Y.");
            return false;
        }

        const allowedYValues = [
            -3, -2, -1, 0, 1, 2, 3, 4, 5
        ];

        if (!allowedYValues.includes(y)) {
            this.showError("Выбрано недопустимое значение Y.");
            return false;
        }

        if (!Number.isFinite(r)) {
            this.showError("R должен быть числом.");
            return false;
        }

        if (r < 2 || r > 5) {
            this.showError(
                "R должен находиться в диапазоне от 2 до 5."
            );
            return false;
        }

        return true;
    }

    showError(message) {
        this.errorMessage.textContent = message;
    }

    clearError() {
        this.errorMessage.textContent = "";
    }

    renderTable() {
        this.resultsBody.innerHTML = "";

        const results = this.storage.getAll();

        for (const result of results) {
            const row = document.createElement("tr");

            const xCell = document.createElement("td");
            const yCell = document.createElement("td");
            const rCell = document.createElement("td");
            const hitCell = document.createElement("td");
            const dateCell = document.createElement("td");

            xCell.textContent = result.x;
            yCell.textContent = result.y;
            rCell.textContent = result.r;

            hitCell.textContent = result.hit
                ? "Попадание"
                : "Промах";

            dateCell.textContent =
                this.formatDate(result.timestamp);

            row.appendChild(xCell);
            row.appendChild(yCell);
            row.appendChild(rCell);
            row.appendChild(hitCell);
            row.appendChild(dateCell);

            this.resultsBody.appendChild(row);
        }
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);

        return date.toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
}

const app = new App();
app.init();
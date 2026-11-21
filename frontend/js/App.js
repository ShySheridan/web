import { AreaChecker } from "./AreaChecker.js";
import { CanvasRenderer } from "./CanvasRenderer.js";
import { ResultStorage } from "./ResultStorage.js";

class App {
    constructor() {
        this.form = document.getElementById("point-form");
        this.rInput = this.form.elements.r;
        this.error = document.getElementById("error-message");
        this.button = document.getElementById("submit-button");
        this.resultsBody = document.getElementById("results-body");
        this.checker = new AreaChecker();
        this.storage = new ResultStorage();
        this.renderer = new CanvasRenderer(document.getElementById("graph"));
        this.results = [];
    }

    init() {
        this.form.addEventListener("submit", event => this.handleSubmit(event));
        this.rInput.addEventListener("change", () => this.drawGraph());
        window.addEventListener("storage", event => {
            if (event.key === null || event.key.startsWith(this.storage.prefix)) this.loadResults();
        });
        this.loadResults();
    }

    loadResults() {
        try {
            this.results = this.storage.getAll();
        } catch {
            this.error.textContent = "Браузер ограничил доступ к сохранённой истории.";
        }
        this.render();
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.button.disabled) return;
        this.error.textContent = "";
        const fields = new FormData(this.form);
        const y = fields.get("y").trim().replace("−", "-").replace(",", ".");
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(y)) {
            this.error.textContent = "Введите десятичное число для Y.";
            return;
        }
        // У граничных значений −5 и 3 после точки допустимы только нули.
        const allowedY = y.startsWith("-")
            ? /^-0*(?:[0-4](?:\.\d*)?|5(?:\.0*)?|\.\d+)$/
            : /^\+?0*(?:[0-2](?:\.\d*)?|3(?:\.0*)?|\.\d+)$/;
        if (!allowedY.test(y)) {
            this.error.textContent = "Y должен быть от −5 до 3 включительно.";
            return;
        }

        fields.set("y", y);
        this.button.disabled = true;
        this.button.textContent = "Проверка…";
        try {
            const row = await this.checker.check(this.form.action, fields);
            this.results.unshift(row);
            try {
                this.storage.add(row);
            } catch {
                this.error.textContent = "Точка проверена. Браузеру не удалось сохранить результат.";
            }
            this.render();
        } catch (error) {
            this.error.textContent = error instanceof TypeError
                ? "Не удалось связаться с сервером." : error.message;
        } finally {
            this.button.disabled = false;
            this.button.textContent = "Проверить";
        }
    }

    drawGraph() {
        const r = Number(this.rInput.value);
        const points = this.results.filter(row => row.r === r);
        this.renderer.draw(r, points);
        for (const row of points.slice().reverse()) {
            this.renderer.drawPoint(row.x, Number(row.y), row.hit);
        }
    }

    render() {
        this.drawGraph();
        this.resultsBody.replaceChildren();
        if (!this.results.length) {
            const cell = this.resultsBody.insertRow().insertCell();
            cell.colSpan = 6;
            cell.className = "empty";
            cell.textContent = "Проверок пока нет";
            return;
        }
        for (const result of this.results) {
            const row = this.resultsBody.insertRow();
            row.insertCell().textContent = result.x;
            row.insertCell().textContent = result.y;
            row.insertCell().textContent = result.r;
            const hit = row.insertCell();
            hit.className = result.hit ? "hit" : "miss";
            hit.textContent = result.hit ? "Попадание" : "Промах";
            row.insertCell().textContent = new Date(result.timestamp).toLocaleString("ru-RU");
            row.insertCell().textContent = (result.elapsedNanos / 1000).toLocaleString("ru-RU", {
                maximumFractionDigits: 3
            });
        }
    }
}

new App().init();
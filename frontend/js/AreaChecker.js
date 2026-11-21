export class AreaChecker {
    async check(url, fields) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: new URLSearchParams(fields)
        });

        if (!response.headers.get("Content-Type")?.includes("application/json")) {
            throw new Error(`Сервер не вернул результат (HTTP ${response.status}).`);
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `Ошибка HTTP ${response.status}.`);
        }
        return data;
    }
}

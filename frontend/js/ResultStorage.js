export class ResultStorage {

    constructor() {
        this.storageKey = "point-check-results";
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey);

        if (data === null) {
            return [];
        }

        try {
            const results = JSON.parse(data);

            if (!Array.isArray(results)) {
                return [];
            }

            return results;
        } catch (error) {
            console.error(
                "Не удалось прочитать результаты из LocalStorage:",
                error
            );

            return [];
        }
    }

    add(result) {
        const results = this.getAll();

        results.push(result);

        this.save(results);
    }

    save(results) {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(results)
        );
    }

    clear() {
        localStorage.removeItem(this.storageKey);
    }
}
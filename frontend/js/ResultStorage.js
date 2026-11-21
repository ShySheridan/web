export class ResultStorage {
    prefix = "point-check:lab2:";

    getAll() {
        const rows = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key?.startsWith(this.prefix)) continue;
            try {
                const row = JSON.parse(localStorage.getItem(key));
                if (row && typeof row.hit === "boolean" && Number.isFinite(row.r)
                    && Number.isFinite(row.x) && Number.isFinite(Number(row.y))
                    && Number.isFinite(row.elapsedNanos) && Number.isFinite(Date.parse(row.timestamp))) {
                    rows.push(row);
                }
            } catch (error) {
                if (!(error instanceof SyntaxError)) throw error;
            }
        }
        return rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }

    add(row) {
        localStorage.setItem(this.prefix + row.id, JSON.stringify(row));
    }
}

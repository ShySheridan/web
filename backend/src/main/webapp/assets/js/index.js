(() => {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    const form = document.getElementById('point-form');
    const radiusBoxes = [...form.querySelectorAll('input[name="r"]')];
    const origin = { x: canvas.width / 2, y: canvas.height / 2 };
    const scale = 36;
    const coord = (x, y) => [origin.x + x * scale, origin.y - y * scale];

    function draw() {
        const r = Number(radiusBoxes.find(box => box.checked)?.value || 3);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1683d8';
        let [x1, y1] = coord(-r, r); let [x2, y2] = coord(0, 0);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        ctx.beginPath();
        let [ox, oy] = coord(0, 0);
        ctx.moveTo(ox, oy); ctx.lineTo(...coord(r, 0)); ctx.lineTo(...coord(0, -r / 2)); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.arc(ox, oy, r * scale / 2, Math.PI / 2, Math.PI); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#263746'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(25, oy); ctx.lineTo(canvas.width - 18, oy); ctx.moveTo(canvas.width - 18, oy); ctx.lineTo(canvas.width - 27, oy - 5); ctx.moveTo(canvas.width - 18, oy); ctx.lineTo(canvas.width - 27, oy + 5);
        ctx.moveTo(ox, canvas.height - 20); ctx.lineTo(ox, 18); ctx.moveTo(ox, 18); ctx.lineTo(ox - 5, 27); ctx.moveTo(ox, 18); ctx.lineTo(ox + 5, 27); ctx.stroke();
        ctx.fillStyle = '#263746'; ctx.font = '13px system-ui'; ctx.fillText('x', canvas.width - 16, oy - 8); ctx.fillText('y', ox + 8, 17);
        const labels = [[-r, 0, '-R'], [-r / 2, 0, '-R/2'], [r / 2, 0, 'R/2'], [r, 0, 'R'],
            [0, r, 'R'], [0, r / 2, 'R/2'], [0, -r / 2, '-R/2'], [0, -r, '-R']];
        ctx.font = '12px system-ui';
        labels.forEach(([lx, ly, label]) => {
            const [px, py] = coord(lx, ly);
            ctx.beginPath(); ctx.moveTo(px - (ly === 0 ? 3 : 0), py - (lx === 0 ? 3 : 0));
            ctx.lineTo(px + (ly === 0 ? 3 : 0), py + (lx === 0 ? 3 : 0)); ctx.stroke();
            ctx.fillText(label, px + (ly === 0 ? -label.length * 3 : 6), py + (lx === 0 ? 4 : 14));
        });
        document.querySelectorAll('.saved-point').forEach(row => {
            if (Number(row.dataset.r) !== r) return;
            const [px, py] = coord(Number(row.dataset.x), Number(row.dataset.y));
            ctx.fillStyle = row.dataset.hit === 'true' ? '#17854a' : '#b3261e';
            ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
        });
    }

    radiusBoxes.forEach(box => box.addEventListener('change', () => {
        if (box.checked) radiusBoxes.filter(other => other !== box).forEach(other => other.checked = false);
        draw();
    }));
    form.addEventListener('submit', event => {
        const y = form.elements.y.value.trim().replace('−', '-').replace(',', '.');
        const checked = radiusBoxes.filter(box => box.checked);
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(y) || Number(y) < -3 || Number(y) > 3 || checked.length !== 1) {
            event.preventDefault(); alert('Введите Y от −3 до 3 и выберите ровно один радиус.'); return;
        }
        form.elements.y.value = y;
    });
    canvas.addEventListener('click', event => {
        if (!radiusBoxes.some(box => box.checked)) { alert('Сначала выберите радиус R.'); return; }
        const rect = canvas.getBoundingClientRect();
        const px = (event.clientX - rect.left) * canvas.width / rect.width;
        const py = (event.clientY - rect.top) * canvas.height / rect.height;
        const x = Math.max(-4, Math.min(4, Math.round((px - origin.x) / scale)));
        const y = Math.max(-3, Math.min(3, Math.round((origin.y - py) / scale * 10) / 10));
        form.elements.x.value = String(x);
        form.elements.y.value = String(y);
        form.requestSubmit();
    });
    draw();
})();

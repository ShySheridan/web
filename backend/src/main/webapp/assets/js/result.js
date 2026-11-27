(() => {
    const canvas = document.getElementById('result-graph');
    const ctx = canvas.getContext('2d');
    const { r, x, y, hit } = canvas.dataset;
    const radius = Number(r);
    const pointX = Number(x);
    const pointY = Number(y);
    const isHit = hit === 'true';
    const scale = 36;
    const ox = canvas.width / 2;
    const oy = canvas.height / 2;
    const point = (px, py) => [ox + px * scale, oy - py * scale];

    ctx.fillStyle = '#1683d8';
    const [sx, sy] = point(-radius, radius);
    ctx.fillRect(sx, sy, radius * scale, radius * scale);
    ctx.beginPath(); ctx.moveTo(...point(0, 0)); ctx.lineTo(...point(radius, 0)); ctx.lineTo(...point(0, -radius / 2)); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(...point(0, 0)); ctx.arc(ox, oy, radius * scale / 2, Math.PI / 2, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#263746'; ctx.beginPath(); ctx.moveTo(25, oy); ctx.lineTo(canvas.width - 18, oy); ctx.moveTo(ox, canvas.height - 20); ctx.lineTo(ox, 18); ctx.stroke();
    const [px, py] = point(pointX, pointY);
    ctx.fillStyle = isHit ? '#17854a' : '#b3261e'; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
})();

// particle (tezkor)
function createParticle() {
  const p = document.createElement('div');
  p.style.position = 'fixed';
  p.style.width = '2px';
  p.style.height = '2px';
  p.style.background = 'rgba(255,215,0,.6)';
  p.style.borderRadius = '50%';
  p.style.pointerEvents = 'none';
  p.style.zIndex = '-1';
  p.style.left = Math.random() * window.innerWidth + 'px';
  p.style.top = '-10px';
  p.style.animation = `fall ${2 + Math.random() * 3}s linear forwards`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 5000);
}
for (let i = 0; i < 30; i++) setTimeout(createParticle, i * 200);
window.setInterval(createParticle, 400);

// barcha buyurtmalar
async function loadAll() {
  const res = await fetch('/api/orders');
  const all = await res.json();
  const box = document.getElementById('orders');
  if (!all.length) { box.innerHTML = "Hozircha buyurtma yo'q"; return; }
  box.innerHTML = '';
  all.forEach(o => {
    const div = document.createElement('div');
    div.className = 'order-card';
    div.innerHTML = `
    <div class="order-phone">📞 ${o.phone}</div>
      <div class="order-items">${o.items.map(i=>`• ${i.name} ×${i.qty} = ${i.sub.toLocaleString()} so'm`).join('<br>')}</div>
      <div class="order-total">Jami: ${o.total.toLocaleString()} so'm</div>
      <div>Karta: ${o.card}</div>
      <a href="https://www.google.com/maps?q=${o.location.latitude},${o.location.longitude}" target="_blank">📍 Joylashuv</a>
      ${o.screenshot ? `<div class="order-screenshot"><img src="data:image/jpeg;base64,${o.screenshot}" alt="screenshot"></div>` : ''}
    `;
    box.appendChild(div);
  });
}
loadAll();
setInterval(loadAll, 30000);

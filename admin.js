// Particle
function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
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

const orders = [
  {
    phone: "+998991234567",
    items: [
      { name: "Burger", qty: 2, sub: 100000 },
      { name: "Pepsi", qty: 1, sub: 10000 }
    ],
    total: 110000,
    card: "8600 1234 5678 9012",
    location: { latitude: 41.3111, longitude: 69.2797 },
    screenshot: null // base64
  }
];

function renderOrders() {
  const container = document.getElementById('orders');
  container.innerHTML = '';
  orders.forEach((o, idx) => {
    const div = document.createElement('div');
    div.className = 'order-card';
    let html = `
      <div class="order-phone">📞 ${o.phone}</div>
      <div class="order-items">
        ${o.items.map(i => `• ${i.name} ×${i.qty} = ${i.sub.toLocaleString()} so‘m`).join('<br>')}
      </div>
      <div class="order-total">Jami: ${o.total.toLocaleString()} so‘m</div>
      <div>Karta: ${o.card}</div>
      <a href="https://maps.google.com/?q=${o.location.latitude},${o.location.longitude}" target="_blank">📍 Joylashuv</a>
    `;
    if (o.screenshot) {
      html += `<div class="order-screenshot"><img src="data:image/jpeg;base64,${o.screenshot}" alt="screenshot"></div>`;
    }
    div.innerHTML = html;
    container.appendChild(div);
  });
}

renderOrders();

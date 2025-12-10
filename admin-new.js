// particle
(function particleLoop() {
  const p = document.createElement('div');
  p.style.position = 'fixed'; p.style.width = '3px'; p.style.height = '3px';
  p.style.background = 'rgba(255,215,0,.7)'; p.style.borderRadius = '50%';
  p.style.pointerEvents = 'none'; p.style.zIndex = '-1';
  p.style.left = Math.random() * window.innerWidth + 'px'; p.style.top = '-10px';
  p.style.animation = `fall ${2 + Math.random() * 4}s linear forwards`;
  document.body.appendChild(p); setTimeout(() => p.remove(), 6000);
  setTimeout(particleLoop, 400);
})();

// yangi buyurtma olish
async function loadNew() {
  const res = await fetch('/api/new-order-list');
  const list = await res.json();
  const card = document.getElementById('card');
  if (!list.length) { card.innerHTML = "<div style='text-align:center;color:#aaa;'>Hozircha yangi buyurtma yo‘q</div>"; return; }

  const o = list[0];
  card.innerHTML = `
    <div class="row">
      <div class="label">Telefon</div>
      <div class="value">${o.phone}</div>
    </div>
    <div class="row">
      <div class="label">Ovqatlar</div>
      <div class="value">${o.items.map(i=>`• ${i.name} ×${i.qty} = ${i.sub.toLocaleString()} so'm`).join('<br>')}</div>
    </div>
    <div class="row">
      <div class="label">Jami</div>
      <div class="value">${o.total.toLocaleString()} so'm</div>
    </div>
    <div class="row">
      <div class="label">Karta</div>
      <div class="value">${o.card}</div>
    </div>
    <div class="row">
      <div class="label">Joylashuv</div>
      <div class="value"><a href="https://www.google.com/maps?q=${o.location.latitude},${o.location.longitude}" target="_blank" style="color:var(--gold);">📍 Xaritada ko‘rish</a></div>
    </div>
    <div class="row">
      <div class="label">Vaqt</div>
      <div class="value">${o.time}</div>
    </div>
    <div class="row screenshot">
      <div class="label">Screenshot</div>
      <img src="data:image/jpeg;base64,${o.screenshot}" alt="screenshot"/>
    </div>
  `;

  document.getElementById('confirmBtn').onclick = async () => {
    const ok = await fetch('/api/confirm-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: o.id })
    });
    if (ok.ok) {
      alert('✅ Tastiqlangan!');
      location.href = 'admin-all.html';
    }
  };
}
loadNew();

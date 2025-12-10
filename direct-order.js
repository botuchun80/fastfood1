// Telegram WebApp tekshiruvi
if (!window.Telegram || !window.Telegram.WebApp) {
  alert("Iltimos, Telegram orqali kiriting! Botdan Menyu tugmasi orqali.");
  throw new Error("TWA yo‘q");
}
const tg = window.Telegram.WebApp;
tg.expand(); // to‘liq ekran

// Xavfsiz user_id
const user = tg.initDataUnsafe?.user;
if (!user || !user.id) {
  alert("User ma’lumotlari topilmadi.");
  throw new Error("user.id mavjud emas");
}
const USER_ID = user.id;

const CART  = JSON.parse(localStorage.getItem('cart') || '[]');
const PHONE = localStorage.getItem('phone') || '';
let lat = 0, lon = 0, screenshot = '';

function sum() { return CART.reduce((s, i) => s + i.qty * i.price, 0); }
document.getElementById('orderSum').innerHTML =
  CART.map(i => `• ${i.name} ×${i.qty} = ${(i.qty * i.price).toLocaleString()} so'm`).join('<br>') +
  `<br><b>Jami: ${sum().toLocaleString()} so'm</b>`;

// screenshot
document.getElementById('sshot').onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => screenshot = reader.result.split(',')[1];
  reader.readAsDataURL(file);
};

// joylashuv
document.getElementById('locBtn').onclick = () => {
  if (!navigator.geolocation) return alert('Geolocation yo‘q');
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    document.getElementById('locStatus').textContent = '📍 Joylashuv olindi';
    document.getElementById('locBtn').style.display = 'none';
  }, err => alert('Ruxsat bering!'));
};

// ========== DARHOL ADMIN PANELGA YUBORISH ==========
document.getElementById('submitBtn').onclick = async () => {
  if (!screenshot) return alert('Screenshot yuklang!');
  if (!lat || !lon) return alert('Joylashuv yuboring!');

  const payload = {
    phone: PHONE,
    items: CART.map(i => ({ name: i.name, qty: i.qty, sub: i.qty * i.price })),
    total: sum(),
    card: '8600 1234 5678 9012',
    location: { latitude: lat, longitude: lon },
    screenshot: screenshot,
    time: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
  };

  try {
    const res = await fetch('https://your-vps.com/api/direct-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      tg.sendData(JSON.stringify({ action: 'done' }));
      tg.close();
    } else {
      alert('Serverda xatolik');
    }
  } catch (e) {
    alert('Internet yo‘q');
  }
};

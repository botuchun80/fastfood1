const CART  = JSON.parse(localStorage.getItem('cart') || '[]');
const PHONE = localStorage.getItem('phone') || '';
let lat = 0, lon = 0, screenshot = '';

function sum() { return CART.reduce((s, i) => s + i.price * i.qty, 0); }
document.getElementById('orderSum').innerHTML =
  CART.map(i => `• ${i.name} ×${i.qty} = ${(i.price * i.qty).toLocaleString()} so'm`).join('<br>') +
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

// buyurtma yuborish
document.getElementById('submitBtn').onclick = async () => {
  if (!screenshot) return alert('Screenshot yuklang!');
  if (!lat || !lon) return alert('Joylashuv yuboring!');

  const data = {
    action: 'order',
    phone: PHONE,
    items: CART.map(i => ({name:i.name, qty:i.qty, sub:i.price*i.qty})),
    total: sum(),
    card: '8600 1234 5678 9012',
    location: {latitude: lat, longitude: lon},
    screenshot
  };

  window.Telegram.WebApp.sendData(JSON.stringify(data));
  window.Telegram.WebApp.close();
};

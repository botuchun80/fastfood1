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

const items = [
  { id: 1, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { id: 2, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { id: 3, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { id: 4, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { id: 5, img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 },
  { id: 6, img: "https://i.ibb.co/q3590gwQ/cia493tenntd8rfc2s40-1.jpg", name: "Coca-Cola", price: 10000 }
];

let cart = [];
let locationData = null;
let screenshotFile = null;

const list = document.getElementById('list');
const cartIcon = document.getElementById('cartIcon');
const cartBadge = document.getElementById('cartBadge');
const cartScreen = document.getElementById('cartScreen');
const closeCart = document.getElementById('closeCart');
const cartList = document.getElementById('cartList');
const totalSum = document.getElementById('totalSum');
const nextBtn = document.getElementById('nextBtn');

const locationScreen = document.getElementById('locationScreen');
const closeLocation = document.getElementById('closeLocation');
const mapBox = document.getElementById('map');
const backFromLocation = document.getElementById('backFromLocation');
const confirmLocation = document.getElementById('confirmLocation');

const paymentScreen = document.getElementById('paymentScreen');
const closePayment = document.getElementById('closePayment');
const finalSum = document.getElementById('finalSum');
const cardInput = document.getElementById('cardInput');
const screenshot = document.getElementById('screenshot');
const screenshotPreview = document.getElementById('screenshotPreview');
const backFromPayment = document.getElementById('backFromPayment');
const confirmPayment = document.getElementById('confirmPayment');

items.forEach((it, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${i * 0.1}s`;
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="addToCart(${it.id})">Tanlash</button>
    </div>`;
  list.appendChild(card);
});

function addToCart(id) {
  const item = items.find(i => i.id === id);
  const exist = cart.find(i => i.id === id);
  if (exist) exist.qty += 1;
  else cart.push({ ...item, qty: 1 });
  updateBadge();
  Telegram.WebApp.showPopup({ title: "✅", message: `${item.name} savatga qo‘shildi` });
}

function updateBadge() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = totalItems;
  cartBadge.style.animation = 'none';
  setTimeout(() => cartBadge.style.animation = 'pulseGlow 3s infinite', 10);
}

cartIcon.onclick = () => {
  renderCart();
  cartScreen.classList.remove('hidden');
};

closeCart.onclick = () => cartScreen.classList.add('hidden');

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx) => {
    const sub = it.price * it.qty;
    total += sub;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${it.img}" alt="">
      <div class="cart-item-info">
        <div class="cart-item-name">${it.name}</div>
        <div class="cart-item-price">${sub.toLocaleString()} so‘m</div>
      </div>
      <div class="cart-item-controls">
        <button onclick="changeQty(${idx},-1)">-</button>
        <input value="${it.qty}" readonly>
        <button onclick="changeQty(${idx},1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${idx})">O‘chirish</button>`;
    cartList.appendChild(div);
  });
  totalSum.textContent = total.toLocaleString() + ' so‘m';
  finalSum.textContent = total.toLocaleString() + ' so‘m';
}

function changeQty(idx, delta) {
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  renderCart();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  renderCart();
  updateBadge();
}

nextBtn.onclick = () => {
  cartScreen.classList.add('hidden');
  locationScreen.classList.remove('hidden');
  initMap();
};

closeLocation.onclick = () => locationScreen.classList.add('hidden');
backFromLocation.onclick = () => {
  locationScreen.classList.add('hidden');
  cartScreen.classList.remove('hidden');
};

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      locationData = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      mapBox.innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
        src="https://maps.google.com/maps?q=${locationData.latitude},${locationData.longitude}&hl=en&z=16&amp;output=embed"></iframe>`;
    }, err => {
      mapBox.innerHTML = "Joylashuvni yoqib qo‘ying";
    });
  } else {
    mapBox.innerHTML = "Brauzer geolocation ni qo‘llab-quvvatlamaydi";
  }
}

confirmLocation.onclick = () => {
  if (!locationData) return Telegram.WebApp.showPopup({ title: "⚠️", message: "Joylashuvni tanlang" });
  locationScreen.classList.add('hidden');
  paymentScreen.classList.remove('hidden');
};

closePayment.onclick = () => paymentScreen.classList.add('hidden');
backFromPayment.onclick = () => {
  paymentScreen.classList.add('hidden');
  locationScreen.classList.remove('hidden');
};

screenshot.onchange = e => {
  screenshotFile = e.target.files[0];
  if (screenshotFile) {
    const reader = new FileReader();
    reader.onload = () => {
      screenshotPreview.innerHTML = `<img src="${reader.result}" alt="screenshot">`;
      screenshotPreview.classList.remove('hidden');
    };
    reader.readAsDataURL(screenshotFile);
  }
};

confirmPayment.onclick = async () => {
  if (!screenshotFile) return Telegram.WebApp.showPopup({ title: "⚠️", message: "Screenshot yuklang" });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const phone = new URLSearchParams(location.search).get("phone") || "";
  const order = cart.map(i => ({ name: i.name, price: i.price, qty: i.qty, sub: i.price * i.qty }));
  const payload = { action: "order", phone, items: order, card: "8600 1234 5678 9012", total, location: locationData };

  const reader = new FileReader();
  reader.onload = () => {
    Telegram.WebApp.sendData(JSON.stringify({ ...payload, screenshot: reader.result.split(',')[1] }));
    Telegram.WebApp.showPopup({ title: "✅", message: "Buyurtma yuborildi!" });
  };
  reader.readAsDataURL(screenshotFile);
};

if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

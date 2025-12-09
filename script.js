// particle background
(function particleLoop() {
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
  setTimeout(particleLoop, 300);
})();

// Mahsulotlar
const items = [
  { id: 1, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { id: 2, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { id: 3, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { id: 4, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { id: 5, img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 },
  { id: 6, img: "https://i.ibb.co/q3590gwQ/cia493tenntd8rfc2s40-1.jpg", name: "Coca-Cola", price: 10000 }
];

// Avtomatik telefon
const params = new URLSearchParams(location.search);
const phone = params.get('phone');
if (phone) localStorage.setItem('phone', phone);

// Savat
let CART = JSON.parse(localStorage.getItem('cart') || '[]');
function saveCart() { localStorage.setItem('cart', JSON.stringify(CART)); }

// Ekranga chiqarish
const list = document.getElementById('list');
items.forEach((it, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${i * 0.1}s`;
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so'm</div>
    </div>
    <button class="addBtn" data-id="${it.id}">＋</button>`;
  list.appendChild(card);
});

// Savatga qo‘shish
document.addEventListener('click', e => {
  if (e.target.classList.contains('addBtn')) {
    const id = +e.target.dataset.id;
    const item = items.find(x => x.id === id);
    const ex = CART.find(x => x.id === id);
    if (ex) ex.qty++;
    else CART.push({...item, qty: 1});
    saveCart();
    animateCartIcon();
  }
});

// Savat ikonkasi
function animateCartIcon() {
  let icon = document.getElementById('cartIcon');
  if (!icon) {
    icon = document.createElement('div');
    icon.id = 'cartIcon';
    icon.onclick = () => location.href = 'cart.html';
    document.body.appendChild(icon);
  }
  icon.innerHTML = `<span>${CART.reduce((s, i) => s + i.qty, 0)}</span>`;
}
animateCartIcon();

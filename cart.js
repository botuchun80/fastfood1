const CART = JSON.parse(localStorage.getItem('cart') || '[]');
function saveCart() { localStorage.setItem('cart', JSON.stringify(CART)); }
function render() {
  const box = document.getElementById('cartList');
  box.innerHTML = '';
  let total = 0;
  CART.forEach((it, idx) => {
    total += it.price * it.qty;
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${it.img}" />
      <div>
        <div class="n">${it.name}</div>
        <div class="p">${(it.price * it.qty).toLocaleString()} so'm</div>
      </div>
      <div class="ctrl">
        <button onclick="change(${idx},-1)">−</button>
        <span>${it.qty}</span>
        <button onclick="change(${idx},1)">+</button>
        <button onclick="remove(${idx})">✕</button>
      </div>`;
    box.appendChild(div);
  });
  document.getElementById('total').textContent = 'Jami: ' + total.toLocaleString() + ' so\'m';
  saveCart();
}
function change(i, d) {
  CART[i].qty += d;
  if (CART[i].qty <= 0) CART.splice(i, 1);
  render();
}
function remove(i) { CART.splice(i, 1); render(); }
render();

document.getElementById('nextBtn').onclick = () => {
  if (!CART.length) return alert('Savat bo\'sh!');
  location.href = 'checkout.html';
};

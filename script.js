const items = [
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 },
  { img: "https://i.ibb.co/q3590gwQ/cia493tenntd8rfc2s40-1.jpg", name: "Coca-Cola", price: 10000 },
];

let cart = {};          // {id: qty}
let phone   = null;     // telefon
let userLoc = null;     // {lat, lon}

const list      = document.getElementById('list');
const cartIcon  = document.getElementById('cartIcon');
const overlay   = document.getElementById('cartOverlay');
const cartList  = document.getElementById('cartList');
const cartSum   = document.getElementById('cartSum');

/* ---------- mahsulotlar ro‘yxati ---------- */
items.forEach(it=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn-add" onclick="addToCart(${it.id})">➕ Qo'shish</button>
    </div>`;
  list.appendChild(card);
});

/* ---------- savatga qo‘shish ---------- */
function addToCart(id){
  cart[id] = (cart[id]||0)+1;
  renderCartIcon();
  showSnack(items.find(i=>i.id===id).name+" qo'shildi ✔");
}

/* ---------- savat ikonkasi ---------- */
function renderCartIcon(){
  const totalQty = Object.values(cart).reduce((a,b)=>a+b,0);
  cartIcon.classList.toggle('hidden', totalQty===0);
  cartIcon.querySelector('.cart-count').textContent = totalQty;
}
renderCartIcon();

/* ---------- ikonkaga bosilsa ---------- */
cartIcon.addEventListener('click', openCart);

function openCart(){
  if(Object.keys(cart).length===0) return;
  updateCartModal();
  overlay.classList.remove('hidden');
}
function closeCart(){
  overlay.classList.add('hidden');
}

function updateCartModal(){
  cartList.innerHTML='';
  let total = 0;
  for(const id in cart){
    const {name,price} = items.find(i=>i.id==id);
    const qty = cart[id];
    total += price*qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${name} ×${qty}</span>
      <span>${(price*qty).toLocaleString()} so‘m
        <span class="cart-item-remove" onclick="removeFromCart(${id})">✖</span>
      </span>`;
    cartList.appendChild(li);
  }
  cartSum.textContent = total.toLocaleString()+" so‘m";
}
function removeFromCart(id){
  if(--cart[id]<=0) delete cart[id];
  renderCartIcon();
  updateCartModal();
  if(Object.keys(cart).length===0) closeCart();
}

/* ---------- joylashuv ---------- */
function checkLocation(){
  if(!window.Telegram.WebApp){
    alert("Joylashuv (test): 41.311151, 69.279737");
    userLoc = {latitude:41.311151,longitude:69.279737};
    sendOrder();
    return;
  }
  Telegram.WebApp.requestLocation(loc=>{
    if(!loc){
      alert("Iltimos, joylashuvni yoqing.");
      return;
    }
    userLoc = loc;
    sendOrder();
  });
}

/* ---------- buyurtma yuborish ---------- */
function sendOrder(){
  if(Object.keys(cart).length===0) return;
  const order = Object.entries(cart).map(([id,q])=>{
    const {name,price} = items.find(i=>i.id==id);
    return {name,qty:q,sub:price*q};
  });
  const payload = {
    action:"order",
    phone:phone,
    items:order,
    location:userLoc
  };
  if(window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify(payload));
    Telegram.WebApp.close();
  }else{
    alert("Buyurtma (test)\n"+JSON.stringify(payload,null,2));
  }
}

/* ---------- telefon raqamni WebApp parametridan olish ---------- */
if(window.Telegram.WebApp){
  Telegram.WebApp.ready();
  const params = new URLSearchParams(window.location.search);
  phone = params.get("phone");          // bot tomonidan berilgan
  Telegram.WebApp.expand();
}

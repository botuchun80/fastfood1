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
const cartBar   = document.getElementById('cartBar');
const cartIcon  = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartBarCount');
const cartSum   = document.getElementById('cartBarSum');
const overlay   = document.getElementById('cartOverlay');
const cartList  = document.getElementById('cartList');
const cartSumModal = document.getElementById('cartSum');

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
  renderCartBar();
  showSnack(items.find(i=>i.id===id).name+" qo'shildi ✔");
}

/* ---------- cart-bar yangilash ---------- */
function renderCartBar(){
  const totalQty = Object.values(cart).reduce((a,b)=>a+b,0);
  const totalSum = Object.entries(cart).reduce((sum,[id,q])=>{
    return sum + items.find(i=>i.id==id).price * q;
  },0);
  cartBar.classList.toggle('hidden', totalQty===0);
  cartCount.textContent = totalQty;
  cartSum.textContent = totalSum.toLocaleString()+" so‘m";
}
renderCartBar();

/* ---------- cart-bar / ikon bosilsa ---------- */
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
  cartSumModal.textContent = total.toLocaleString()+" so‘m";
}
function removeFromCart(id){
  if(--cart[id]<=0) delete cart[id];
  renderCartBar();
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

/* ---------- telefon raqamni URL parametridan olish ---------- */
if(window.Telegram.WebApp){
  Telegram.WebApp.ready();
  const params = new URLSearchParams(window.location.search);
  phone = params.get("phone");
  Telegram.WebApp.expand();
}

/* ---------- snackbar ---------- */
function showSnack(text){
  const bar = document.getElementById('snack')||createSnack();
  bar.textContent=text;
  bar.classList.add('show');
  setTimeout(()=>bar.classList.remove('show'),2000);
}
function createSnack(){
  const s=document.createElement('div');
  s.id='snack';
  document.body.appendChild(s);
  return s;
}

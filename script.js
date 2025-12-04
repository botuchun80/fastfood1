const items = [
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 },
  { img: "https://i.ibb.co/q3590gwQ/cia493tenntd8rfc2s40-1.jpg", name: "Coca-Cola", price: 10000 },
];

const list      = document.getElementById('list');
const cartEl    = document.getElementById('cart');
const cartList  = document.getElementById('cart-list');
const cartCount = document.getElementById('cart-count');
const cartSum   = document.getElementById('cart-sum');

let cart = {}; // {id:qty}

items.forEach(it=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="addCart(${it.id})">Qo'shish</button>
    </div>`;
  list.appendChild(card);
});

function addCart(id){
  cart[id] = (cart[id]||0)+1;
  renderCart();
  showSnack(items.find(i=>i.id===id).name+" qo'shildi ✔");
}

function renderCart(){
  const empty = Object.keys(cart).length===0;
  cartEl.classList.toggle('hidden',empty);
  if(empty) return;

  cartList.innerHTML='';
  let total=0, totalQty=0;
  for(const id in cart){
    const {name,price}=items.find(i=>i.id==id);
    const qty=cart[id];
    total+=price*qty;
    totalQty+=qty;
    const li=document.createElement('li');
    li.className='cart-item';
    li.innerHTML=`
      <span>${name} ×${qty}</span>
      <span>${(price*qty).toLocaleString()} so‘m
        <span class="cart-item-remove" onclick="removeCart(${id})">✖</span>
      </span>`;
    cartList.appendChild(li);
  }
  cartCount.textContent=totalQty;
  cartSum.textContent=total.toLocaleString()+" so‘m";
}

function removeCart(id){
  if(--cart[id]<=0) delete cart[id];
  renderCart();
}

function sendOrder(){
  if(Object.keys(cart).length===0) return;
  const order = Object.entries(cart).map(([id,q])=>{
    const {name,price}=items.find(i=>i.id==id);
    return {name,qty:q,sub:price*q};
  });
  if(window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify({action:"order",items:order}));
  }else{
    alert("Buyurtma yuborildi (test)\n"+JSON.stringify(order,null,2));
  }
}

function showSnack(text){
  const bar=document.getElementById('snack')||createSnack();
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

if(window.Telegram.WebApp){
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

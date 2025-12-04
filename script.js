const items = [
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 },
  { img: "https://i.ibb.co/q3590gwQ/cia493tenntd8rfc2s40-1.jpg", name: "Coca-Cola", price: 10000 },
];

const list = document.getElementById('list');
items.forEach(it=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="addCart('${it.name}')">Qo'shish</button>
    </div>`;
  list.appendChild(card);
});

function addCart(name){
  if(window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify({action:"add",item:name}));
  }
  showSnack(name+" savatchaga qo'shildi ✔");
}

function showSnack(text){
  const bar = document.getElementById('snack') || createSnack();
  bar.textContent = text;
  bar.classList.add('show');
  setTimeout(()=>bar.classList.remove('show'),2000);
}
function createSnack(){
  const s = document.createElement('div');
  s.id = 'snack';
  document.body.appendChild(s);
  return s;
}

if(window.Telegram.WebApp){
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

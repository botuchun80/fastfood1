const items = [
  { id: 1, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { id: 2, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { id: 3, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { id: 4, img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { id: 5, img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 },
  { id: 6, img: "https://i.ibb.co/q3590gwQ/cia493tenntd8rfc2s40-1.jpg", name: "Coca-Cola", price: 10000 }
];

const list = document.getElementById('list');

items.forEach((it,i)=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${i*0.08}s`;
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="sendItem('${it.name}')">Tanlash</button>
    </div>`;
  list.appendChild(card);
});

function sendItem(name){
  if(window.Telegram && window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify({action:"select",item:name}));
  }else{
    alert("Tanlandi (test): "+name);
  }
}

if(window.Telegram && window.Telegram.WebApp){
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

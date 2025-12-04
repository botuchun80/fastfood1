const items = [
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Burger", price: 50000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Cheeseburger", price: 42000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Hamburger", price: 45000 },
  { img: "https://i.ibb.co/sJtWCn5M/images-1.jpg", name: "Double Cheeseburger", price: 35000 },
  { img: "https://i.ibb.co/RkMYJJG8/44d00abe-766c-4b92-aedb-4840c48637bb.jpg", name: "Pepsi", price: 10000 }
];

const list = document.getElementById('list');
items.forEach(it=>{
  const block = document.createElement('div');
  block.className = 'item';
  block.innerHTML = `
    <img src="${it.img}">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="addCart('${it.name}')">Qo'shish</button>
    </div>`;
  list.appendChild(block);
});

function addCart(name){
  if(window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify({action:"add",item:name}));
  }else{
    alert(name + " savatchaga qo'shildi (test)");
  }
}

if(window.Telegram.WebApp){
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

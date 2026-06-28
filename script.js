const hamburger=document.querySelector(".hamburger"),nav=document.querySelector("nav"),cart=document.querySelector("#cart"),cartBtn=document.querySelector("#cartBtn"),closeCart=document.querySelector("#closeCart"),cartItems=document.querySelector("#cartItems"),total=document.querySelector("#total"),cartCount=document.querySelector("#cartCount");
let items=JSON.parse(localStorage.getItem("ecoCart"))||[];

const products=[
{name:"Essential Tee",price:24.99,cat:"tshirts",colours:["Black","White","Grey"]},
{name:"Oversized Signature Tee",price:29.99,cat:"tshirts",colours:["Black","Sand","Forest Green"]},
{name:"Classic Pullover Hoodie",price:54.99,cat:"hoodies",colours:["Black","Grey","Navy"]},
{name:"Premium Crew Sweatshirt",price:49.99,cat:"hoodies",colours:["Black","Olive","Brown"]},
{name:"Heritage Polo Shirt",price:34.99,cat:"other",colours:["White","Navy","Sage"]},
{name:"Urban Cargo Trousers",price:59.99,cat:"trousers",colours:["Black","Khaki","Olive"]},
{name:"Core Slim Fit Jeans",price:64.99,cat:"trousers",colours:["Blue","Black","Grey"]},
{name:"Everyday Joggers",price:44.99,cat:"trousers",colours:["Black","Grey","Cream"]},
{name:"Summit Windbreaker Jacket",price:79.99,cat:"jackets",colours:["Black","Navy","Stone"]},
{name:"Summer Chino Shorts",price:39.99,cat:"other",colours:["Beige","Black","Khaki"]}
];

let visible=9,activeCat="all";

function updateCart(){
  let sum=items.reduce((t,i)=>t+i.price,0);
  cartItems.innerHTML=items.length?items.map((i,n)=>`<div class="cart-row"><span>${i.name}</span><b>&pound;${i.price.toFixed(2)}</b><button onclick="removeItem(${n})">Remove</button></div>`).join(""):"<p>Your cart is empty.</p>";
  total.innerHTML=`Total: &pound;${sum.toFixed(2)}`;
  cartCount.textContent=items.length;
  localStorage.setItem("ecoCart",JSON.stringify(items));
}
function removeItem(n){items.splice(n,1);updateCart()}

function renderProducts(){
  const grid=document.querySelector("#productGrid");
  if(!grid)return;
  let list=[...products];
  const search=document.querySelector("#searchInput").value.toLowerCase();
  const sort=document.querySelector("#sortProducts").value;
  if(activeCat!=="all")list=list.filter(p=>p.cat===activeCat);
  if(search)list=list.filter(p=>p.name.toLowerCase().includes(search));
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name));
  grid.innerHTML=list.slice(0,visible).map(p=>`
    <article class="shop-card">
      <button class="heart" type="button">♡</button>
      <div class="placeholder"></div>
      <div class="shop-info">
        <h2>${p.name}</h2>
        <p>&pound;${p.price.toFixed(2)}</p>
        <div class="dots">${p.colours.map(c=>`<span class="dot" title="${c}"></span>`).join("")}</div>
        <button class="add" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
      </div>
    </article>`).join("");
  document.querySelectorAll(".add").forEach(btn=>btn.onclick=()=>{items.push({name:btn.dataset.name,price:Number(btn.dataset.price)});updateCart();cart.classList.add("open")});
  document.querySelectorAll(".heart").forEach(btn=>btn.onclick=()=>btn.classList.toggle("saved"));
}

hamburger.onclick=()=>nav.classList.toggle("open");
cartBtn.onclick=()=>cart.classList.add("open");
closeCart.onclick=()=>cart.classList.remove("open");

document.querySelectorAll(".category").forEach(btn=>btn.onclick=()=>{document.querySelector(".category.active").classList.remove("active");btn.classList.add("active");activeCat=btn.dataset.category;visible=9;renderProducts()});
document.querySelector("#sortProducts")?.addEventListener("change",renderProducts);
document.querySelector("#searchInput")?.addEventListener("input",renderProducts);
document.querySelector("#filterBtn")?.addEventListener("click",()=>document.querySelector("#filterPanel").classList.toggle("open"));
document.querySelector("#loadMore")?.addEventListener("click",()=>{visible+=3;renderProducts()});

updateCart();
renderProducts();
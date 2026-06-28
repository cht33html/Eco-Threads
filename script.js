const hamburger=document.querySelector(".hamburger");
const nav=document.querySelector("nav");
const cart=document.querySelector("#cart");
const cartBtn=document.querySelector("#cartBtn");
const closeCart=document.querySelector("#closeCart");
const cartItems=document.querySelector("#cartItems");
const total=document.querySelector("#total");
const cartCount=document.querySelector("#cartCount");
const checkoutForm=document.querySelector("#checkoutForm");
const delivery=document.querySelector("#delivery");
const checkoutMsg=document.querySelector("#checkoutMsg");

let items=JSON.parse(localStorage.getItem("ecoCart"))||[];

function getItemsTotal(){
  return items.reduce((t,i)=>t+i.price,0);
}

function getDeliveryCost(){
  return delivery ? Number(delivery.value) : 0;
}

function updateCart(){
  let itemsTotal=getItemsTotal();
  let deliveryCost=items.length ? getDeliveryCost() : 0;
  let finalTotal=itemsTotal+deliveryCost;

  cartItems.innerHTML=items.length
    ? items.map((i,n)=>`
      <div class="cart-row">
        <span>${i.name}</span>
        <b>&pound;${i.price.toFixed(2)}</b>
        <button type="button" onclick="removeItem(${n})">Remove</button>
      </div>
    `).join("")
    : "<p>Your cart is empty.</p>";

  total.innerHTML=`
    Items: &pound;${itemsTotal.toFixed(2)}<br>
    Delivery: &pound;${deliveryCost.toFixed(2)}<br>
    Total: &pound;${finalTotal.toFixed(2)}
  `;

  cartCount.textContent=items.length;
  localStorage.setItem("ecoCart",JSON.stringify(items));
}

function removeItem(n){
  items.splice(n,1);
  updateCart();
}

hamburger.onclick=()=>nav.classList.toggle("open");
cartBtn.onclick=()=>cart.classList.add("open");
closeCart.onclick=()=>cart.classList.remove("open");

document.querySelectorAll(".add").forEach(btn=>{
  btn.onclick=()=>{
    items.push({
      name:btn.dataset.name,
      price:Number(btn.dataset.price)
    });

    updateCart();
    cart.classList.add("open");
    checkoutMsg.textContent="";
  };
});

if(delivery){
  delivery.onchange=updateCart;
}

if(checkoutForm){
  checkoutForm.onsubmit=e=>{
    e.preventDefault();

    if(items.length===0){
      checkoutMsg.textContent="Please add at least one item to your cart before checkout.";
      return;
    }

    const cardNumber=document.querySelector("#cardNumber").value.replaceAll(" ","");
    const cvv=document.querySelector("#cvv").value;

    if(cardNumber.length<16 || isNaN(cardNumber)){
      checkoutMsg.textContent="Please enter a valid 16 digit card number.";
      return;
    }

    if(cvv.length!==3 || isNaN(cvv)){
      checkoutMsg.textContent="Please enter a valid 3 digit CVV.";
      return;
    }

    items=[];
    localStorage.removeItem("ecoCart");
    updateCart();

    checkoutForm.reset();
    checkoutMsg.textContent="Thank you. Your order has been placed successfully.";
  };
}

const contactForm=document.querySelector("main form");
if(contactForm && contactForm.id!=="checkoutForm"){
  contactForm.onsubmit=e=>{
    e.preventDefault();
    document.querySelector("#formMsg").textContent="Thank you. Your request has been sent.";
    contactForm.reset();
  };
}

updateCart();
var hamburger = document.querySelector(".hamburger");
var nav = document.querySelector("nav");
var cart = document.querySelector("#cart");
var cartBtn = document.querySelector("#cartBtn");
var closeCart = document.querySelector("#closeCart");
var cartItems = document.querySelector("#cartItems");
var total = document.querySelector("#total");
var cartCount = document.querySelector("#cartCount");

var items = JSON.parse(localStorage.getItem("ecoCart")) || [];

var products = [
  { name: "Essential Tee", price: 24.99, cat: "tshirts", colours: ["Black", "White", "Grey"] },
  { name: "Oversized Signature Tee", price: 29.99, cat: "tshirts", colours: ["Black", "Sand", "Green"] },
  { name: "Classic Pullover Hoodie", price: 54.99, cat: "hoodies", colours: ["Black", "Grey", "Navy"] },
  { name: "Premium Crew Sweatshirt", price: 49.99, cat: "hoodies", colours: ["Black", "Olive", "Brown"] },
  { name: "Heritage Polo Shirt", price: 34.99, cat: "other", colours: ["White", "Navy", "Sage"] },
  { name: "Urban Cargo Trousers", price: 59.99, cat: "trousers", colours: ["Black", "Khaki", "Olive"] },
  { name: "Core Slim Fit Jeans", price: 64.99, cat: "trousers", colours: ["Blue", "Black", "Grey"] },
  { name: "Everyday Joggers", price: 44.99, cat: "trousers", colours: ["Black", "Grey", "Cream"] },
  { name: "Summit Windbreaker Jacket", price: 79.99, cat: "jackets", colours: ["Black", "Navy", "Stone"] },
  { name: "Summer Chino Shorts", price: 39.99, cat: "other", colours: ["Beige", "Black", "Khaki"] }
];

var visible = 9;
var activeCat = "all";

hamburger.onclick = function () {
  nav.classList.toggle("open");
};

cartBtn.onclick = function () {
  cart.classList.add("open");
};

closeCart.onclick = function () {
  cart.classList.remove("open");
};

function updateCart() {
  var sum = 0;
  var output = "";

  for (var i = 0; i < items.length; i++) {
    sum = sum + items[i].price;

    output += "<div class='cart-row'>";
    output += "<span>" + items[i].name + "</span><br>";
    output += "<b>&pound;" + items[i].price.toFixed(2) + "</b><br>";
    output += "<button onclick='removeItem(" + i + ")'>Remove</button>";
    output += "</div>";
  }

  if (items.length === 0) {
    output = "<p>Your cart is empty.</p>";
  }

  cartItems.innerHTML = output;
  total.innerHTML = "Total: &pound;" + sum.toFixed(2);
  cartCount.textContent = items.length;

  localStorage.setItem("ecoCart", JSON.stringify(items));
}

function removeItem(number) {
  items.splice(number, 1);
  updateCart();
}

function addCartButtons() {
  var buttons = document.querySelectorAll(".add");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      var name = this.getAttribute("data-name");
      var price = Number(this.getAttribute("data-price"));

      items.push({ name: name, price: price });
      updateCart();
      cart.classList.add("open");
    };
  }
}

function renderProducts() {
  var grid = document.querySelector("#productGrid");

  if (!grid) {
    return;
  }

  var searchInput = document.querySelector("#searchInput");
  var sortProducts = document.querySelector("#sortProducts");

  var search = searchInput.value.toLowerCase();
  var sort = sortProducts.value;
  var list = [];

  for (var i = 0; i < products.length; i++) {
    list.push(products[i]);
  }

  if (activeCat !== "all") {
    list = list.filter(function (product) {
      return product.cat === activeCat;
    });
  }

  if (search !== "") {
    list = list.filter(function (product) {
      return product.name.toLowerCase().includes(search);
    });
  }

  if (sort === "low") {
    list.sort(function (a, b) {
      return a.price - b.price;
    });
  }

  if (sort === "high") {
    list.sort(function (a, b) {
      return b.price - a.price;
    });
  }

  if (sort === "az") {
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  var html = "";

  for (var j = 0; j < list.length && j < visible; j++) {
    html += "<article class='shop-card'>";
    html += "<button class='heart' type='button'>♡</button>";
    html += "<div class='placeholder'></div>";
    html += "<div class='shop-info'>";
    html += "<h2>" + list[j].name + "</h2>";
    html += "<p>&pound;" + list[j].price.toFixed(2) + "</p>";
    html += "<div class='dots'>";

    for (var k = 0; k < list[j].colours.length; k++) {
      html += "<span class='dot' title='" + list[j].colours[k] + "'></span>";
    }

    html += "</div>";
    html += "<button class='add' data-name='" + list[j].name + "' data-price='" + list[j].price + "'>Add to Cart</button>";
    html += "</div>";
    html += "</article>";
  }

  grid.innerHTML = html;
  addCartButtons();
  addHeartButtons();
}

function addHeartButtons() {
  var hearts = document.querySelectorAll(".heart");

  for (var i = 0; i < hearts.length; i++) {
    hearts[i].onclick = function () {
      this.classList.toggle("saved");
    };
  }
}

var categoryButtons = document.querySelectorAll(".category");

for (var i = 0; i < categoryButtons.length; i++) {
  categoryButtons[i].onclick = function () {
    for (var j = 0; j < categoryButtons.length; j++) {
      categoryButtons[j].classList.remove("active");
    }

    this.classList.add("active");
    activeCat = this.getAttribute("data-category");
    visible = 9;
    renderProducts();
  };
}

var sortBox = document.querySelector("#sortProducts");
if (sortBox) {
  sortBox.onchange = renderProducts;
}

var searchBox = document.querySelector("#searchInput");
if (searchBox) {
  searchBox.oninput = renderProducts;
}

var filterBtn = document.querySelector("#filterBtn");
if (filterBtn) {
  filterBtn.onclick = function () {
    document.querySelector("#filterPanel").classList.toggle("open");
  };
}

var loadMore = document.querySelector("#loadMore");
if (loadMore) {
  loadMore.onclick = function () {
    visible = visible + 3;
    renderProducts();
  };
}

var contactForm = document.querySelector("#contactForm");
if (contactForm) {
  contactForm.onsubmit = function (event) {
    event.preventDefault();
    document.querySelector("#formMsg").textContent = "Thank you, your request has been sent.";
    contactForm.reset();
  };
}

updateCart();
addCartButtons();
renderProducts();
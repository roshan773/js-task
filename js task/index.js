let form = document.getElementById("product-form");
let productList = document.getElementById("productlist");
let title = document.getElementById("product-title");
let price = document.getElementById("product-price");
let image = document.getElementById("product-image");
let category = document.getElementById("product-category");
let products = JSON.parse(localStorage.getItem("products")) || [];
let editingIndex = null;

// Function to display products with optional filtering and sorting
function displayProducts(filter = "All", sort = null) {
  let filteredProducts = filterProductsByCategory(filter);
  filteredProducts = sortProductsByPrice(filteredProducts, sort);
  updateProductList(filteredProducts);
}

// Function to filter products by category
function filterProductsByCategory(filter) {
  return filter === "All" ? products : products.filter((p) => p.category === filter);
}

// Function to sort products by price
function sortProductsByPrice(products, sort) {
  if (sort === "asc") return products.sort((a, b) => a.price - b.price);
  if (sort === "desc") return products.sort((a, b) => b.price - a.price);
  return products;
}

// Function to update the product list in the DOM
function updateProductList(filteredProducts) {
  productList.innerHTML = filteredProducts
    .map(
      (p, i) => `
          <div class="card my-3">
            <img src="${p.image}" class="card-img-top" alt="${p.title}" />
            <div class="card-body">
              <h5 class="card-title">${p.title}</h5>
              <p class="card-text">Category: ${p.category}</p>
              <p class="card-text">Price: ₹${p.price}</p>
              <button class="btn btn-warning" onclick="startEditingProduct(${i})">Edit</button>
              <button class="btn btn-danger" onclick="removeProduct(${i})">Delete</button>
            </div>
          </div>
        `
    )
    .join("");
}

// Function to handle form submission for adding or editing products
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let product = { title: title.value, price: parseFloat(price.value), image: image.value, category: category.value };
  if (editingIndex !== null) {
    updateProduct(editingIndex, product);
  } else {
    addNewProduct(product);
  }
  saveProductsToLocalStorage();
  displayProducts();
  form.reset();
});

// Function to start editing an existing product
function startEditingProduct(index) {
  let p = products[index];
  title.value = p.title;
  price.value = p.price;
  image.value = p.image;
  category.value = p.category;
  editingIndex = index;
}

// Function to update a product's details
function updateProduct(index, product) {
  products[index] = product;
  editingIndex = null;
}

// Function to add a new product to the list
function addNewProduct(product) {
  products.push(product);
}

// Function to remove a product from the list
function removeProduct(index) {
  products.splice(index, 1);
  saveProductsToLocalStorage();
  displayProducts();
}

// Function to save products to localStorage
function saveProductsToLocalStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Initial call to display products when the page loads
displayProducts();

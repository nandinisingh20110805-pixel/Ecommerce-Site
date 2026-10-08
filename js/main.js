const API = "https://dummyjson.com/products?limit=0";
const CATEGORY_API = "https://dummyjson.com/products/categories"

const productContainer = document.querySelector("#products-container")
const categoryFilter = document.querySelector("#category-filters")
const searchInput = document.querySelector("#search-input")
const wishlistCount = document.querySelector("#wishlist-count")

let allCategories = [];

// async function fetchCategory(){
//   const response = await fetch(API)
//   const data = await response.json();
//   let allProducts = [...data.products];
//   allProducts.forEach(({category})=>{
//     if(!allCategories.includes(category)){
//       allCategories.push(category);
//     }
//   })
// }

function getItem(key){
  return JSON.parse(localStorage.getItem(key)) || [];
}


function formatCategory(category){ 
  return category.replace("-"," ");
}

async function fetchProducts(url){
    try{
        const response = await fetch(url)
        const data = await response.json();
        // console.log(data);
        renderProducts(data.products);
    } catch(error){

    }
}
 
async function renderThroughUrl(url){
  productContainer.innerHTML = "Loading....."
  let response = await fetch(url);
  let data = await response.json();
  renderProducts(data.products);
}

function renderProducts(data){
productContainer.innerHTML = "";
  data.forEach(product => {
    const article = document.createElement("article");
    //className for space-seperated Tailwind classes
    article.className = "bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition"
    let card = `
          <div class="h-48 w-full flex items-center justify-center p-3 mb-4 bg-white">
            <img src=${product.thumbnail}
              alt=${product.title} class="max-h-full max-w-full object-contain" loading="lazy">
          </div>
          <div class="flex-grow flex flex-col">
            <span class="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              ${formatCategory(product.category)}
            </span>
            <h2 class="font-semibold text-slate-900 text-sm mb-2 line-clamp-2" title=${product.title}>
              ${product.title}
            </h2>
            <div class="mt-auto pt-2">
              <span class="text-lg font-bold text-slate-900">
                ₹${Number(product.price * 96.62).toFixed(2)}
              </span>
            </div>
            <a href="productDetail.html?id=${product.id}"
              class="mt-4 block w-full text-center bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition">
              View Details
            </a>
          </div>
    `
    article.innerHTML = card;
    productContainer.append(article);
  });
}

async function fetchCategories(){
    try{
        const response = await fetch(CATEGORY_API)
        const data = await response.json();
        // console.log(data);
        // renderCategories(data);
        allCategories = [{name : "all", slug : "all", url : API}, ...data];
        renderCategories();
    } catch(error){

    }
}

function renderCategories(defaultCategory = "all"){
  categoryFilter.innerHTML = "";
  allCategories.forEach(b => {
    const button = document.createElement("button");
    if(b.slug === defaultCategory){
      button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-teal-700 text-white capitalize transition";
    }else{
    //className for space-seperated Tailwind classes
    button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-white capitalize text-slate-700 border border-slate-300 hover:bg-slate-100 transition"
    }
    button.type = "button";
    button.dataset.category = b.slug;
    button.dataset.url = b.url;
    button.textContent = b.name;
    categoryFilter.append(button);
  });
}

if(categoryFilter){
  categoryFilter.addEventListener("click",(e)=>{
  e.stopPropagation();
  let element = e.target;
  if(element.type === "button"){
    const text = element.dataset.category;
    const url = element.dataset.url;
    renderCategories(text);
    renderThroughUrl(url);
  }
})
}


if(searchInput){
  searchInput.addEventListener("input", (e)=> {
  e.stopPropagation();
  let value = searchInput.value; 
  //there's an api for this already so we will use that but if there's no api, we would have to save the products in a global array and then use search by using filter(?)
  //better method is ofcouse the api one because it is always updated
  const url = `https://dummyjson.com/products/search?q=${value}`
  fetchProducts(url);
})
}

function convertToINR(price){
  return (price * 96.29).toFixed(2);
}

async function loadProductPage(){
  const productDetailContainer = document.querySelector("#product-detail-container");
  if(!productDetailContainer){
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id")
  console.log(id);
  const url = `https://dummyjson.com/products/${id}`;
  const response = await fetch(url);
  const data = await response.json(); 
  if(data.message){
    productDetailContainer.textContent = "failed to load";
    return;
  }
  const {thumbnail, category, price, rating, reviews, title, description} = data;
  productDetailContainer.innerHTML = ""
  const div = `<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        <div class="bg-white border border-slate-200 rounded-lg p-8 flex items-center justify-center min-h-[350px] md:min-h-[440px]">
          <img 
            src= ${thumbnail} 
            alt= ${title}
            class="max-h-96 max-w-full object-contain"
          >
        </div>

        <div class="flex flex-col">
          <div>
            <span class="inline-block text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              ${category}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
            ${title}
          </h1>

          <div class="flex items-center gap-1 mb-4">
            <div class="flex items-center" aria-label="2.6 out of 5 stars">
              <svg class="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="ml-2 text-sm text-slate-500 font-medium">
              ${rating} (${reviews.length} reviews)
            </span>
          </div>

          <div class="mb-6">
            <span class="text-2xl sm:text-3xl font-bold text-slate-900">
              ₹${convertToINR(price)};
            </span>
          </div>

          <div class="border-t border-b border-slate-200 py-6 mb-6">
            <p class="text-slate-600 text-base leading-relaxed">
              ${description}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            <div class="flex items-center border border-slate-300 rounded-md bg-white w-fit">
              <button 
                type="button" 
                id="qty-minus" 
                class="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l-md transition"
                aria-label="Decrease quantity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>

              <span id="qty-value" class="w-12 text-center text-sm font-semibold text-slate-900 select-none">
                1
              </span>

              <button 
                type="button" 
                id="qty-plus" 
                class="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-md transition"
                aria-label="Increase quantity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>

            <button 
              type="button" 
              id="add-to-cart-btn" 
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Add to Cart</span>
            </button>

            <button 
              type="button" 
              id="add-to-wishlist-btn" 
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border border-teal-700 text-teal-700 hover:bg-teal-50 font-medium py-2.5 px-6 rounded-md shadow-sm transition"
            >
              <svg id="wishlist-btn-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span id="wishlist-btn-text">Add to Wishlist</span>
            </button>
          </div>

        </div>
      </div>`
      productDetailContainer.innerHTML = div;
      const addToWishlist = document.querySelector("#add-to-wishlist-btn");
      addToWishlist.addEventListener("click", (e) => {
        e.stopPropagation();  
        const currentWishlist = getItem("wishlist") || [];
        // const isAlreadyinWishlist = currentWishlist.some(product => product.id === data.id);
        // if(isAlreadyinWishlist){
        //   return;
        // }

        //manual implementation
        if(currentWishlist.length > 0){
          for(i = 0;i<currentWishlist.length;i++){
          if(currentWishlist[i].id === data.id){
            break;
          }
          localStorage.setItem("wishlist",JSON.stringify([data, ...currentWishlist]))
        }
        }else{
          localStorage.setItem("wishlist",JSON.stringify([data, ...currentWishlist]))
        }
          // localStorage.setItem("wishlist",JSON.stringify([data, ...getItem("wishlist")]))
          // console.log(getItem("wishlist"));
          updateWishlistCount();
      })
}


loadProductPage();

function loadWishlistPage(){
  const wishlistContainer = document.querySelector("#wishlist-container");
  if(!wishlistContainer){
    return;
  }
  const wishlistProducts = getItem("wishlist") || [];
  wishlistContainer.innerHTML = "";
  if(wishlistProducts.length == 0){
    wishlistContainer.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-md mx-auto my-8">
        <div class="w-16 h-16 mx-auto mb-4 text-slate-300 flex items-center justify-center">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-slate-800 mb-2">Your wishlist is empty</h2>
        <p class="text-slate-500 text-sm mb-6">Looks like you haven't saved any products to your wishlist yet.</p>
        <a href="index.html" class="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-2.5 rounded-md transition text-sm">
          Start Shopping
        </a>
      </div>`
  }
  const div = document.createElement("div");
  div.className = "bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-sm"
  let card = "";
  wishlistProducts.forEach((p) => {
    card +=  `
        <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
          <div class="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded p-1.5 flex items-center justify-center shrink-0">
              <img 
                src= ${p.thumbnail} 
                alt="${p.title}" 
                class="max-h-full max-w-full object-contain"
              >
            </div>
            <div class="min-w-0 flex-1">
              <a 
                href="productDetail.html?id=${p.id}" 
                class="text-sm font-semibold text-slate-900 hover:text-teal-700 line-clamp-2 transition" 
                title="${p.title}"
              >
                ${p.title}
              </a>
              <p class="text-sm font-bold text-slate-900 mt-1">₹${convertToINR(p.price)}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button 
              type="button"
              data-id= ${p.id} 
              class="wishlist-add-cart-btn inline-flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Add to Cart</span>
            </button>
            <button 
              type="button" 
              data-id= ${p.id} 
              class="wishlist-remove-btn inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-red-600 border border-slate-300 hover:border-red-300 text-sm font-medium py-2 px-3 rounded transition"
              title="Remove from Wishlist"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Remove from Wishlist</span>
            </button>
          </div>
        </div>`
        div.innerHTML = card;
  })
  wishlistContainer.append(div);


  wishlistContainer.addEventListener("click", (e) =>{
    e.stopPropagation();
    console.log(e.target);
    const removeWishlist = e.target.closest(".wishlist-remove-btn")
    const id = Number(removeWishlist.dataset.id);
    if(removeWishlist){
      const filterProducts = getItem("wishlist").filter((p) => p.id != id)
      console.log(filterProducts);
      localStorage.setItem("wishlist",JSON.stringify(filterProducts));
      updateWishlistCount();
      loadWishlistPage();
    }
  })
}




loadWishlistPage();

function init(){
  if(productContainer){
    fetchProducts(API);
    fetchCategories();
  }
}

function updateWishlistCount(){
  wishlistCount.textContent = getItem("wishlist").length;
}

updateWishlistCount();

init();
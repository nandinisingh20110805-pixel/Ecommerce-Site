const API = "https://dummyjson.com/products?limit=0";
const CATEGORY_API = "https://dummyjson.com/products/categories"

const productContainer = document.querySelector("#products-container")
const categoryFilter = document.querySelector("#category-filters")

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

function formatCategory(category){ 
  return category.replace("-"," ");
}

async function fetchProducts(){
    try{
        const response = await fetch(API)
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
            <a href="product-details.html"
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
    if(b.slug == defaultCategory){
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


categoryFilter.addEventListener("click",(e)=>{
  e.stopPropagation();
  let element = e.target;
  if(element.type == "button"){
    const text = element.dataset.category;
    const url = element.dataset.url;
    renderCategories(text);
    renderThroughUrl(url);
  }
})

fetchCategories();
fetchProducts();

function init(){

}
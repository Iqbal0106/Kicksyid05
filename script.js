/* =====================
   SLIDER
===================== */
const slider = document.getElementById("slider");

function slideLeft() {
  slider.scrollBy({ left: -300, behavior: "smooth" });
}
function slideRight() {
  slider.scrollBy({ left: 300, behavior: "smooth" });
}

/* =====================
   MOBILE SWIPE
===================== */
let isDown = false;
let startX, scrollLeft;

if (slider) {
  slider.addEventListener("touchstart", e => {
    isDown = true;
    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchmove", e => {
    if (!isDown) return;
    const x = e.touches[0].pageX;
    slider.scrollLeft = scrollLeft + (startX - x) * 1.3;
  });

  slider.addEventListener("touchend", () => isDown = false);
}

/* =====================
   CART SYSTEM
===================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, image = "") {
  if (!selectedSize) {
    alert("Pilih size dulu 👟");
    return;
  }

  cart.push({
    name,
    price,
    image,
    size: selectedSize,
    qty: 1
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  cartFeedback();
}

/* =====================
   CART BADGE
===================== */
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.innerText = cart.length;
}
updateCartBadge();

let currentCatalog = "all";
let searchQuery = "";
function applyCatalogFilter() {
  const tiles = document.querySelectorAll(".catalog-grid .tile");
  let count = 0;
  tiles.forEach(t => {
    const name = t.querySelector(".name")?.textContent?.toLowerCase() || "";
    const sub = t.querySelector(".sub")?.textContent?.toLowerCase() || "";
    const matchesText = !searchQuery || name.includes(searchQuery) || sub.includes(searchQuery);
    const matchesCat = currentCatalog === "all" || t.dataset.cat === currentCatalog;
    const show = searchQuery ? matchesText : (matchesText && matchesCat);
    t.style.display = show ? "" : "none";
    if (show) count++;
  });
  const emptyEl = document.getElementById("catalogEmpty");
  if (emptyEl) emptyEl.style.display = count ? "none" : "block";
}
function setCatalog(cat) {
  currentCatalog = cat;
  const pb = document.getElementById("pillBrand");
  const pl = document.getElementById("pillLokal");
  if (pb) pb.classList.toggle("active", cat === "brand");
  if (pl) pl.classList.toggle("active", cat === "lokal");
  applyCatalogFilter();
}
document.addEventListener("DOMContentLoaded", () => {
  const si = document.getElementById("searchInput");
  if (si) {
    si.addEventListener("input", e => {
      searchQuery = e.target.value.trim().toLowerCase();
      const catalogGrid = document.querySelector(".catalog-grid");
      if (catalogGrid) {
        applyCatalogFilter();
      }
    });
    si.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const sec = document.getElementById("catalog");
        if (sec) {
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Redirect to shop page if search from home
          window.location.href = "shop.html?q=" + encodeURIComponent(searchQuery);
        }
      }
    });
  }
  // Handle search query from URL (e.g., from home page)
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q && si) {
    si.value = q;
    searchQuery = q.toLowerCase();
    applyCatalogFilter();
  }
  
  applyCatalogFilter();
});

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch { return null }
}
function updateUserUI() {
  const btns = document.querySelectorAll(".user-btn-container");
  const user = currentUser();
  
  btns.forEach(container => {
    if (user && user.name) {
      container.innerHTML = `
        <button class="icon-btn logged-in" onclick="userButtonClick()">
          <img src="Icon/user.png" alt="User" style="width: 20px; height: 20px;">
          <span class="user-name-label">${user.name.split(" ")[0]}</span>
        </button>
      `;
    } else {
      container.innerHTML = `
        <button class="icon-btn" onclick="userButtonClick()">
          <img src="Icon/user.png" alt="User" style="width: 20px; height: 20px;">
        </button>
      `;
    }
  });
}

// Inject Auth Modal
function injectAuthModal() {
  if (document.getElementById("authModal")) return;
  
  const modalHTML = `
    <div id="authBackdrop" class="auth-backdrop" onclick="closeAuth()"></div>
    <div id="authModal" class="auth-modal">
      <div class="auth-head">
        <div class="tabs">
          <button id="tabSignIn" class="tab active" onclick="setAuthTab('in')">Masuk</button>
          <button id="tabSignUp" class="tab" onclick="setAuthTab('up')">Daftar</button>
        </div>
        <button class="close" onclick="closeAuth()">×</button>
      </div>
      <div class="auth-body">
        <form id="formSignIn" class="auth-form" onsubmit="event.preventDefault(); signIn();">
          <input id="inEmail" type="email" placeholder="Email" required>
          <input id="inPassword" type="password" placeholder="Password" required>
          <button type="submit" class="btn">Masuk ke Kicksy</button>
        </form>
        <form id="formSignUp" class="auth-form hidden" onsubmit="event.preventDefault(); signUp();">
          <input id="upName" type="text" placeholder="Nama Lengkap" required>
          <input id="upEmail" type="email" placeholder="Email" required>
          <input id="upPassword" type="password" placeholder="Password" required>
          <button type="submit" class="btn">Buat Akun Kicksy</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

document.addEventListener("DOMContentLoaded", () => {
  injectAuthModal();
  updateUserUI();
});
document.addEventListener("DOMContentLoaded", () => {
  if (location.hash === "#promo") {
    const sec = document.getElementById("promo");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

function openAuth() {
  const b = document.getElementById("authBackdrop");
  const m = document.getElementById("authModal");
  if (!b || !m) return;
  b.style.display = "block";
  m.style.display = "block";
  setAuthTab("in");
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMobileNav();
});

/* =====================
   COMMENTS SYSTEM
===================== */
let comments = JSON.parse(localStorage.getItem("kicksy_comments")) || [];
let commentsHidden = localStorage.getItem("kicksy_comments_hidden") === "true";

function toggleComments() {
  commentsHidden = !commentsHidden;
  localStorage.setItem("kicksy_comments_hidden", commentsHidden);
  applyCommentsVisibility();
}

function applyCommentsVisibility() {
  const content = document.getElementById("commentsContent");
  const btn = document.getElementById("toggleCommentsBtn");
  if (!content || !btn) return;

  if (commentsHidden) {
    content.classList.add("hidden");
    btn.innerText = "Tampilkan Komentar";
  } else {
    content.classList.remove("hidden");
    btn.innerText = "Sembunyikan Komentar";
  }
}

function addComment() {
  const nameInput = document.getElementById("commentName");
  const rating = document.getElementById("commentRating").value;
  const text = document.getElementById("commentText").value;
  
  const user = currentUser();
  const name = user ? user.name : nameInput.value;
  
  if (!name || !text) {
    alert("Silakan lengkapi nama dan komentar Anda.");
    return;
  }

  const newComment = {
    id: Date.now(),
    name,
    rating: parseInt(rating),
    text,
    date: new Date().toLocaleDateString("id-ID")
  };

  comments.unshift(newComment);
  localStorage.setItem("kicksy_comments", JSON.stringify(comments));
  
  // Reset form
  document.getElementById("commentForm").reset();
  
  // Re-fill name if logged in
  if (user && nameInput) {
    nameInput.value = user.name;
  }
  
  // Refresh display
  renderComments();
}

function renderComments() {
  const list = document.getElementById("commentList");
  const nameInput = document.getElementById("commentName");
  if (!list) return;

  // If user is logged in, pre-fill or hide name input
  const user = currentUser();
  if (user && nameInput) {
    nameInput.value = user.name;
    nameInput.readOnly = true;
    nameInput.style.opacity = "0.7";
    nameInput.title = "Nama diambil dari akun Anda";
  }

  // Keep static comments but clear others
  const staticComments = `
    <div class="testi-card">
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <p>"Sepatu Kanky nya original banget, pengiriman cepet dan CS nya ramah. Bakal langganan di sini!"</p>
      <div class="user">- Andi, Jakarta</div>
    </div>
    <div class="testi-card">
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <p>"Dapet promo KICKSY10 lumayan banget buat beli Nike Dunk. Barang sampe dengan aman pake double box."</p>
      <div class="user">- Budi, Bandung</div>
    </div>
    <div class="testi-card">
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <p>"Gak nyangka brand lokal sekarang kualitasnya oke banget. Thanks Kicksy udah kurasi produk lokal!"</p>
      <div class="user">- Citra, Surabaya</div>
    </div>
  `;

  let dynamicHTML = "";
  comments.forEach(c => {
    let stars = "⭐".repeat(c.rating);
    dynamicHTML += `
      <div class="testi-card">
        <div class="stars">${stars}</div>
        <p>"${c.text}"</p>
        <div class="user">- ${c.name} (${c.date})</div>
      </div>
    `;
  });

  list.innerHTML = dynamicHTML + staticComments;
}

document.addEventListener("DOMContentLoaded", () => {
  renderComments();
  applyCommentsVisibility();
});
function closeAuth() {
  const b = document.getElementById("authBackdrop");
  const m = document.getElementById("authModal");
  if (!b || !m) return;
  b.style.display = "none";
  m.style.display = "none";
}
function setAuthTab(mode) {
  const tIn = document.getElementById("tabSignIn");
  const tUp = document.getElementById("tabSignUp");
  const fIn = document.getElementById("formSignIn");
  const fUp = document.getElementById("formSignUp");
  if (!tIn || !tUp || !fIn || !fUp) return;
  tIn.classList.toggle("active", mode === "in");
  tUp.classList.toggle("active", mode === "up");
  fIn.classList.toggle("hidden", mode !== "in");
  fUp.classList.toggle("hidden", mode !== "up");
}
function userButtonClick() {
  const user = currentUser();
  if (user) {
    const ok = confirm("Keluar dari akun?");
    if (ok) signOut();
  } else {
    openAuth();
  }
}
async function hashPassword(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, "0")).join("");
}
async function signUp() {
  const name = document.getElementById("upName")?.value?.trim();
  const email = document.getElementById("upEmail")?.value?.trim()?.toLowerCase();
  const pass = document.getElementById("upPassword")?.value || "";
  if (!name || !email || !pass) {
    alert("Lengkapi data");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[email]) {
    alert("Email sudah terdaftar");
    return;
  }
  const hash = await hashPassword(pass);
  users[email] = { name, email, hash };
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ name, email }));
  closeAuth();
  updateUserUI();
  renderComments();
}
async function signIn() {
  const email = document.getElementById("inEmail")?.value?.trim()?.toLowerCase();
  const pass = document.getElementById("inPassword")?.value || "";
  if (!email || !pass) {
    alert("Masukkan email dan password");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const user = users[email];
  if (!user) {
    alert("Akun tidak ditemukan");
    return;
  }
  const hash = await hashPassword(pass);
  if (hash !== user.hash) {
    alert("Password salah");
    return;
  }
  localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email }));
  closeAuth();
  updateUserUI();
  renderComments();
}
function signOut() {
  localStorage.removeItem("currentUser");
  updateUserUI();
  
  // Clear comment name input and re-enable it
  const nameInput = document.getElementById("commentName");
  if (nameInput) {
    nameInput.value = "";
    nameInput.readOnly = false;
    nameInput.style.opacity = "1";
    nameInput.title = "";
  }
  
  renderComments();
}
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
function toggleFav(name) {
  const idx = wishlist.indexOf(name);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(name);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  document
    .querySelectorAll(".tile .name")
    .forEach(el => {
      const n = el.textContent.trim();
      const btn = el.parentElement.querySelector(".fav");
      if (!btn) return;
      if (wishlist.includes(n)) btn.classList.add("active");
      else btn.classList.remove("active");
    });
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".tile .name")
    .forEach(el => {
      const n = el.textContent.trim();
      const btn = el.parentElement.querySelector(".fav");
      if (!btn) return;
      if (wishlist.includes(n)) btn.classList.add("active");
    });
});

function openBag() {
  document.body.classList.add("bag-open");
  renderBag();
}
function closeBag() {
  document.body.classList.remove("bag-open");
}
function renderBag() {
  const wrap = document.getElementById("bagItems");
  const totalEl = document.getElementById("bagTotal");
  const emptyEl = document.getElementById("bagEmpty");
  if (!wrap) return;
  wrap.innerHTML = "";
  let total = 0;
  if (cart.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
  }
  cart.forEach((item, i) => {
    total += item.price * item.qty;
    wrap.innerHTML += `
      <div class="bag-item">
        <img src="${item.image || 'images/placeholder.png'}">
        <div class="bag-info">
          <h4>${item.name}</h4>
          <p>Size: ${item.size}</p>
          <p>Rp ${item.price.toLocaleString("id-ID")}</p>
          <div class="bag-qty">
            <button onclick="changeQty(${i}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${i}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });
  if (totalEl) totalEl.innerText = "Rp " + total.toLocaleString("id-ID");
}
function goToCart() {
  closeBag();
  window.location.href = "cart.html";
}
/* =====================
   FEEDBACK - UI ENHANCEMENT
===================== */
function cartFeedback() {
  // Hapus toast yang sudah ada (biar ga numpuk)
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Buat toast baru
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = "Ditambahkan ke keranjang";
  
  document.body.appendChild(toast);
  
  // Auto remove setelah animasi selesai
  setTimeout(() => {
    if (toast && toast.remove) toast.remove();
  }, 1500);
}

/* =====================
   PRODUCT DETAIL
===================== */
function openDetail(name, price, image, cat = "brand") {
  localStorage.setItem(
    "selectedProduct",
    JSON.stringify({ name, price, image, cat })
  );
  window.location.href = "product.html";
}

/* =====================
   SIZE PICKER
===================== */
let selectedSize = "40"; // Default size for catalog/home adds

function selectSize(btn) {
  document
    .querySelectorAll(".size-options button")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedSize = btn.innerText;
}

/* =====================
   CART PAGE (cart.html)
===================== */
function renderCart() {
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!wrap) return;

  wrap.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * item.qty;

    wrap.innerHTML += `
      <div class="cart-item">
        <img src="${item.image || 'images/placeholder.png'}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>Size: ${item.size}</p>
          <p>Rp ${item.price.toLocaleString("id-ID")}</p>

          <div class="cart-actions">
            <button onclick="changeQty(${i}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${i}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  totalEl.innerText = "Rp " + total.toLocaleString("id-ID");
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  if (document.getElementById("cartItems")) renderCart();
  if (document.getElementById("bagItems")) renderBag();
}

/* =====================
   FAQ
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const faqs = document.querySelectorAll(".faq-question");

  faqs.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;

      // optional: biar cuma 1 yang kebuka
      document.querySelectorAll(".faq-item").forEach(f => {
        if (f !== item) f.classList.remove("active");
      });

      item.classList.toggle("active");
    });
  });
});

/* =====================
   SORTING & FILTER PRODUCTS (untuk shop.html)
===================== */

function sortProducts() {
  const sortValue = document.getElementById("sortProducts").value;
  const grid = document.querySelector(".catalog-grid");
  if (!grid) return;
  
  // Ambil semua tile yang sedang TIDAK di-hide oleh filter
  const tiles = Array.from(grid.querySelectorAll(".tile")).filter(tile => {
    return tile.style.display !== "none";
  });
  
  if (sortValue === "price-asc") {
    tiles.sort((a, b) => {
      let priceA = parseInt(a.querySelector(".price")?.innerText.replace(/[^0-9]/g, "") || 0);
      let priceB = parseInt(b.querySelector(".price")?.innerText.replace(/[^0-9]/g, "") || 0);
      return priceA - priceB;
    });
  } 
  else if (sortValue === "price-desc") {
    tiles.sort((a, b) => {
      let priceA = parseInt(a.querySelector(".price")?.innerText.replace(/[^0-9]/g, "") || 0);
      let priceB = parseInt(b.querySelector(".price")?.innerText.replace(/[^0-9]/g, "") || 0);
      return priceB - priceA;
    });
  }
  else if (sortValue === "name-asc") {
    tiles.sort((a, b) => {
      let nameA = a.querySelector(".name")?.innerText.toLowerCase() || "";
      let nameB = b.querySelector(".name")?.innerText.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
  }
  else if (sortValue === "name-desc") {
    tiles.sort((a, b) => {
      let nameA = a.querySelector(".name")?.innerText.toLowerCase() || "";
      let nameB = b.querySelector(".name")?.innerText.toLowerCase() || "";
      return nameB.localeCompare(nameA);
    });
  }
  
  // Urutkan ulang di DOM
  tiles.forEach(tile => grid.appendChild(tile));
}

// Update jumlah produk yang tampil
function updateProductCount() {
  const countEl = document.getElementById("productCount");
  if (!countEl) return;
  
  const visibleTiles = document.querySelectorAll(".catalog-grid .tile[style='']");
  const count = visibleTiles.length;
  countEl.innerText = `Menampilkan ${count} produk`;
}

// Panggil updateCount setelah filter berubah
// Modifikasi fungsi applyCatalogFilter yang sudah ada
const originalApplyFilter = applyCatalogFilter;
applyCatalogFilter = function() {
  originalApplyFilter();
  updateProductCount();
}

// Init count saat halaman load
document.addEventListener("DOMContentLoaded", () => {
  updateProductCount();
});
/* =====================
   MOBILE DROPDOWN CLICK
===================== */
document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && window.innerWidth <= 768) {
    const dropbtn = dropdown.querySelector('.dropbtn');
    dropbtn.addEventListener('click', function(e) {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });
  }
});
/* =====================
   FILTER KATEGORI DARI HOME PAGE
   ===================== */

// Fungsi untuk membaca parameter URL (contoh: ?category=sneakers atau ?brand=Nike)
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category'),
    brand: params.get('brand')
  };
}

// Fungsi untuk menyaring produk berdasarkan kategori/brand
function filterProductsByUrlParams() {
  const params = getUrlParams();
  
  // Jika tidak ada parameter, tidak perlu filter
  if (!params.category && !params.brand) return;
  
  // Cari semua produk di halaman katalog
  const tiles = document.querySelectorAll('.catalog-grid .tile');
  
  if (tiles.length === 0) return;
  
  let visibleCount = 0;
  
  tiles.forEach(tile => {
    const nameEl = tile.querySelector('.name');
    if (!nameEl) return;
    
    const productName = nameEl.innerText.trim();
    const product = productMetadata[productName];
    
    if (!product) {
      tile.style.display = "";
      visibleCount++;
      return;
    }
    
    let show = true;
    
    // Filter berdasarkan kategori (jika ada)
    if (params.category) {
      if (product.category !== params.category) {
        show = false;
      }
    }
    
    // Filter berdasarkan brand (jika ada)
    if (show && params.brand) {
      if (product.brand !== params.brand) {
        show = false;
      }
    }
    
    tile.style.display = show ? "" : "none";
    if (show) visibleCount++;
  });
  
  // Update tampilan jumlah produk
  const countEl = document.getElementById('productCount');
  if (countEl) countEl.innerText = visibleCount;
  
  // Tampilkan chip filter aktif
  const summaryEl = document.getElementById('filterSummary');
  if (summaryEl && (params.category || params.brand)) {
    let filterText = params.category ? `Kategori: ${params.category}` : `Brand: ${params.brand}`;
    summaryEl.innerHTML = `<span class="filter-chip">${filterText} <button onclick="clearFilterAndReload()">✕</button></span>`;
  }
}

// Fungsi untuk membersihkan filter
function clearFilterAndReload() {
  window.location.href = 'shop.html';
}

// Data produk (metadata untuk keperluan filter)
const productMetadata = {
  "Nike Dunk Low Retro": { category: "sneakers", brand: "Nike", price: 1549000 },
  "Nike Zoom Vomero 5": { category: "running", brand: "Nike", price: 2489000 },
  "Adidas GAZELLE LO PRO SHOES": { category: "originals", brand: "Adidas", price: 1700000 },
  "PUMA x SPARCO Speedcat": { category: "sneakers", brand: "Puma", price: 1999000 },
  "PUMA x SPARCO Speedcat red": { category: "sneakers", brand: "Puma", price: 1999000 },
  "Salomon XT-6 GORE-TEX": { category: "trail", brand: "Salomon", price: 2699000 },
  "Onitsuka Tiger TOKUTEN": { category: "originals", brand: "Onitsuka Tiger", price: 1499000 },
  "Adidas Handball Spezial": { category: "originals", brand: "Adidas", price: 1699000 },
  "New Balance 574 trainers": { category: "sneakers", brand: "New Balance", price: 1399000 },
  "CONVERSE RUN STAR TRAINER OX SNEAKERS": { category: "sneakers", brand: "Converse", price: 1165000 },
  "ADIDAS ORIGINALS SAMBA JANE": { category: "originals", brand: "Adidas", price: 1500000 },
  "Samba Shoes Black": { category: "originals", brand: "Adidas", price: 1800000 },
  "Kanky x STAPLE EXC 01 Gosht White": { category: "sneakers", brand: "Lokal", price: 540000 },
  "Kanky Story Kitadake - Kanky Sportstyle": { category: "sneakers", brand: "Lokal", price: 440000 },
  "CARDINAL SNEAKERS": { category: "sneakers", brand: "Lokal", price: 269000 },
  "Compas Tribune Mankind Black": { category: "sneakers", brand: "Lokal", price: 758000 },
  "Compas Tribune Away Maroon": { category: "sneakers", brand: "Lokal", price: 648000 },
  "DR.KEVIN SNEAKERS": { category: "sneakers", brand: "Lokal", price: 145000 },
  "UNDER ARMOUR ESSENTIAL": { category: "running", brand: "Lokal", price: 953000 },
  "Brodo Ace Nexus X NAH Serenity White OWS": { category: "sneakers", brand: "Lokal", price: 599000 }
};

// Jalankan filter saat halaman shop.html selesai loading
document.addEventListener("DOMContentLoaded", function() {
  // Cek apakah ini halaman shop (ada .catalog-grid)
  if (document.querySelector('.catalog-grid')) {
    filterProductsByUrlParams();
  }
});

// Untuk mobile dropdown (opsional)
document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && window.innerWidth <= 768) {
    const dropbtn = dropdown.querySelector('.dropbtn');
    if (dropbtn) {
      dropbtn.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
    }
  }
});
// Toggle Wishlist (Favorit)
function toggleFav(productName) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const index = wishlist.indexOf(productName);
  
  if (index === -1) {
    wishlist.push(productName);
    showToast(`${productName} ditambahkan ke wishlist ❤️`);
  } else {
    wishlist.splice(index, 1);
    showToast(`${productName} dihapus dari wishlist`, "warning");
  }
  
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  
  // Update tampilan icon fav
  const favBtns = document.querySelectorAll(".fav");
  favBtns.forEach(btn => {
    const tile = btn.closest(".tile");
    if (tile) {
      const nameEl = tile.querySelector(".name");
      if (nameEl && nameEl.innerText === productName) {
        if (index === -1) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    }
  });
}

// Toast untuk feedback
function showToast(message, type = "success") {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = message;
  
  if (type === "warning") {
    toast.style.background = "#ff3b3b";
    toast.style.color = "#fff";
  } else {
    toast.style.background = "#00ff99";
    toast.style.color = "#000";
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast && toast.remove) toast.remove();
  }, 2000);
}
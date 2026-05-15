/* =====================
   STOCK MANAGEMENT DATA
   ===================== */

// Data stok produk berdasarkan ukuran
const stockDatabase = {
  // Brand Products
  "Nike Dunk Low Retro": {
    sizes: { 40: 5, 41: 3, 42: 0, 43: 2, 44: 4, 45: 1 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Nike Zoom Vomero 5": {
    sizes: { 40: 2, 41: 4, 42: 3, 43: 1, 44: 0, 45: 2 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Adidas GAZELLE LO PRO SHOES": {
    sizes: { 40: 3, 41: 5, 42: 2, 43: 4, 44: 1, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "PUMA x SPARCO Speedcat": {
    sizes: { 40: 4, 41: 2, 42: 5, 43: 3, 44: 1, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "PUMA x SPARCO Speedcat red": {
    sizes: { 40: 1, 41: 3, 42: 2, 43: 0, 44: 1, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Salomon XT-6 GORE-TEX": {
    sizes: { 40: 0, 41: 2, 42: 3, 43: 1, 44: 0, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Onitsuka Tiger TOKUTEN": {
    sizes: { 40: 6, 41: 4, 42: 5, 43: 3, 44: 2, 45: 1 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Adidas Handball Spezial": {
    sizes: { 40: 2, 41: 3, 42: 4, 43: 2, 44: 1, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "New Balance 574 trainers": {
    sizes: { 40: 4, 41: 5, 42: 3, 43: 2, 44: 1, 45: 1 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  
  // Local Products
  "Kanky x STAPLE EXC 01 Gosht White": {
    sizes: { 40: 3, 41: 2, 42: 4, 43: 1, 44: 0, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Kanky Story Kitadake - Kanky Sportstyle": {
    sizes: { 40: 5, 41: 3, 42: 2, 43: 4, 44: 1, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "CARDINAL SNEAKERS": {
    sizes: { 40: 8, 41: 6, 42: 5, 43: 4, 44: 3, 45: 2 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "Compas Tribune Mankind Black": {
    sizes: { 40: 2, 41: 3, 42: 1, 43: 0, 44: 0, 45: 0 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  },
  "DR.KEVIN SNEAKERS": {
    sizes: { 40: 10, 41: 8, 42: 7, 43: 5, 44: 4, 45: 3 },
    totalStock: function() { return Object.values(this.sizes).reduce((a,b) => a + b, 0); }
  }
};

// Fungsi untuk mendapatkan stok produk
function getProductStock(productName, size) {
  const product = stockDatabase[productName];
  if (!product) return { available: true, stock: 999, isLow: false }; // Default stok banyak
  if (!size) return { available: product.totalStock() > 0, stock: product.totalStock(), isLow: product.totalStock() <= 5 };
  
  const stock = product.sizes[size] || 0;
  return {
    available: stock > 0,
    stock: stock,
    isLow: stock > 0 && stock <= 3,
    isOut: stock === 0
  };
}

// Fungsi untuk mengurangi stok setelah checkout
function reduceStock(productName, size, qty) {
  const product = stockDatabase[productName];
  if (product && product.sizes[size]) {
    product.sizes[size] = Math.max(0, product.sizes[size] - qty);
    // Simpan ke localStorage agar perubahan stok permanen
    localStorage.setItem("stockDatabase", JSON.stringify(stockDatabase));
    return true;
  }
  return false;
}

// Fungsi untuk menambah stok (admin)
function addStock(productName, size, qty) {
  const product = stockDatabase[productName];
  if (product && product.sizes[size] !== undefined) {
    product.sizes[size] += qty;
    localStorage.setItem("stockDatabase", JSON.stringify(stockDatabase));
    return true;
  }
  return false;
}

// Load stok dari localStorage saat startup
function loadStockFromLocal() {
  const savedStock = localStorage.getItem("stockDatabase");
  if (savedStock) {
    const parsed = JSON.parse(savedStock);
    Object.keys(parsed).forEach(productName => {
      if (stockDatabase[productName]) {
        stockDatabase[productName].sizes = parsed[productName].sizes;
      }
    });
  }
}

// Panggil saat halaman dimuat
loadStockFromLocal();
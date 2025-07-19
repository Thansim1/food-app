const foodItems = [
    { id: 1, name: 'Burger', price: 99, category: 'nonveg' },
    { id: 2, name: 'Pizza', price: 199, category: 'veg' },
    { id: 3, name: 'Fried Rice', price: 129, category: 'veg' },
    { id: 4, name: 'Pasta', price: 149, category: 'veg' },
    { id: 5, name: 'Veg Sandwich', price: 89, category: 'veg' },
    { id: 6, name: 'Paneer Wrap', price: 119, category: 'veg' },
    { id: 7, name: 'Cold Coffee', price: 79, category: 'drinks' },
    { id: 8, name: 'Lemon Juice', price: 49, category: 'drinks' },
    { id: 9, name: 'Chowmein', price: 139, category: 'nonveg' },
  ];
  
  function renderMenu(items) {
    const container = document.getElementById('menuItems');
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'food-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <input type="number" min="1" value="1" id="qty-${item.id}">
        <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  }
  
  function addToCart(id) {
    const qty = parseInt(document.getElementById(`qty-${id}`).value);
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (cart[id]) {
      cart[id] += qty;
    } else {
      cart[id] = qty;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
  
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const countSpan = document.getElementById('cartCount');
    if (countSpan) countSpan.textContent = count;
  }
  
  function applyFilters() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const filtered = foodItems.filter(item =>
      item.name.toLowerCase().includes(search) &&
      (category === 'all' || item.category === category)
    );
    renderMenu(filtered);
  }
  
  function renderSummary() {
    const container = document.getElementById('orderSummary');
    if (!container) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const name = localStorage.getItem('customerName') || '';
    let summaryHTML = `<h3>Order Summary for ${name}</h3><ul>`;
    let total = 0;
    for (let id in cart) {
      const item = foodItems.find(f => f.id == id);
      const qty = cart[id];
      const price = item.price * qty;
      total += price;
      summaryHTML += `<li>${item.name} x ${qty} = ₹${price}</li>`;
    }
    summaryHTML += `</ul><strong>Total: ₹${total}</strong>`;
    container.innerHTML = summaryHTML;
    localStorage.removeItem('cart');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('menuItems')) {
      renderMenu(foodItems);
      updateCartCount();
      document.getElementById('searchInput')?.addEventListener('input', applyFilters);
      document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    }
    if (document.getElementById('checkoutForm')) {
      document.getElementById('checkoutForm').addEventListener('submit', e => {
        e.preventDefault();
        const name = e.target.name.value;
        localStorage.setItem('customerName', name);
        window.location.href = 'summary.html';
      });
    }
    if (document.getElementById('orderSummary')) {
      renderSummary();
    }
  });
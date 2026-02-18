document.addEventListener('DOMContentLoaded', function() {
    const products = [];
    let filteredProducts = [];
    let editingId = null;

    // DOM Elements
    const inventoryGrid = document.getElementById('inventoryGrid');
    const totalValueEl = document.getElementById('totalValue');
    const totalProductsEl = document.getElementById('totalProducts');
    const lowStockEl = document.getElementById('lowStock');
    const searchInput = document.getElementById('searchInput');
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const notification = document.getElementById('notification');
    const addProductBtn = document.getElementById('addProductBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelFormBtn = document.getElementById('cancelForm');
    const clearSearchBtn = document.getElementById('clearSearch');

    // Initialize
    loadInventory();
    
    // Event Listeners
    addProductBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelFormBtn.addEventListener('click', closeModal);
    clearSearchBtn.addEventListener('click', clearSearch);
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    productForm.addEventListener('submit', handleFormSubmit);

    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = type === 'error' ? 'error' : '';
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
        }, 3000);
    }

    function openModal(mode, id = null) {
        editingId = id;
        document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Edit Product' : 'Add Product';
        document.getElementById('productId').disabled = mode === 'edit';
        productModal.classList.remove('hidden');
        setTimeout(() => productModal.classList.add('show'), 10);
    }

    function closeModal() {
        productModal.classList.remove('show');
        setTimeout(() => {
            productModal.classList.add('hidden');
            resetForm();
        }, 300);
    }

    function resetForm() {
        productForm.reset();
        editingId = null;
        document.getElementById('productId').disabled = false;
    }

    async function loadInventory() {
        inventoryGrid.innerHTML = `
            <div class="loading-state">
                <div class="matrix-loader"></div>
                <span>LOADING INVENTORY...</span>
            </div>
        `;

        try {
            const response = await fetch('inventory.json');
            if (!response.ok) throw new Error('Inventory file not found');
            
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid JSON format');
            
            products.length = 0;
            products.push(...data);
            filteredProducts = [...products];
            renderProducts();
        } catch (error) {
            console.error('Load error:', error);
            showNotification('ERROR: ' + error.message, 'error');
            inventoryGrid.innerHTML = `
                <div class="no-data-state">
                    <div class="no-data-icon">⚠️</div>
                    <span>FAILED TO LOAD INVENTORY</span>
                </div>
            `;
        }
    }

    function renderProducts() {
        if (filteredProducts.length === 0) {
            inventoryGrid.innerHTML = `
                <div class="no-data-state">
                    <div class="no-data-icon">📦</div>
                    <span>NO PRODUCTS FOUND</span>
                </div>
            `;
            updateStats([], []);
            return;
        }

        const html = filteredProducts.map(product => createProductCard(product)).join('');
        inventoryGrid.innerHTML = html;
        updateStats(filteredProducts, products);
    }

    function createProductCard(product) {
        const isLowStock = product.stock <= 5;
        const isCriticalStock = product.stock <= 2;
        const stockClass = isCriticalStock ? 'stock-crit' : isLowStock ? 'stock-low' : '';

        return `
            <div class="product-card" onclick="editProduct('${product.id}')">
                <div class="product-id">${product.id}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-details">
                    <div class="detail-row">
                        <span>Price</span>
                        <span>$${product.price.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span>Stock</span>
                        <span class="${stockClass}">${product.stock}</span>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-edit-card" onclick="event.stopPropagation(); editProduct('${product.id}')">EDIT</button>
                    <button class="btn-delete-card" onclick="event.stopPropagation(); deleteProduct('${product.id}')">DELETE</button>
                </div>
            </div>
        `;
    }

    function updateStats(visibleProducts, allProducts) {
        const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const lowStockCount = allProducts.filter(p => p.stock <= 5).length;
        
        totalValueEl.textContent = `$${totalValue.toLocaleString()}`;
        totalProductsEl.textContent = allProducts.length;
        lowStockEl.textContent = lowStockCount;
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(p => 
                p.category.toLowerCase().includes(query)
            );
        }
        renderProducts();
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function validateProduct(product) {
        if (!/^P\d{3}$/.test(product.id)) return 'ID must be P001 format';
        if (product.name.length < 2) return 'Name too short';
        if (product.category.length < 2) return 'Category required';
        if (product.price <= 0) return 'Price must be positive';
        if (product.stock < 0) return 'Stock cannot be negative';
        return null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const product = {
            id: document.getElementById('productId').value.trim(),
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value)
        };

        const validationError = validateProduct(product);
        if (validationError) {
            showNotification('ERROR: ' + validationError, 'error');
            return;
        }

        if (editingId) {
            const index = products.findIndex(p => p.id === editingId);
            if (index !== -1) {
                products[index] = product;
                showNotification('✅ Product updated!');
            }
        } else {
            // Check duplicate ID
            if (products.find(p => p.id === product.id)) {
                showNotification('ERROR: ID already exists!', 'error');
                return;
            }
            products.push(product);
            showNotification('✅ Product added!');
        }

        filteredProducts = [...products];
        renderProducts();
        closeModal();
    }

    function editProduct(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            openModal('edit', id);
        }
    }

    function deleteProduct(id) {
        if (confirm('Delete this product?')) {
            products.splice(products.findIndex(p => p.id === id), 1);
            filteredProducts = products.filter(p => 
                !searchInput.value || p.category.toLowerCase().includes(searchInput.value.toLowerCase())
            );
            renderProducts();
            showNotification('🗑️ Product deleted!');
        }
    }

    function clearSearch() {
        searchInput.value = '';
        filteredProducts = [...products];
        renderProducts();
    }

    // Global functions
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
});

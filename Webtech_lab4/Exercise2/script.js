document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');

    let debounceTimer;

    // Debounce function
    function debounce(func, delay) {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Show/hide elements
    function showLoading() {
        loadingSpinner.classList.remove('hidden');
        searchResults.innerHTML = '';
        noResults.classList.remove('show');
        hideError();
    }

    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }

    // Search products
    async function searchProducts(query) {
        if (query.length < 2) {
            searchResults.innerHTML = '';
            noResults.classList.remove('show');
            return;
        }

        showLoading();

        try {
            const response = await fetch('products.json');
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const products = await response.json();
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Filter products (case-insensitive)
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );

            displayResults(filteredProducts);

        } catch (error) {
            console.error('Search error:', error);
            showError('Failed to load products. Please try again.');
            searchResults.innerHTML = '';
        } finally {
            hideLoading();
        }
    }

    // Display search results
    function displayResults(products) {
        hideError();
        
        if (products.length === 0) {
            searchResults.innerHTML = '';
            noResults.classList.add('show');
            return;
        }

        noResults.classList.remove('show');

        const resultsHTML = products.map(product => `
            <div class="product-card">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-category">${product.category}</div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    }

    // Debounced search (300ms delay)
    const debouncedSearch = debounce(searchProducts, 300);

    // Input event listener
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        debouncedSearch(query);
    });

    // Clear results when input is empty
    searchInput.addEventListener('blur', function() {
        if (!this.value.trim()) {
            searchResults.innerHTML = '';
            noResults.classList.remove('show');
            hideError();
        }
    });
});

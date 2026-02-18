document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookForm');
    const toast = document.getElementById('toast');
    const booksBody = document.getElementById('booksBody');
    const totalBooksEl = document.getElementById('totalBooks');
    const availableBooksEl = document.getElementById('availableBooks');
    const issuedBooksEl = document.getElementById('issuedBooks');
    const booksTable = document.getElementById('booksTable');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const noBooksEl = document.getElementById('noBooks');
    const refreshBtn = document.getElementById('refreshBtn');
    const resetBtn = document.getElementById('resetBtn');

    let xmlDoc = null;

    // Load books on page load
    loadBooks();

    // Event listeners
    form.addEventListener('submit', handleAddBook);
    refreshBtn.addEventListener('click', loadBooks);
    resetBtn.addEventListener('click', resetForm);

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function resetForm() {
        form.reset();
    }

    function showLoading() {
        loadingSpinner.classList.remove('hidden');
        booksTable.classList.add('hidden');
        noBooksEl.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }

    async function loadBooks() {
        showLoading();

        try {
            const response = await fetch('books.xml');
            if (!response.ok) throw new Error('Books file not found');

            const xmlText = await response.text();
            const parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) throw new Error('Invalid XML format');

            displayBooks();
        } catch (error) {
            console.error('Load error:', error);
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.classList.remove('hidden');
        } finally {
            hideLoading();
        }
    }

    function displayBooks() {
        const books = xmlDoc.getElementsByTagName('book');
        booksBody.innerHTML = '';

        // Update stats
        let availableCount = 0;
        totalBooksEl.textContent = books.length;

        if (books.length === 0) {
            noBooksEl.classList.remove('hidden');
            return;
        }

        noBooksEl.classList.add('hidden');
        booksTable.classList.remove('hidden');

        Array.from(books).forEach((book, index) => {
            const id = book.getElementsByTagName('id')[0].textContent;
            const title = book.getElementsByTagName('title')[0].textContent;
            const author = book.getElementsByTagName('author')[0].textContent;
            const available = book.getElementsByTagName('available')[0].textContent === 'true';

            if (available) availableCount++;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${id}</strong></td>
                <td>${title}</td>
                <td>${author}</td>
                <td><span class="status-${available ? 'available' : 'issued'}">${available ? '✅ Available' : '❌ Issued'}</span></td>
                <td class="action-buttons">
                    <button class="btn-action btn-toggle" onclick="toggleBookStatus('${id}')">
                        ${available ? 'Issue' : 'Return'}
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteBook('${id}')">Delete</button>
                </td>
            `;
            booksBody.appendChild(row);
        });

        availableBooksEl.textContent = availableCount;
        issuedBooksEl.textContent = books.length - availableCount;
    }

    function validateBookData(id, title, author) {
        if (!id.match(/^B\d{3}$/)) return 'ID must be format B001';
        if (title.length < 2) return 'Title too short';
        if (author.length < 2) return 'Author name too short';
        return null;
    }

    async function handleAddBook(e) {
        e.preventDefault();
        
        const id = document.getElementById('bookId').value.trim();
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const status = document.getElementById('bookStatus').value;

        const validationError = validateBookData(id, title, author);
        if (validationError) {
            showToast(`❌ ${validationError}`, 'error');
            return;
        }

        // Check if ID exists
        const existingBooks = xmlDoc.getElementsByTagName('book');
        for (let book of existingBooks) {
            if (book.getElementsByTagName('id')[0].textContent === id) {
                showToast('❌ Book ID already exists!', 'error');
                return;
            }
        }

        try {
            // Create new book node
            const newBook = xmlDoc.createElement('book');
            newBook.appendChild(createTextElement(xmlDoc, 'id', id));
            newBook.appendChild(createTextElement(xmlDoc, 'title', title));
            newBook.appendChild(createTextElement(xmlDoc, 'author', author));
            newBook.appendChild(createTextElement(xmlDoc, 'available', status));

            const libraryNode = xmlDoc.getElementsByTagName('library')[0];
            libraryNode.appendChild(newBook);

            showToast('✅ Book added successfully!');
            resetForm();
            displayBooks();
        } catch (error) {
            showToast('❌ Failed to add book', 'error');
        }
    }

    function createTextElement(doc, tagName, textContent) {
        const element = doc.createElement(tagName);
        element.appendChild(doc.createTextNode(textContent));
        return element;
    }

    function toggleBookStatus(id) {
        try {
            const books = xmlDoc.getElementsByTagName('book');
            for (let book of books) {
                if (book.getElementsByTagName('id')[0].textContent === id) {
                    const availableNode = book.getElementsByTagName('available')[0];
                    const currentStatus = availableNode.textContent === 'true';
                    availableNode.textContent = (!currentStatus).toString();
                    displayBooks();
                    showToast(currentStatus ? '✅ Book issued' : '✅ Book returned');
                    return;
                }
            }
        } catch (error) {
            showToast('❌ Toggle failed', 'error');
        }
    }

    function deleteBook(id) {
        if (!confirm('Delete this book permanently?')) return;

        try {
            const books = xmlDoc.getElementsByTagName('book');
            for (let book of books) {
                if (book.getElementsByTagName('id')[0].textContent === id) {
                    book.parentNode.removeChild(book);
                    displayBooks();
                    showToast('🗑️ Book deleted successfully');
                    return;
                }
            }
        } catch (error) {
            showToast('❌ Delete failed', 'error');
        }
    }

    // Global functions
    window.toggleBookStatus = toggleBookStatus;
    window.deleteBook = deleteBook;
});

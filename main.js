// Function to generate a unique ID for each book
function generateId() {
    return new Date().getTime();
}

// Function to save books to localStorage
function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function to retrieve books from localStorage
function getBooks() {
    const books = localStorage.getItem('books');
    return books ? JSON.parse(books) : [];
}

function addBook(title, author, year, isComplete) {
    const books = getBooks();
    const newBook = {
        id: generateId(),
        title,
        author,
        year,
        isComplete
    };
    books.push(newBook);
    saveBooks(books);
    
    // Show popup message after adding a book
    alert('Buku berhasil ditambahkan!');
    // Refresh the displayed books after adding a new one
    displayBooks();
}

function displayBooks(searchTerm = '') {
    const books = getBooks();
    const incompleteBooks = books.filter(book => !book.isComplete && book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const completeBooks = books.filter(book => book.isComplete && book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    // Clear existing lists
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    // Display incomplete books
    incompleteBooks.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.setAttribute('data-bookid', book.id);
        bookItem.setAttribute('data-testid', 'bookItem');
        bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton" onclick="moveBook(${book.id}, true)">Selesai dibaca</button>
                <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
                <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
            </div>
        `;
        incompleteBookList.appendChild(bookItem);
    });

    // Display complete books
    completeBooks.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.setAttribute('data-bookid', book.id);
        bookItem.setAttribute('data-testid', 'bookItem');
        bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton" onclick="moveBook(${book.id}, false)">Belum selesai dibaca</button>
                <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
                <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
            </div>
        `;
        completeBookList.appendChild(bookItem);
    });
}

// Function to move a book between shelves
function moveBook(id, isComplete) {
    const books = getBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex > -1) {
        books[bookIndex].isComplete = isComplete;
        saveBooks(books);
        
        // Show popup message after moving a book
        alert('Buku berhasil dipindahkan!');
        // Refresh the displayed books after moving
        displayBooks();
    }
}

// Function to delete a book
function deleteBook(id) {
    const books = getBooks();
    const updatedBooks = books.filter(book => book.id !== id);
    saveBooks(updatedBooks);
    
    // Show popup message after deletion
    alert('Buku berhasil dihapus!');
    // Refresh the displayed books after deletion
    displayBooks();
}

// Function to edit a book
const bookForm = document.getElementById('bookForm');
const bookFormSubmit = document.getElementById('bookFormSubmit');

function editBook(id) {
    const books = getBooks();
    const book = books.find(book => book.id === id);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;

        // Create a new button for editing
        const editFormSubmit = document.createElement('button');
        editFormSubmit.id = 'editFormSubmit';
        editFormSubmit.innerText = 'Update Buku';
        bookForm.appendChild(editFormSubmit);
        
        // Hide the submit button
        bookFormSubmit.style.display = 'none'; // Hide submit button

        // Add event listener for the new edit button
        editFormSubmit.addEventListener('click', handleUpdateBook);
    }
}

function handleUpdateBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    // Update the existing book
    const bookId = bookForm.dataset.bookId;
    const books = getBooks();
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex > -1) {
        books[bookIndex] = { id: bookId, title, author, year, isComplete };
        saveBooks(books);
        alert('Buku berhasil diperbarui!');
    }
    
    // Remove the edit button and show the submit button again
    const editFormSubmit = document.getElementById('editFormSubmit');
    editFormSubmit.remove();
    bookFormSubmit.style.display = 'block'; // Show submit button again
    displayBooks();
}

// Load books from localStorage on page load
window.onload = function() {
    displayBooks();
};

bookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    if (bookForm.dataset.editing === "true") {
        // This block is now handled by the editFormSubmit button
    } else {
        addBook(title, author, year, isComplete);
    }
    displayBooks();
});

// Event listener for search input
document.getElementById('searchBookTitle').addEventListener('input', function(event) {
    const searchTerm = event.target.value;
    displayBooks(searchTerm);
});

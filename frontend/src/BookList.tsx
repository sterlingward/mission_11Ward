// Sterling's BookList.tsx

import { useEffect, useState } from 'react';
import { Book } from './types/Book';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  book: Book;
  quantity: number;
}

interface BookListProps {
  addToCart: (book: Book) => void;
  cart: CartItem[];
  setLastPage: (pageNum: number) => void;
  lastPage: number;
}

function BookList({ addToCart, cart, setLastPage, lastPage }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(lastPage || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortMode, setSortMode] = useState<'default' | 'asc' | 'desc'>(
    'default'
  );
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&category=${categoryFilter}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, categoryFilter]);

  // Fetch all categories once
  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch(
        `https://localhost:5000/Book/AllBooks?pageSize=1000&pageNum=1`
      );
      const data = await res.json();
      const categories = Array.from(
        new Set(data.books.map((b: Book) => b.category))
      );
      setAllCategories(['All', ...categories]);
    };
    fetchAll();
  }, []);

  // Sort books
  const handleSortByTitle = () => {
    const newSort: 'default' | 'asc' | 'desc' =
      sortMode === 'default' ? 'asc' : sortMode === 'asc' ? 'desc' : 'default';
    setSortMode(newSort);

    if (newSort === 'default') return;
    const sorted = [...books].sort((a, b) =>
      newSort === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
    setBooks(sorted);
  };

  // Add book to cart
  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setLastPage(pageNum);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Prof Hilton's Book Store</h1>

      {/* Cart Summary with BADGE – #notcoveredinthevideos THIS IS ONE OF THE THINGS THAT I ADDED THAT WE HAVEN'T DONE.*/}
      <div className="d-flex justify-content-end align-items-center mb-3">
        <button
          className="btn btn-primary me-3"
          onClick={() => navigate('/cart')}
        >
          View Cart{' '}
          <span className="badge bg-light text-dark ms-2">{cartCount}</span>
        </button>
        <strong>Total: ${cartTotal.toFixed(2)}</strong>
      </div>

      {/* Toast – #notcoveredinthevideos THIS IS MY SECOND BOOTSTRAP ITEM THAT WE HAVEN'T COVERED.*/}
      <div
        className={`toast align-items-center text-bg-success position-fixed bottom-0 end-0 m-3 ${
          showToast ? 'show' : 'hide'
        }`}
        role="alert"
      >
        <div className="d-flex">
          <div className="toast-body">Book added to cart!</div>
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex justify-content-between flex-wrap mb-4">
        {/* Category Filter */}
        <div>
          <label className="me-2 fw-semibold">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPageNum(1);
            }}
            className="form-select d-inline w-auto"
          >
            {allCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="me-2 fw-semibold">Results Per Page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNum(1);
            }}
            className="form-select d-inline w-auto"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <button
          onClick={handleSortByTitle}
          className="btn btn-outline-secondary"
        >
          Sort by Title{' '}
          {sortMode === 'default'
            ? '(Default)'
            : sortMode === 'asc'
              ? '(Ascending)'
              : '(Descending)'}
        </button>
      </div>

      {/* Book Cards */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {books.map((b) => (
          <div key={b.bookID} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{b.title}</h5>
                <ul className="list-unstyled mb-3">
                  <li>
                    <strong>Author:</strong> {b.author}
                  </li>
                  <li>
                    <strong>Publisher:</strong> {b.publisher}
                  </li>
                  <li>
                    <strong>ISBN:</strong> {b.isbn}
                  </li>
                  <li>
                    <strong>Classification:</strong> {b.classification}
                  </li>
                  <li>
                    <strong>Category:</strong> {b.category}
                  </li>
                  <li>
                    <strong>Page Count:</strong> {b.pageCount}
                  </li>
                  <li>
                    <strong>Price:</strong> ${b.price.toFixed(2)}
                  </li>
                </ul>
                <button
                  className="btn btn-success w-100"
                  onClick={() => handleAddToCart(b)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
        <button
          className="btn btn-outline-primary"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`btn ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setPageNum(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="btn btn-outline-primary"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookList;

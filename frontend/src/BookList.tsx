// Sterling's Website

import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function BookList() {
  // State for storing current book list and original default list
  const [books, setBooks] = useState<Book[]>([]);
  const [defaultBooks, setDefaultBooks] = useState<Book[]>([]);

  // Pagination states
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Sorting mode state (default, ascending, or descending)
  const [sortMode, setSortMode] = useState<'default' | 'asc' | 'desc'>(
    'default'
  );

  // Fetch books when page size, page number, or totalItems changes
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`
      );
      const data = await response.json();

      // Set the fetched books and maintain original ordering
      setBooks(data.books);
      setDefaultBooks(data.books);

      // Update pagination info
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Use data.totalNumBooks instead of stale totalItems
      setSortMode('default');
    };

    fetchBooks();
  }, [pageSize, pageNum]);

  // Handle sorting the books by title
  const handleSortByTitle = () => {
    let newSortMode: 'default' | 'asc' | 'desc';

    // Toggle sorting mode
    if (sortMode === 'default') {
      newSortMode = 'asc';
    } else if (sortMode === 'asc') {
      newSortMode = 'desc';
    } else {
      newSortMode = 'default';
    }
    setSortMode(newSortMode);

    // Apply the selected sorting logic
    if (newSortMode === 'default') {
      setBooks(defaultBooks); // Revert to original order
    } else if (newSortMode === 'asc') {
      const sorted = [...defaultBooks].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setBooks(sorted);
    } else if (newSortMode === 'desc') {
      const sorted = [...defaultBooks].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      setBooks(sorted);
    }
  };

  return (
    <>
      {/* Page Header */}
      <h1>Prof Hilton's Book Store</h1>
      <br />

      {/* Sort Button */}
      <button onClick={handleSortByTitle} className="btn btn-outline-secondary">
        Sort by Title{' '}
        {sortMode === 'default'
          ? '(Default)'
          : sortMode === 'asc'
            ? '(Ascending)'
            : '(Descending)'}
      </button>
      <br />
      <br />

      {/* Book Cards */}
      {books.map((b) => (
        <div key={b.bookID}>
          <div id="bookCard" className="card border-secondary mb-3">
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author: </strong>
                  {b.author}
                </li>
                <li>
                  <strong>Publisher: </strong>
                  {b.publisher}
                </li>
                <li>
                  <strong>ISBN: </strong>
                  {b.isbn}
                </li>
                <li>
                  <strong>Classification: </strong>
                  {b.classification}
                </li>
                <li>
                  <strong>Category: </strong>
                  {b.category}
                </li>
                <li>
                  <strong>Page Count: </strong>
                  {b.pageCount}
                </li>
                <li>
                  <strong>Price: </strong>${b.price.toFixed(2)}
                </li>
              </ul>
            </div>
          </div>
          <br />
        </div>
      ))}
      <br />

      {/* Results Per Page Dropdown */}
      <label>
        Results Per Page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value)); // Update page size
            setPageNum(1); // Reset to page 1
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
      <br />
      <br />

      {/* Pagination Controls */}
      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {/* Individual Page Buttons */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setPageNum(i + 1)}
          disabled={pageNum === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>
    </>
  );
}

export default BookList;

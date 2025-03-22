// Sterling's Website

import { useEffect, useState } from 'react';
import { Book } from './types/book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [defaultBooks, setDefaultBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortMode, setSortMode] = useState<'default' | 'asc' | 'desc'>(
    'default'
  );

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`
      );
      const data = await response.json();
      setBooks(data.books);
      setDefaultBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
      setSortMode('default');
    };
    fetchBooks();
  }, [pageSize, pageNum, totalItems]);

  const handleSortByTitle = () => {
    let newSortMode: 'default' | 'asc' | 'desc';
    if (sortMode === 'default') {
      newSortMode = 'asc';
    } else if (sortMode === 'asc') {
      newSortMode = 'desc';
    } else {
      newSortMode = 'default';
    }
    setSortMode(newSortMode);

    if (newSortMode === 'default') {
      // Revert to the original unsorted order
      setBooks(defaultBooks);
    } else if (newSortMode === 'asc') {
      // Sort ascending based on the original unsorted list
      const sorted = [...defaultBooks].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setBooks(sorted);
    } else if (newSortMode === 'desc') {
      // Sort descending based on the original unsorted list
      const sorted = [...defaultBooks].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      setBooks(sorted);
    }
  };

  return (
    <>
      <h1>Prof Hilton's Book Store</h1>
      <br />

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

      <label>
        Results Per Page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
      <br />
      <br />

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

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

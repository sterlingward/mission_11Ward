import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookList from './BookList';
import Cart from './Cart';
import { Book } from './types/Book';

interface CartItem {
  book: Book;
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastPage, setLastPage] = useState<number>(1);

  // Load cart from sessionStorage
  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.bookID === book.bookID);
      if (existing) {
        return prev.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { book, quantity: 1 }];
      }
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <BookList
            addToCart={addToCart}
            cart={cart}
            setLastPage={setLastPage}
            lastPage={lastPage}
          />
        }
      />
      <Route
        path="/cart"
        element={<Cart cart={cart} setCart={setCart} lastPage={lastPage} />}
      />
    </Routes>
  );
}

export default App;

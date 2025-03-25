// Sterling's Project – App.tsx

import './App.css';
import BookList from './BookList';
import Cart from './Cart';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Book } from './types/Book';

// Cart item shape
interface CartItem {
  book: Book;
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastPage, setLastPage] = useState<number>(1);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.book.bookID === book.bookID
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { book, quantity: 1 }];
      }
    });
  };

  return (
    <Router>
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
    </Router>
  );
}

export default App;

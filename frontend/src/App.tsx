// Sterling's Cart.tsx

import { useNavigate } from 'react-router-dom';
import { Book } from './types/Book';

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  lastPage: number;
}

function Cart({ cart, setCart, lastPage }: CartProps) {
  const navigate = useNavigate();

  // Increase quantity
  const increaseQty = (bookID: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.book.bookID === bookID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (bookID: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.book.bookID === bookID
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeFromCart = (bookID: number) => {
    setCart((prev) => prev.filter((item) => item.book.bookID !== bookID));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is empty.</div>
      ) : (
        <div className="row row-cols-1 g-4">
          {cart.map((item) => (
            <div key={item.book.bookID} className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.book.title}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> ${item.book.price.toFixed(2)} <br />
                    <strong>Quantity:</strong>{' '}
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => decreaseQty(item.book.bookID)}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => increaseQty(item.book.bookID)}
                    >
                      +
                    </button>
                    <br />
                    <strong>Subtotal:</strong> $
                    {(item.book.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.book.bookID)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-5">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/', { state: { page: lastPage } })}
        >
          ← Continue Shopping
        </button>

        <h4>Total: ${total.toFixed(2)}</h4>
      </div>
    </div>
  );
}

export default Cart;

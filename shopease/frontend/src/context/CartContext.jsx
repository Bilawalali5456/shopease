import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

/**
 * CartProvider — manages shopping cart, saved-for-later, and shipping address
 * All state is persisted to localStorage
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});

  // ─── Rehydrate from localStorage on mount ───────────────────────────
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) setCartItems(JSON.parse(storedCart));

      const storedSaved = localStorage.getItem('savedForLater');
      if (storedSaved) setSavedForLater(JSON.parse(storedSaved));

      const storedShipping = localStorage.getItem('shippingAddress');
      if (storedShipping) setShippingAddress(JSON.parse(storedShipping));
    } catch (error) {
      console.error('Failed to rehydrate cart state:', error);
    }
  }, []);

  // ─── Persist helpers ────────────────────────────────────────────────
  const persistCart = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const persistSaved = (items) => {
    localStorage.setItem('savedForLater', JSON.stringify(items));
  };

  // ─── Cart Actions ───────────────────────────────────────────────────

  /**
   * Add product to cart (or update qty if already exists)
   * @param {Object} product - { _id, name, imageUrl, price, countInStock }
   * @param {number} qty - quantity to set
   */
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i._id === product._id);
      let updated;

      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: Math.min(qty, updated[existingIndex].countInStock),
        };
      } else {
        updated = [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            imageUrl: product.imageUrl || product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: Math.min(qty, product.countInStock),
          },
        ];
      }

      persistCart(updated);
      return updated;
    });
  };

  /**
   * Remove item from cart by product ID
   * @param {string} id - Product _id
   */
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      persistCart(updated);
      return updated;
    });
  };

  /**
   * Update quantity of a cart item
   * @param {string} id - Product _id
   * @param {number} qty - new quantity (clamped to 1..countInStock)
   */
  const updateQty = (id, qty) => {
    setCartItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id === id) {
          const clampedQty = Math.max(1, Math.min(qty, item.countInStock));
          return { ...item, qty: clampedQty };
        }
        return item;
      });
      persistCart(updated);
      return updated;
    });
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  /**
   * Move item from cart to saved-for-later
   * @param {string} id - Product _id
   */
  const saveForLater = (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;

    setCartItems((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      persistCart(updated);
      return updated;
    });

    setSavedForLater((prev) => {
      // Avoid duplicates
      if (prev.find((i) => i._id === id)) return prev;
      const updated = [...prev, item];
      persistSaved(updated);
      return updated;
    });
  };

  /**
   * Move item from saved-for-later back to cart
   * @param {string} id - Product _id
   */
  const moveToCart = (id) => {
    const item = savedForLater.find((i) => i._id === id);
    if (!item) return;

    setSavedForLater((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      persistSaved(updated);
      return updated;
    });

    setCartItems((prev) => {
      // Avoid duplicates — if already in cart, just return
      if (prev.find((i) => i._id === id)) return prev;
      const updated = [...prev, { ...item, qty: 1 }];
      persistCart(updated);
      return updated;
    });
  };

  /**
   * Remove item from saved-for-later
   * @param {string} id - Product _id
   */
  const removeSavedItem = (id) => {
    setSavedForLater((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      persistSaved(updated);
      return updated;
    });
  };

  /**
   * Save shipping address to state and localStorage
   * @param {Object} data - { address, city, postalCode, country }
   */
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // ─── Computed Values ────────────────────────────────────────────────
  const itemCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const subtotal = Number(
    cartItems
      .reduce((acc, item) => acc + (item.qty || 1) * item.price, 0)
      .toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater,
        shippingAddress,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        saveForLater,
        moveToCart,
        removeSavedItem,
        saveShippingAddress,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to access cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

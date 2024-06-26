const express = require('express');
const router = express.Router();
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel'); // Assuming you have a Product model

// GET request to calculate cart total
router.get('/cart-total', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming userId is available after authentication

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate subtotal and total based on items in the cart
    let subtotal = 0;

    // Loop through each item in the cart
    for (const item of cart.items) {
      // Find the product details using itemId
      const product = await Product.findById(item.itemId);

      if (!product) {
        // Handle the case if the product is not found
        console.error(`Product with ID ${item.itemId} not found`);
        continue; // Skip this item and proceed to the next one
      }

      // Calculate the total price for this item (price * quantity)
      const itemTotal = product.price * item.quantity;

      // Add the total price of this item to the subtotal
      subtotal += itemTotal;
    }

    // Calculate total considering delivery fee and discount if any
    const deliveryFee = 5; // Assuming a fixed delivery fee
    const discount = 0; // Assuming no discount for now
    const total = subtotal + deliveryFee - discount;

    res.json({ subtotal, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET request to get cart data
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Get product details for items in the cart
    const productIds = cart.items.map(item => item.itemId);
    const products = await Product.find({ '_id': { $in: productIds } });

    const cartItems = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.itemId);
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.img,
        sellerID: product.sellerID,
        quantity: item.quantity,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Import other cart routes from the controller
const { getCarts, addItemToCart, removeItemFromCart, updateItemQuantity } = require('../controllers/CartController');

// Other cart routes
router.get('/', getCarts);
router.post('/add/:productID', addItemToCart);
router.delete('/remove', removeItemFromCart);
router.put('/update', updateItemQuantity);

module.exports = router;

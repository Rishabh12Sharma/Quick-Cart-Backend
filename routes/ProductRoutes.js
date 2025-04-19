const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { upload } = require("../config/cloudinary"); // ✅ Import Multer setup
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware

// ✅ Upload Image & Add Product
router.post("/add", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // ✅ Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "All fields including image URL are required" });
    }

    // ✅ Save product to MongoDB
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image, // Using direct URL
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Products (with optional search and filters)
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive name match
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get a Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Add this middleware to the routes that need user authentication
// Remove the protect middleware, since we're not using JWT for authentication anymore
router.post('/:id/reviews', async (req, res) => {
  const { rating, comment, userId, name } = req.body;

  // Check if the required fields are present
  if (!rating || !comment || !userId || !name) {
    return res.status(400).json({ message: "Rating, comment, user info are required" });
  }

  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new review object
    const newReview = {
      rating,
      comment,
      userId,
      name,
    };

    // Push the new review to the product's reviews array
    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => review.rating + acc, 0) /
      product.reviews.length;

    // Save the updated product
    await product.save();

    // Return the new review in the response
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding review" });
  }
});



module.exports = router;

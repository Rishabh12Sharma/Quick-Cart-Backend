const express = require("express");
const { check, validationResult } = require("express-validator");
const Review = require("../models/Review");
const User = require("../models/User"); // if you need user validation

const router = express.Router();

// Add a review
router.post(
  "/add",
  [
    check("productId", "Product ID is required").not().isEmpty(),
    check("rating", "Rating should be between 1 and 5").isInt({ min: 1, max: 5 }),
    check("comment", "Comment is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // Assuming you have a middleware for user authentication

    try {
      const newReview = new Review({
        userId,
        productId,
        rating,
        comment,
      });

      await newReview.save();
      res.status(201).json(newReview);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Edit a review (Only the review's creator can edit it)
router.put("/edit/:reviewId", async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.id; // Assuming you're using JWT authentication

  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ msg: "You can only edit your own review" });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;

    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

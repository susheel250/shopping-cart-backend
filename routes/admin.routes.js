const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getUsers,
  getOrders,
  updateOrderStatus,
  getProducts,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getDeletedProducts
} = require("../controllers/admin.controller");

const { verifyToken } = require("../middleware/auth.middleware");

const { adminMiddleware } = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/dashboard", verifyToken, adminMiddleware, getDashboard);

router.get("/users", verifyToken, adminMiddleware, getUsers);

router.get("/orders", verifyToken, adminMiddleware, getOrders);

router.put(
  "/orders/:id/status",
  verifyToken,
  adminMiddleware,
  updateOrderStatus,
);

router.get("/products", verifyToken, adminMiddleware, getProducts);

router.put("/products/:id", verifyToken, adminMiddleware,upload.single("image"), updateProduct);

router.delete("/products/:id", verifyToken, adminMiddleware, deleteProduct);

router.get("/products/deleted", verifyToken, adminMiddleware, getDeletedProducts);

router.post("/products/:id/restore", verifyToken, adminMiddleware, restoreProduct);

module.exports = router;

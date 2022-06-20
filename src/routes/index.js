const express = require("express");

const router = express.Router();

const {
    register,
    login,
    checkAuth,
    
  } = require("../controllers/auth.js");
  const {
    addProduct,
    getAllProducts,
    getProduct,
    // updateProduct,
    deleteProduct,
  } = require("../controllers/product");

  const {
    addTransaction, 
    getTransaction,
    getAllTransactions,
    deleteTransaction,
    notification,
    updateProduct,
    updateTrans
  } = require("../controllers/transaction");
  const { getProfile, updateProfile } = require("../controllers/profile");
  const {
    getCart,
    addCart,
    deleteCart,
    updateCart,
  } = require("../controllers/cart");

    const { auth } = require("../middlewares/auth");
    const { uploadFile } = require("../middlewares/uploadFile");


router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);
// router.get("/users", getUsers);
// router.delete("/user/:id", deleteUser);

router.post("/product", auth, uploadFile("image"), addProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", auth, getProduct);
// router.patch("/product/:id", auth, uploadFile("image"), updateProduct);
router.delete("/product/:id", auth, deleteProduct);

router.get("/profile", auth, getProfile);
router.patch("/profile/:id", auth, uploadFile("image"), updateProfile);

router.post("/cart", auth, addCart);
router.get("/cart", auth, getCart);
router.patch("/cart/:id", auth, updateCart);
router.delete("/cart/:id", auth, deleteCart);

router.post("/transaction", auth, addTransaction);
// router.post("/transaction", auth, addTransactionCart);
router.get("/transaction", auth, getTransaction);
router.get("/transactions",auth, getAllTransactions);
router.delete("/transaction/:id", auth, deleteTransaction);
router.post("/notification", notification);
router.post("/update-product", updateProduct);
router.patch("/transaction/:id", auth, updateTrans);



module.exports = router;
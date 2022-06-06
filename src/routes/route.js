const express = require('express')
const router = express.Router();

//==========================================Importing Controllers =============================================


const userController = require("../controllers/userController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
const productController = require("../controllers/product Controller")
const authenMW = require('../middlewares/authentications')
const author = require('../middlewares/authorisation')



//==============================================USER-FEATURE-1================================================

router.post("/register", userController.createUser)
router.post("/login", userController.userLogin)
router.get("/get/user/:userId", authenMW.authentication, userController.getUserProfileByID)
router.put("/user/:userId/profile", authenMW.authentication, userController.updateUserProfileByID)

//===========================================PRODDUCT-FEATURE-2=================================================

// router.post("/products", productController.createProduct)
// router.get("/products/:productId", productController.getProductByID)
// router.delete("/products/:productId", productController.deleteProductById)
// router.get("/products", productController.getproduct)
// router.put("/products/:productId", productController.updateProduct)

// //============================================CART-FEATURE-3=========================================================

// router.post("/users/:userId/cart", middleware.authen, cartController.createCartByUserID)
// router.put("/users/:userId/cart", middleware.authen, cartController.updateCart)
// router.get("/users/:userId/cart", middleware.authen, cartController.getCartByUserID)
// router.delete("/users/:userId/cart", middleware.authen, cartController.deleteCart)


// //=============================================OREDER-FEATURE-4=========================================================

// router.post("/users/:userId/orders", middleware.authen, orderController.createOrder)
// router.put("/users/:userId/orders", middleware.authen, orderController.updateOrders)







module.exports = router
/*Middleware functions are functions which have access to both request and response object and the next middleware
 function in the application’s request-response cycle…

 // a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})


*/




const express = require('express')
const router = express.Router(); // syntax for router level middleware

//==========================================Importing Controllers =============================================


const userController = require("../controllers/userController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
const productController = require("../controllers/product Controller")


//===========================================Importing Middlewares =============================================

const  {authentication}  = require('../middlewares/authentications')
const  {authorization}  = require('../middlewares/authorisation')



//==============================================USER-FEATURE-1================================================

router.post("/register", userController.createUser) 
router.post("/login", userController.userLogin)
router.get("/get/user/:userId", authentication, userController.getUserProfileByID)
router.put("/user/:userId/profile", authentication,authorization, userController.updateUserProfileByID)

//===========================================PRODDUCT-FEATURE-2=================================================

router.post("/products", productController.createProduct)
router.get("/products/:productId", productController.getProductByID)
router.delete("/products/:productId", productController.deleteProductById)
router.get("/products", productController.getproduct)
router.put("/products/:productId", productController.updateProduct)

 //============================================CART-FEATURE-3=========================================================

router.post("/users/:userId/cart", authentication,authorization, cartController.createCartByUserID)
router.put("/users/:userId/cart", authentication,authorization, cartController.updateCart)
router.get("/users/:userId/cart", authentication,authorization, cartController.getCartByUserID)
router.delete("/users/:userId/cart", authentication,authorization, cartController.deleteCart)


//=============================================OREDER-FEATURE-4=========================================================

router.post("/users/:userId/orders", authentication,authorization, orderController.createOrder)
router.put("/users/:userId/orders", authentication,authorization, orderController.updateOrders)







module.exports = router
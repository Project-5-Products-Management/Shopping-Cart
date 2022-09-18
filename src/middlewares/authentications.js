
/*Express is a routing and middleware web framework that has minimal functionality of its own:
 An Express application is essentially a series of middleware function calls.

Middleware functions are functions that have access to the request object (req), the response object (res),
 and the ( next) middleware function in the application’s request-response cycle. The next middleware function 
 is commonly denoted by a variable named next. */

/*Bind application-level middleware to an instance of the app object by using the app.use() and app.METHOD() functions,
 where METHOD is the HTTP method of the request that the middleware function handles (such as GET, PUT, or POST) 
 in lowercase.

This example shows a middleware function with no mount path. The function is executed every time the app receives
 a request.e.g,
 
const express = require('express')
const app = express()
 
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
*/

const jwt = require('jsonwebtoken')
const secretKey = "Project-5-Group-29"

let decodeToken = function (token) {

    //jwt.verify(token, secretOrPublicKey, [options, callback])

    return jwt.verify(token, secretKey, function (err, data) {
        if (err)
            return null
        else
            return data
    })
}

const authentication = function (req, res, next) {
    try {
        let bearerToken = req.headers.authorization

        if (!bearerToken) return res.status(400).send({ status: false, message: "Token must be present" })

        token = bearerToken.split(' ')[1]

        let verifyToken = decodeToken(token)

        if (!verifyToken)

            return res.status(401).send({ status: false, message: "Either token is Invalid or Expired !......." })


        req.decodedToken = verifyToken

        next()

    } catch (err) {

        return res.status(500).send({ error: err.message })
    }
}

module.exports = { authentication }
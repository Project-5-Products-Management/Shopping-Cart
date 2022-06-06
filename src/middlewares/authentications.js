const jwt = require("jsonwebtoken")



const authentication = async (req, res, next) => {
    try {
        let bearer = req.headers.authorization;

        if (typeof bearer == "undefined") return res.status(400).send({ status: false, message: "Token is missing, please enter a token" });

        let bearerToken = bearer.split(' ');
        let token = bearerToken[1]
        let decodeToken = jwt.verify(token, "Project-5-Group-29")
        if (decodeToken)  { 
            req.userId = decodeToken._id
        } else {
            return res.status(400).send({ status: false, message: " unauthorised access " })
        }

        next()

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { authentication }
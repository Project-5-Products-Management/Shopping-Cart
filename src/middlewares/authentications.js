const jwt = require("jsonwebtoken")



const authentication = async (req, res, next) => {
    try {
        let token = req.headers["token-api-key"]
        
        if (!token) return res.status(400).send({ status: false, message: " Token must be present" })

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
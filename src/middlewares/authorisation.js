const jwt = require('jsonwebtoken')

const authorisatin = async (req, res, next) => {
    try {
        let token = req.headers["token-api-key"]
        //res.setHeaders["token-api-key"]
        if (!token) return res.status(400).json({ status: false, message: "Token Must be Present" })
        let decodeToken = jwt.verify(token, "Project-5-Group-29")
        let extractedId = decodeToken._id
        let userId = req.params
        if (!extractedId == userId) return res.status(400).json({ status: false, message: "you are not authorised " })
        let expiredToken = decodeToken.expiredToken
        let timesNow = Math.floor(Date.now()/1000)
        if(expiredToken <= timesNow ) return res.status(400).json({ status: false, message: "token has been expired , please re-login " })
        next()



    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.authorisatin = authorisatin
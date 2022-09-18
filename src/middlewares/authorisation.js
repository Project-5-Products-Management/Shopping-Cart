const { isValidObjectId } = require("mongoose")


const authorization = function (req, res, next) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "userId is not valid.... Please enter valid user id" })

        if (userId !== req.decodedToken.userId)
            return res.status(400).send({ status: false, message: "Unauthorized Access!!" })

        next()

    } catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

module.exports = { authorization }
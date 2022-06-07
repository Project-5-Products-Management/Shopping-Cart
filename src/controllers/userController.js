const { set, isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");
const validators = require("../validators/validator")
const bcrypt = require('bcrypt')
const jwt = require('JsonWebToken');
const aws = require('../aws')


//=====================================User Post API ====================================================

const createUser = async (req, res) => {

    try {
        let userData = req.body;
        let { fname, lname, email, profileImage, phone, password } = userData;

        let address = JSON.parse(req.body.address)

        //checking requested Body
        if (!validators.isValidReqBody(req.body)) return res.status(400).send({ status: false, message: ` invalid body Parameters requested--<br> user detail is required ?` })
        //checking first name in request Body  and should not contain blank spaces
        if (!fname || !validators.isValidValue(fname)) return res.status(400).send({ status: false, message: "fname is required" })
        //first name should not contain Numbers and Symbols
        if (!validators.isValidName(fname)) return res.status(400).send({ status: false, message: `${fname} is not valid fname` })
        //checking last name in request Body  and should not contain blank spaces
        if (!lname || !validators.isValidValue(lname)) return res.status(400).send({ status: false, message: " lname is required" })
        //last name should not contain Numbers and Symbols
        if (!validators.isValidName(lname)) return res.status(400).send({ status: false, message: `${lname} is not valid lname` })
        //checking email is present in req.body or not
        if (!email) return res.status(400).send({ status: false, message: " email is required" })
        // checking the requested email by user is valid or not
        if (!validators.isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })
        //checking existance of email requested by user i.e. email is already exists in database or not
        let dupEmail = await userModel.findOne({ email: email })
        if (dupEmail) {
            return res.status(409).send({ status: false, message: `user with email : ${email} , already exists` })
        }
        //checking profile image  is provided by user or not
        const pImg = req.files
        if (!pImg) return res.status(400).send({ status: false, Message: " profile image is required" })

        //checking profile image link is valid or not
        if (!validators.isValidImg(profileImage)) return res.status(400).send({ status: false, message: `${profileImage} is not valid aws s3 link` })
        //checking Phone number is provided by user or not
        if (!phone) return res.status(400).send({ status: false, message: " Phone number is required" })

        //checking Phone number is valid indian or not
        if (!validators.isvalidIndian(phone)) return res.status(400).send({ status: false, message: `${phone} is not valid Indian  mobile Number` })

        //finding phone number provided by user is present mongoDB collection or not?
        let dupPhone = await userModel.findOne({ phone: phone })
        //if phone number is present in database then it shows as following
        if (dupPhone) { return res.status(409).send({ status: false, message: `user with this phone ${phone} number already exists` }) }
        // checking password is provided by user or not?
        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        // checking password and its lenght
        if (!validators.isValidPL(password)) return res.status(400).send({ status: false, message: " password must be between 8-15 charactor long" })

        // generating salt to hash password
        let salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        // checking street address is provide by user and it should not contain blank spaces without character
        if (address) {
            if (address.shipping) {
                if (!validators.isValidValue(address.shipping.street)) return res.status(400).send({ status: false, message: "shipping street is required" })
                // checking city is provided by user or not?
                if (!address.shipping.city || !validators.isValidValue(address.shipping.city)) return res.status(400).send({ status: false, message: "shipping city is required" })

                //checking city should not contain any numerals
                if (!validators.isValidCity(address.shipping.city)) return res.status(400).send({ status: false, message: `${address.shipping.city} is not valid city` })
                // checking pincode is provided by user or not?
                if (!address.shipping.pincode || address.shipping.pincode == " ") return res.status(400).send({ status: false, message: "shipping pincode is required" })
                //checking pin code is valid or not?
                if (!validators.isValidPin(address.shipping.pincode)) return res.status(400).send({ status: false, message: `${address.shipping.pincode} is not valid 6 digit pincode` })
            } if (address.billing) {
                // checking street address is provide by user and it should not contain blank spaces without character
                if (!address.billing.street || !validators.isValidValue(address.billing.street)) return res.status(400).send({ status: false, message: "billing street is required" })

                // checking city is provided by user or not?
                if (!address.billing.city || !validators.isValidValue(address.billing.city)) return res.status(400).send({ status: false, message: "billing city is required" })

                //checking city should not contain any numerals
                if (!validators.isValidCity(address.billing.city)) return res.status(400).send({ status: false, message: `${address.billing.city} is not valid city` })

                // checking pincode is provided by user or not?
                if (!address.billing.pincode || address.billing.pincode == " ") return res.status(400).send({ status: false, message: "billing pincode is required" })

                //checking pin code is valid or not?
                if (!validators.isValidPin(address.billing.pincode)) return res.status(400).send({ status: false, message: `${address.billing.pincode} is not valid 6 digit pincode` })
            }
        }
        const profilePicture = await aws.uploadFile(pImg[0])
        userData = {
            fname: fname,
            lname: lname,
            profileImage: profilePicture,
            email: email,
            phone: phone,
            password: password,
            address: address,

        }

        //registering user with user detail
        let createdUser = await userModel.create(userData)
        // sending success response to response to response body (user)
        return res.status(201).send({ status: true, message: createdUser })

        //catch function is catching exicution errors
    } catch (error) {
        //sneding exicution  errors to server
        res.status(500).send({ status: false, message: error.message })
    }
}

//==================================Login API ==============================================

const userLogin = async (req, res) => {
    try {
        // recieving login detail by user
        const loginDetail = req.body;

        // assigning keys to login detail
        const { email, password } = loginDetail;

        //checking login detail is provided by user or not?
        if (!validators.isValidReqBody(loginDetail)) return res.status(400).send({ status: false, message: "user detail is required to login" })

        //checking email is provided by user or not? , and it should not contain blank spaces
        if (!email || !validators.isValidValue(email)) return res.status(400).send({ status: false, message: " email is required to login" })

        //checking email entered by user is Valid or not?
        if (!validators.isValidEmail(email)) return res.status(400).send({ status: false, message: `this email=> ${email} is not valid` })

        // checking user is registered with us or not?
        const findEmail = await userModel.findOne({ email: email })
        if (!findEmail) return res.status(400).send({ status: false, message: `this ${email} is not registered with us , you need to register first` })

        //checking ---is password entered by user or not?
        if (!password || !validators.isValidValue(password)) return res.status(400).send({ status: false, message: " password is required" })

        //checkin-- is password valid or not
        if (!validators.isValidPL(password)) return res.status(400).send({ status: false, message: " provide valid password lenght between 8-15 character long" })



        // finding user with user detail

        const findUser = await userModel.findOne({ email: email })

        const dcryptPassword = await bcrypt.compare(password, findUser.password)
        if (!dcryptPassword) {
            return res.status(400).send({ status: false, message: "Password is incorrect" })
        }



        //logging user with above detail
        const payLoad = { userId: findUser._id.toString(), iat: Date.now() }
        const secretKey = "Project-5-Group-29"
        const options = { expiresIn: "24h" }
        const logging = jwt.sign(payLoad, secretKey, options)

        //sending token to headers
        res.setHeader("x-api-key", logging)

        // sending logging in success response
        return res.status(201).send({ status: true, message: " user logged in successfully", data: findUser._id, token: logging })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//============================= Get user API with userId in Params and Authentication =======================================
const getUserProfileByID = async (req, res) => {
    try {
        let userId = req.params.userId
        //if(!req.params) return res.status(400).send({status : false, message :" user ID is required"})
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Object id is not valid" })
        const getUser = await userModel.findById({ _id: userId })
        if (!getUser) return res.status(404).send({ status: false, message: `No user found with this ID : ${userId}` })
        return res.status(201).send({ status: false, message: getUser })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//==================================================Update User API =============================================

const updateUserProfileByID = async (req, res) => {
    try {
        let updateDetail = req.body
        // destructuring user data
        let { fname, lname, email, profileImage, phone, password, address } = updateDetail

        // fixing unexpected token u at position 0 for address 
        if (address != null) { address = JSON.parse(address) }

        const userID = req.params.userId
        // checking input provided by user or not?
        if (!updateDetail) return res.status(400).send({ status: false, message: "updat detail required to update" })

        // checking user id provided by user or not?
        if (userID === undefined) return res.status(400).send({ status: false, message: "User ID is required" })

        // validating user id
        if (!isValidObjectId(userID)) return res.status(400).send({ status: false, message: "user ID is not Valid" })

        // checking user exists in db or not?
        const findUserProfile = await userModel.findById(userID)
        if (!findUserProfile) return res.status(404).send({ status: false, message: "user ID not found " })

        // checking valid password entered by user or not?
        if (password !== null) {
            if (validators.isValidPL(password)) return res.status(404).send({ status: false, message: "password is not valid " })
            let salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(password, salt)
        }
        // updating profile pic
        if (profileImage !== null) {
            let pImg = req.files
            profileImage = await aws.uploadFile(pImg[0])
        }


        // checking street address is provide by user and it should not contain blank spaces without character
        if (address) {
            if (!address.shipping.street || !validators.isValidValue(address.shipping.street)) return res.status(400).send({ status: false, message: "shipping street is required" })

            // checking city is provided by user or not?
            if (!address.shipping.city || !validators.isValidValue(address.shipping.city)) return res.status(400).send({ status: false, message: "shipping city is required" })

            //checking city should not contain any numerals
            if (!validators.isValidCity(address.shipping.city)) return res.status(400).send({ status: false, message: `${address.shipping.city} is not valid city` })

            // checking pincode is provided by user or not?
            if (!address.shipping.pincode || address.shipping.pincode == " ") return res.status(400).send({ status: false, message: "shipping pincode is required" })

            //checking pin code is valid or not?
            if (!validators.isValidPin(address.shipping.pincode)) return res.status(400).send({ status: false, message: `${address.shipping.pincode} is not valid 6 digit pincode` })

            // checking street address is provide by user and it should not contain blank spaces without character
            if (!address.billing.street || !validators.isValidValue(address.billing.street)) return res.status(400).send({ status: false, message: "billing street is required" })

            // checking city is provided by user or not?
            if (!address.billing.city || !validators.isValidValue(address.billing.city)) return res.status(400).send({ status: false, message: "billing city is required" })

            //checking city should not contain any numerals
            if (!validators.isValidCity(address.billing.city)) return res.status(400).send({ status: false, message: `${address.billing.city} is not valid city` })

            // checking pincode is provided by user or not?
            if (!address.billing.pincode || address.billing.pincode == " ") return res.status(400).send({ status: false, message: "billing pincode is required" })

            //checking pin code is valid or not?
            if (!validators.isValidPin(address.billing.pincode)) return res.status(400).send({ status: false, message: `${address.billing.pincode} is not valid 6 digit pincode` })
        }

        // updating user data

        const updateProfile = await userModel.findByIdAndUpdate({ _id: userID }, {
            fname: fname, lname: lname, email: email,
            profileImage: profileImage, phone: phone, password: password, address: address
        }, { new: true })

        res.status(200).json({ status: true, message: updateProfile })

        // sending exicution errors to  catch
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}
// making following keys as public so we can use it in any folder
module.exports = { createUser, userLogin, getUserProfileByID, updateUserProfileByID }
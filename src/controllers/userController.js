const userModel = require("../models/userModel");

const createUser = async(req,res) =>{

    try {
        let userData = req.body;
        let { fname, lname, email ,profileImage , phone , password , address } = userData;
        if(!fname || fname ==" " ) return res.status(400).send({ status : false, message : "fname is required"})
        if(!/^[A-Za-z\s]+$/.test(fname)) return res.status(400).send({ status : false, message : `${fname} is not valid fname`})
        if(!lname || lname == " ") return res.status(400).send({ status: false , message : " lname is required"})
        if(!/^[A-Za-z\s]+$/.test(lname)) return res.status(400).send({ status: false, message : `${lname} is not valid lname`})

        if(!email) return res.status(400).send({ status: false , message: " email is required"})
        if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email))
        return res.status(400).send({ status : false , message: `${email} is not a valid email`})
        let dupEmail = await userModel.findOne({email:email})
        if(dupEmail){
        return    res.status(409).send({status: false, message: `user with email : ${email} , already exists`})
        }
        if(!profileImage) return res.status(400).send({ status : false, Message : " profile image link is required"})
        if(!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(profileImage))
        return res.status(400).send({ status : false , message : `${profileImage} is not valid aws s3 link`})

        if(!phone) return res.status(400).send({ status : false, message: " Phone number is required"})
        if(!/^[6-9]{1}[0-9]{9}$/.test(phone)) return res.status(400).send({ status : false , message : `${phone} is not valid Indian  mobile Number`})
        let dupPhone = await userModel.findOne({phone:phone})
        if(dupPhone){ return res.status(409).send({status: false, message : `user with this phone ${phone} number already exists`})}
        if(!password) return res.status(400).send({ status : false , message : "password is required"})
        if (!/^([a-zA-Z0-9!@#$%^&*_\-+=><]{8,15})$/.test(password)) return res.status(400).send({ status : false , message : " password must be between 8-15 charactor long"})
        
        if(!address.shipping.street || address.shipping.street ==" " ) return res.status(400).send({ status:false, message: "shipping street is required"})
        if(!address.shipping.city || address.shipping.city ==" " ) return res.status(400).send({ status:false, message: "shipping city is required"})
        if(!/^[A-Za-z\s]+$/.test(address.shipping.city)) return res.status(400).send({status : false, message : `${address.shipping.city} is not valid city`})
        if(!address.shipping.pincode || address.shipping.pincode ==" " ) return res.status(400).send({ status:false, message: "shipping pincode is required"})
        if(!/^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(address.shipping.pincode)) return res.status(400).send({ status: false, message: `${address.shipping.pincode} is not valid 6 digit pincode`})


        if(!address.billing.street || address.billing.street ==" " ) return res.status(400).send({ status:false, message: "billing street is required"})
        if(!address.billing.city || address.billing.city ==" " ) return res.status(400).send({ status:false, message: "billing city is required"})
        if(!/^[A-Za-z\s]+$/.test(address.billing.city)) return res.status(400).send({status : false, message : `${address.billing.city} is not valid city`})
        if(!address.billing.pincode || address.billing.pincode ==" " ) return res.status(400).send({ status:false, message: "billing pincode is required"})
        if(!/^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(address.billing.pincode)) return res.status(400).send({ status: false, message: `${address.billing.pincode} is not valid 6 digit pincode`})

        
        
        
        let createdUser = await userModel.create(userData)
        //if(createdUser){ return res.status(409).send({status : false , message : " user already exists ..."})}
        return res.status(201).send({ status : true , message : createdUser})
    } catch (error) {
        res.status(500).send({ status : false , message : error.message})
    }
}
 module.exports.createUser = createUser
const mongoose = require("mongoose")


// Validation of request Body
const isValidReqBody = (reqBody) => {
    return Object.keys(reqBody).length > 0

}

// validating types of values`

const isValidValue = (value) => {
    if (typeof value == " " || typeof value == null) return false
    if (typeof value == 'String' || value.trim().length == 0) return false
    if (typeof value === 'Number' || value.toString().trim().length === 0) return false
    return true
}

// validation of Names -- name do not contain Numbers and symbols
const isValidName = (name) => {
    const nameformat = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/g     //      /^[A-Za-z\s]+$/

    if (nameformat.test(name)) { return true } else { return false }

}

// email validation

const isValidEmail = (email) => {
    const emailFormat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/g
    if (emailFormat.test(email)) {
        return true
    } else {
        return false
    }
}
// Validation of Profile Image with File type

const isValidUrlImg = (url) => {
    const urlFormatWithImageType = /(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|gif)/i
    if (urlFormatWithImageType.test(url)) {
        return true
    } else {
        return false
    }
}

// validation of indian Phone numbers
const isvalidIndian = (mobileNumber) => {
    const mobilenumberFormat = /^(\+91)?0?[6-9]\d{9}$/
    if (mobilenumberFormat.test(mobileNumber)) {
        return true
    } else {
        return false
    }
}
// Validation Of password and its lenght
const isValidPL = (password) => {
    const passwordFormat = /^([a-zA-Z0-9!@#$%^&*_\-+=><]{8,15})$/
    if (passwordFormat.test(password)) {
        return true
    } else {
        return false
    }
}

// Validation of Name of City
const isValidCity = (City) => {
    const CityNameFormat = /^[A-Za-z\s]+$/
    if (CityNameFormat.test(City)) {
        return true
    } else {
        return false
    }
}
// Validation of indian Pincode
const isValidPin = (pincode) => {
    const pincodeFormat = /^[1-9]{1}[0-9]{2}[0-9]{3}$/
    if (pincodeFormat.test(pincode)) {
        return true
    } else {
        return false
    }
}



module.exports = {
    isValidName, isValidValue, isValidReqBody, isValidEmail, isValidUrlImg, isvalidIndian, isValidPL, isValidCity,
    isValidPin 
}
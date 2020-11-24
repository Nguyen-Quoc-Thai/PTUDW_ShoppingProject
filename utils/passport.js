const User = require('./../models/user.model')

module.exports.findUserByEmail = (email) => {
    return User.findOne({email})
}

module.exports.findUserById = (id) => {
    return User.findById(id)
}zzz
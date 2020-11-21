const mongoose = require('mongoose')

const enumUser = {
    values: ['user', 'admin'],
    message: `Roles must be 'user' or 'admin'!`
}

const enumStatus = {
    values: ['active', 'block'],
    message: `Status must be 'active' or 'block'!`
}

const userScheme = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required!']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!']
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email!']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required!'],
        unique: true,
        match: [/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Invalid phone number!']
    },
    roles: {
        type: String,
        enum: enumUser,
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: enumStatus,
        default: 'active'
    },
    cash: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    like: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    passwordResetToken: {
        type: String,
        default: 'randomStringHere'
    },
    passwordResetExpires: {
        type: Date,
        default: Date.now(),
    },
    slugName: {
        type: String
    }
})

userScheme.path('phone').validate(async (value) => {
    const phoneCount = await mongoose.models.User.countDocuments({phone: value })
    return !phoneCount

}, 'Phone number is already exists!')

userScheme.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.User.countDocuments({email: value })
    return !emailCount

}, 'Email is already exists!')

// Add plugins
userScheme.set('timestamps', true)
module.exports = mongoose.model('User', userScheme)


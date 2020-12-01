const mongoose = require('mongoose')

const enumStatus = {
    values: ['waiting', 'confirmed', 'transferring', 'delivered', 'canceled'],
    message: `Status must be 'waiting', 'confirmed', 'transferring', 'delivered' or 'canceled'!`
}

const enumPaymentMethod = {
    values: ['cod', 'paypal', 'banking'],
    message: `Status must be 'cod', 'paypal' or 'banking'!`
}

const checkoutSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    cartId: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart'
    },
    status: {
        type: String,
        enum: enumStatus,
        default: 'waiting'
    },
    receiver: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        enum: enumPaymentMethod,
        default: 'cod'
    },
    items: [
        {
            type: Array,
            default: []
        }
    ],
        // {itemId, name, price, quantity}
    totalQuantity: {
        type: Number,
        default: 0
    },
    totalCost: {
        type: Number,
        default: 0
    },
    shippingFee: {
        type: Number,
        default: 3
    },
    totalPayment: {
        type: Number,
        required: [true, 'Total payment is required!']
    }
})

// Add plugins
checkoutSchema.set('timestamps', true)

module.exports = mongoose.model('Checkout', checkoutSchema)

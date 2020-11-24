const mongoose = require('mongoose')

const enumStatus = {
    values: ['waiting', 'staging', 'paid'],
    message: `Status must be 'waiting', 'staging' or 'paid'!`
}

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: enumStatus,
        default: 'waiting'
    },
    items: [
        {
            type: Array,
            default: []
        }
    ],
        // {itemId, name, thumbnail, price, quantity}
    totalQuantity: {
        type: Number,
        default: 0
    },
    totalCost: {
        type: Number,
        default: 0
    }
})

// Add plugins
cartSchema.set('timestamps', true)

module.exports = mongoose.model('Cart', cartSchema)


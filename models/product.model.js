const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

const enumType = {
    values: ['computer', 'laptop', 'mobile'],
    message: `Product type must be 'computer', 'laptop' or 'mobile'!`
}

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!']
    },
    slugName: {
        type: String,
        slug: 'name'
    },
    rating: {
        type: Number,
        default: 5
    },
    price: {
        type: Number,
        required: [true, 'Price is required!']
    },
    oldPrice: {
        type: String,
        slug: 'price'
    },
    type: {
        type: String,
        enum: enumType,
        required: [true, 'Type is required!']
    },
    images: {
        type: Array,
        default: []
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required!']
    },
    tags: {
        type: Array,
        default: []
    },
    producer: {
        type: String,
        required: [true, 'Producer is required!']
    },
    video: {
        type: String,
        default: ''
    },
    countView: {
        type: Number,
        default: 0
    },
    countLike: {
        type: Number,
        default: 0
    },
    countRating: {
        type: Number,
        default: 0
    },
    countSale: {
        type: Number,
        default: 0
    },
    details: [
        {
            model: {
                type: String,
                default: ''
            },
            cpu: {
                type: String,
                default: ''
            },
            ram: {
                type: Number,
                default: 0
            },
            slotRam: {
                type: Number,
                default: 0
            },
            disk: {
                type: String,
                default: ''
            },
            vga: {
                type: String,
                default: ''
            },
            network: {
                type: String,
                default: ''
            },
            os: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: ''
            },
            weight: {
                type: Number,
                default: 0
            },
            mainboard: {
                type: String,
                default: ''
            },
            warranty: {
                type: Number,
                default: 0
            },
            screen: {
                type: String,
                default: ''
            },
        }
    ],
    descriptions: {
        type: Object,
        default: {}
    },
    comments:{
        type: Array,
        default: []
    }
    // } [
    //     {
    //         userId: {
    //             type: mongoose.Types.ObjectId,
    //             ref: 'User'
    //         },
    //         name: {
    //             type: String,
    //             default: 'Anonymous'
    //         },
    //         content: {
    //             type: String,
    //             default: 'No content'
    //         },
    //         rating: {
    //             type: Number,
    //             default: 5
    //         },
    //         date: {
    //             type: Date,
    //             default: new Date()
    //         },
    //     }
    // ]
})

// Add plugins
productSchema.set('timestamps', true)
mongoose.plugin(slug)

module.exports = mongoose.model('Product', productSchema)


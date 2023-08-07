const mongoose = require('mongoose')
const TypeEnum = require('../../helper/enum_types')
const orderSchema = mongoose.Schema({

    order_number: {
        type: String,
        required: true,
    },
    customer: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    message_status: {
        type: String,
        // enum: ['Sent', 'Pending', 'Cancelled']
        enum: Object.values(TypeEnum.OrderMessageTypeEnum)
    },
    order_status: {
        type: String,
        enum: Object.values(TypeEnum.OrderStatusTypeEnum)
    },
    payment_status: {
        type: String,
        // enum: ['Paid', 'Refund','Pending','Unpaid', 'Authorized', 'Expired', 'Completed']
        enum: Object.values(TypeEnum.OrderPaymentTypeEnum)
    },
    delivery_date: {
        type: Date,
    },
    amount: {
        type: Number,
    },
    customer_number: {
        type: String,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user'
    },
    isActive: {
        type: Number,
        default: 1
    }
},{timestamps: true})

module.exports = mongoose.model('orders', orderSchema);

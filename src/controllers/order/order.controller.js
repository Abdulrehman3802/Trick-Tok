const Order = require('../../models/order/order.model')
const TypeEnum = require('../../helper/enum_types')
const mongoose = require("mongoose");

module.exports.createOrder = async (req, res, next) => {
    console.log('im here ---------------- in creating order')
    try {
        const id = req.user_id
        const {message_status, order_status, payment_status} = req.body

        if (
            Object.values(TypeEnum.OrderMessageTypeEnum).includes(message_status)
            && Object.values(TypeEnum.OrderStatusTypeEnum).includes(order_status)
            && Object.values(TypeEnum.OrderPaymentTypeEnum).includes(payment_status)) {
            const randomText = Math.floor(Math.random() * 999999) + 100000;
            const order = await Order.create({
                ...req.body,
                createdBy: id,
                order_number: randomText
            })
            if (order) {
                return res.status(201).json({
                    message: 'Order Created Successfully',
                    data: order
                })
            } else {
                return res.status(404).json({
                    message: 'Failed to Create',
                    data: null
                })
            }
        } else {
            return res.status(404).json({
                message: 'Failed to create order because of invalid enum type',
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred",
            data: e
        })
    }
}

module.exports.getAllOrdersWithFilters = async (req, res, next) => {
    try {
        const id = req.user_id
        // console.log(id)
        const letter = req.body?.letter
        const page = req.body?.page || 1
        const limit = req.body?.limit || 10
        const message_status = req.body?.messagefilter
        const order_status = req.body?.orderfilter
        const payment_status = req.body?.paymentfilter
        const starting = req.body?.startDate
        const ending = req.body?.endDate

        let startDate;
        let endDate
        if (starting && ending) {
            startDate = new Date(starting);
            endDate = new Date(ending);
        }

        const skip = page * limit - limit
        let query = {}

        if (message_status && message_status.length > 0) query.message_status = message_status
        if (order_status && order_status.length > 0) query.order_status = order_status
        if (payment_status && payment_status.length > 0) query.payment_status = payment_status

        if (letter) {
            query.customer = letter
        }

        if (startDate && endDate) {
            query.date = {$gte: startDate}
            query.delivery_date = {$lte: endDate}
        }
        // console.log(query)
        const totalOrders = await Order.find({createdBy: id, isActive: 1})
        const paidOrders = await Order.find({createdBy: id, isActive: 1, payment_status: 'Paid'})
        const orders = await Order.find({
            ...(query.message_status && {message_status: query.message_status}),
            ...(query.order_status && {order_status: query.order_status}),
            ...(query.payment_status && {payment_status: query.payment_status}),
            ...(query.startDate && {date: {$gte: startDate}}),
            ...(query.endDate && {delivery_date: {$lte: endDate}}),
            ...(query.customer && {customer: {"$regex": letter, "$options": "i"}}),
            isActive: 1,
            createdBy: id
        }).skip(skip).limit(limit)

        if (orders) {
            return res.status(200).json({
                message: 'Success: List of Orders is',
                allOrders: totalOrders?.length,
                paidOrders: paidOrders?.length,
                count: orders?.length,
                data: orders
            })
        } else {
            return res.status(404).json({
                message: 'Orders not found',
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.getAllOrdersWithPipeline = async (req, res, next) => {

    try {
        // Extracting data from the request
        const {user_id} = req;
        const {
            letter,
            page = 1,
            limit = 10,
            messagefilter,
            orderfilter,
            paymentfilter,
            startDate,
            endDate,
            sorting
        } = req.body;

        // Setting up the date range
        let start, end;
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        }

        // Setting up the pagination
        const skip = page * limit - limit;

        // Setting up the pipeline
        let pipepline = [
            {
                $match: {
                    isActive: 1,
                    createdBy: mongoose.Types.ObjectId(user_id)
                }
            }
        ];

        // Pushing order filter to pipeline
        if (orderfilter && orderfilter.length>0) {
            pipepline.push({
                $match: {
                    order_status: {$in: orderfilter}
                }
            });
        }

        // Pushing message filter to pipeline
        if (messagefilter && messagefilter.length > 0) {
            pipepline.push({
                $match: {
                    message_status: {$in: messagefilter}
                }
            });
        }

        // Pushing payment filter to pipeline
        if (paymentfilter && paymentfilter.length > 0) {
            pipepline.push({
                $match: {
                    payment_status: {$in: paymentfilter}
                }
            });
        }

        // Pushing letter filter to pipeline
        if (letter) {
            pipepline.push({
                $match: {
                    customer: {$regex: letter}
                }
            });
        }


        // Pushing date range filter to pipeline
        if (start && end) {
            pipepline.push({
                $match: {
                    date: {$gte: start, $lte: end}
                }
            });
        }

        // Pushing sorting to pipeline
        if (sorting) {
            pipepline.push({$sort: sorting});
        }

        console.log(user_id)
        // Counting total orders
        const totalOrders = await Order.find({createdBy: user_id, isActive: 1});
        console.log(totalOrders)
        // Counting paid orders
        const paidOrders = await Order.find({createdBy: user_id, isActive: 1, payment_status: "Paid"});
        console.log(paidOrders)
        // console.log(pipepline)
        // Applying pipeline
        const orders = await Order.aggregate(pipepline).sort({_id: -1}).skip(skip).limit(limit)
        // console.log(orders)
        // Sending JSON response
        if (orders && orders.length > 0) {
            return res.status(200).json({
                message: "Success: List of Orders is",
                allOrders: totalOrders.length,
                paidOrders: paidOrders.length,
                count: orders.length,
                data: orders
            });
        } else {
            return res.status(200).json({
                message: "Orders not found",
                allOrders: totalOrders.length,
                paidOrders: paidOrders.length,
                count: orders.length,
                data: []
            });
        }
    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}


module.exports.viewOneOrder = async (req, res, next) => {
    try {
        const id = req.params.id
        const order = await Order.findOne({id, createdBy: req.user_id});

        if (order) {
            return res.status(200).json({
                message: 'Order found successfully',
                data: order
            })
        } else {
            return res.status(404).json({
                message: `No Order Found with id ${req.params.id}`,
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id
        const {message_status, order_status, payment_status} = req.body

        if (message_status) {
            if (!Object.values(TypeEnum.OrderMessageTypeEnum).includes(message_status)) {
                // error throw
                return res.status(404).json({
                    message: 'Failed to update order because of invalid enum type',
                    data: null
                })
            }
        }

        if (order_status) {
            if (!Object.values(TypeEnum.OrderStatusTypeEnum).includes(order_status)) {
                // error throw
                return res.status(404).json({
                    message: 'Failed to update order because of invalid enum type',
                    data: null
                })
            }
        }

        if (payment_status) {
            if (!Object.values(TypeEnum.OrderPaymentTypeEnum).includes(payment_status)) {
                // error throw
                return res.status(404).json({
                    message: 'Failed to update order because of invalid enum type',
                    data: null
                })
            }
        }
        const orderResponse = await Order.findByIdAndUpdate(id, {
            customer: req.body.customer,
            date: req.body.date,
            message_status: message_status,
            order_status: order_status,
            payment_status: payment_status,
            delivery_date: req.body.delivery_date,
            amount: req.body.amount,
            customer_number: req.body.customer_number
        }, {new: true})
        if (orderResponse) {
            return res.status(200).json({
                message: "Successfully Updated Successfully",
                data: orderResponse
            })
        } else {
            return res.status(404).json({
                message: `No Order Found with id ${req.body.id}`
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteOrder = await Order.findByIdAndUpdate(id, {isActive: 3}, {new: true})
        if (deleteOrder) {
            return res.status(200).json({
                message: 'Deleted Successfully',
                data: deleteOrder
            })
        } else {
            return res.status(404).json({
                message: `No Order Found with id ${req.params.id}`,
            })
        }
    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

// GetAllOrdersWithFilter performing all operations that is why it is not needed

// Pagination route (Every GET query will be paginated so this route is not to be used)
// module.exports.ordersPagination = async (req, res, next) => {
//     try {
//         const id = req.user_id
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//
//         const orders = await Order.find({createdBy: id, isActive: 1}).skip(skip).limit(limit)
//
//         if (orders) {
//             return res.status(200).json({
//                 message: 'Success: List of Orders is',
//                 count: orders?.length,
//                 data: orders
//             })
//         } else {
//             return res.status(404).json({
//                 message: 'Orders not found',
//                 data: null
//             })
//         }
//
//     } catch (e) {
//         console.log('Error ', e)
//         return res.status(501).json({
//             message: "Error Occurred"
//         })
//     }
// }

// module.exports.ordersNameSearch = async (req, res, next) => {
//     try {
//         const id = req.user_id
//         const letter = req.body.letter
//
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         // option "i" will make in case-insensitive
//         const orders = await Order.find({
//             createdBy: id,
//             isActive: 1,
//             "customer": {"$regex": letter, "$options": "i"}
//         }).skip(skip).limit(limit)
//
//         if (orders) {
//             return res.status(200).json({
//                 message: 'Success: List of Orders is',
//                 count: orders?.length,
//                 data: orders
//             })
//         } else {
//             return res.status(404).json({
//                 message: 'Orders not found',
//                 data: null
//             })
//         }
//
//     } catch (e) {
//         console.log('Error ', e)
//         return res.status(501).json({
//             message: "Error Occurred"
//         })
//     }
// }

// module.exports.allOrders = async (req, res, next) => {
//     try {
//         const id = req.user_id
//         // console.log(id)
//
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         const orders = await Order.find({isActive: 1, createdBy: id}).skip(skip).limit(limit)
//
//         if (orders) {
//             return res.status(200).json({
//                 message: 'Success: List of Orders is',
//                 count: orders?.length,
//                 data: orders
//             })
//         } else {
//             return res.status(404).json({
//                 message: 'Orders not found',
//                 data: null
//             })
//         }
//
//     } catch (e) {
//         console.log('Error ', e)
//         return res.status(501).json({
//             message: "Error Occurred"
//         })
//     }
// }

// module.exports.orderFilters = async (req, res, next) => {
//     try {
//         const id = req.user_id
//         // console.log(id)
//         const query1 = req.query?.messagefilter
//         const query2 = req.query?.orderfilter
//         const query3 = req.query?.paymentfilter
//         const starting = req.query?.startDate
//         const ending = req.query?.endDate
//         const page = req.query?.page
//         const limit = req.query?.limit
//
//         const skip = page * limit - limit
//         let startDate;
//         let endDate
//         if (starting && ending) {
//             startDate = new Date(starting);
//             endDate = new Date(ending);
//         }
//
//         let options = Object.assign(
//             query1 ? {query1} : {},
//             query2 ? {query2} : {},
//             query3 ? {query3} : {}
//         );
//         // console.log(options)
//         let newOptions = {};
//         Object.entries(options).forEach(([key, value]) => {
//             if (typeof value === 'string' && value.includes(',')) {
//                 newOptions[key] = value.split(',');
//             } else {
//                 newOptions[key] = value;
//             }
//         });
//
//         // console.log(newOptions)
//         const orders = await Order.find({
//             ...(newOptions.query1 && {message_status: newOptions.query1}),
//             ...(newOptions.query2 && {order_status: newOptions.query2}),
//             ...(newOptions.query3 && {payment_status: newOptions.query3}),
//             ...(startDate && {date: {$gte: startDate}}),
//             ...(endDate && {delivery_date: {$lte: endDate}}),
//             isActive: 1,
//             createdBy: id
//         }).skip(skip).limit(limit)
//
//         if (orders) {
//             return res.status(200).json({
//                 message: 'Success: List of Orders is',
//                 count: orders?.length,
//                 data: orders
//             })
//         } else {
//             return res.status(404).json({
//                 message: 'Orders not found',
//                 data: null
//             })
//         }
//
//     } catch (e) {
//         console.log('Error ', e)
//         return res.status(501).json({
//             message: "Error Occurred"
//         })
//     }
// }


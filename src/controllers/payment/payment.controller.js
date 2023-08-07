const config = require('config');
const secretKey = config.get('STRIPE_SECRET_KEY');

const stripe = require('stripe')(secretKey);
const baseUrl = config.get('FRONTEND_BASE_URL');
const backendBaseUrl = config.get('BACKEND_BASE_URL');
const backendBaseUrlOld = config.get('BACKEND_BASE_URL_OLD');
const subscriptionModel = require('../../models/subscriptions/subscription.model')
const userSubscriptionModel = require('../../models/subscriptions/user.subscriptions')
const goProFeaturesModel = require('../../models/gopro/goProFeatures.model')

// module.exports.checkout = async (req, res) => {
//     try {
//         // const customer = await stripe.customers.create({
//         //     email: req.body.stripeEmail,
//         //     source: req.body.stripeToken,
//         //     name: 'Gourav Hammad',
//         //     address: {
//         //         line1: 'TC 9/4 Old MES colony',
//         //         postal_code: '452331',
//         //         city: 'Indore',
//         //         state: 'Madhya Pradesh',
//         //         country: 'India',
//         //     }
//         // })
//         //  if(customer){
//         //        const charge= stripe.charges.create({
//         //             amount: 2500,     // Charging Rs 25
//         //             description: 'Web Development Product',
//         //             currency: 'USD',
//         //             customer: customer.id
//         //         });
//         //        if(charge){
//         //            res.send("Success")
//         //        }
//         //        else{
//         //            res.send("Error while making payment")
//         //        }
//         //     }
//         //    else{
//         //        res.send("Error while making payment")
//         //  }

//         const session = await stripe.payments.sessions.create({
//             line_items: [
//                 {
//                     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//                     // price: '{{PRICE_ID}}',
//                     price: 23,
//                     quantity: 1,
//                 },
//             ],
//             mode: 'subscription',

//             success_url: `${baseUrl}/crm/dashboard/`,
//             cancel_url: `${baseUrl}/crm/dashboard/`,
//         });

//         res.redirect(303, session.url);
//     } catch (err) {
//         console.log('Error -->', err.message);
//         res.status(500).json({
//             message: 'Internal Server Error',
//             error: err.message
//         })
//     }
// }


module.exports.createStripeProduct = async (req, res) => {
    try {
        const product = await stripe.products.create({
            name: req.body?.name,
            description: req.body?.description
        });
        if (product) {
            const price = await stripe.prices.create({
                unit_amount: req.body?.unit_amount * 100,
                currency: 'myr',
                recurring: {interval: 'year'},
                product: `${product.id}`,
            });
            if (price) {
                res.status(201).json({
                    message: 'Product Created Successfully',
                    data: product
                })
            }
        } else {
            res.status(422).json({
                message: 'Something went wrong',
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            message: 'Internal Server Error'
        })
    }
}

module.exports.getAllStripeProducts = async (req, res) => {
    try {
        const allPrices = await stripe.prices.list({limit: 12});
        let allProducts = [];
        if (allPrices?.data?.length > 0) {
            for await(const price of allPrices?.data) {
                const products = await stripe.products.retrieve(price?.product);
                allProducts.push({
                    product_id: products?.id,
                    name: products?.name,
                    price: price?.unit_amount / 100,
                    price_id: price?.id,
                    type: products?.description
                })
            }
            res.status(200).json({
                message: 'Products Found',
                data: allProducts
            })
        } else {
            res.status(404).json({
                message: 'No Products Found',
                data: null
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
            message: 'Internal Server Error'
        })
    }
}

module.exports.updateStripeProduct = async (req, res) => {
    try {
        const price = await stripe.prices.update(
            req.body?.price_id,
            {
                currency_options: {
                    currency: {
                        currency: 'myr',
                        unit_amount: req.body?.unit_amount
                    }
                }

            });

        res.status(200).json({
            message: 'Price Updated Successfully',
            data: price
        })
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Internal Server Error'
        })
    }
}

module.exports.checkout = async (req, res) => {
    try {
        // const totalAmount = Number(req.query.price);
        const totalAmount = req.body.plan_name === 'yearly' ? Number(req.body.price) * 12 : Number(req.body.price);
        // let additionalPhone = req.body?.additionalPhone
        // let additionalSeat = req.body?.additionalSeat
        console.log(totalAmount,">>>>>>>>>>>>>>>>>>>>>",req.body)


        await subscriptionModel.create({
            plan_name: req.body?.plan_name,
            plan_type: req.body?.plan_type,
            createdBy: req.user_id,
            total_amount: totalAmount,
            isActive: 2
        })

        const goProFeatures = await goProFeaturesModel.find();

        await userSubscriptionModel.create({
            plan_name: req.body?.plan_name,
            plan_type: req.body?.plan_type,
            createdBy: req.user_id,
            total_amount: totalAmount,
            goProRecord: goProFeatures,
            isActive: 2
        })
        let price = null;
        if (req?.body?.plan_name === 'yearly') {
            price = await stripe.prices.create({
                unit_amount_decimal: totalAmount *100, currency: 'myr', //product: 'prod_N3XcoWcRBBeUIg',
                // unit_amount_decimal: 500, currency: 'myr', //product: 'prod_N3XcoWcRBBeUIg',
                product: 'prod_NJ4q4TC1Bh9dx4'
                // product: 'prod_NIGfxKXBXc8BeY'
            });

        } else {
            price = await stripe.prices.create({
                // unit_amount_decimal: 500, currency: 'myr', //product: 'prod_N3XcoWcRBBeUIg',
                unit_amount_decimal: totalAmount*100, currency: 'myr', //product: 'prod_N3XcoWcRBBeUIg',
                // product: 'prod_NJ3kB9qWZVOjc7'
                product: 'prod_NJ4pnaQO7opAlu'
            });
        }
        // console.log("----------->", totalAmount);
        const session = await stripe.checkout.sessions.create({
            line_items: [{price: price.id, quantity: 1},],
            currency: 'myr',
            mode: 'payment',
            metadata: {
                user_id: req.headers?.authorization?.split(" ")?.[1] ?? ""
            },
            success_url: `${baseUrl}/root-inbox/inbox/?payment=success`,
            cancel_url: `${baseUrl}/root-inbox/inbox/?payment=failed`,
        });
        // console.log('URL -------->',session);
        // res.redirect(302, session.url);
        global.user_id = req.user_id;
        res.json({url: session.url});

    } catch (err) {
        console.log('error', err.message)
        res.status(500).json({
            error: err.message,
            message: 'Internal Server Error'
        })
    }
}

// module.exports.createSubscription = async(req, res)=>{
//     try {
//         console.log('Subscription created Successfully');
//         // await
//     }  catch (err) {
//         res.status(500).json({
//             error: err,
//             message: 'Internal Server Error'
//         })
//     }
// }

module.exports.stripeWebhookEndpoint = async (req, res) => {
    try {
        console.log('-------> Stripe Webhook Endpoint')
        const stripeResponse = await stripe.webhookEndpoints.create({
            // url: `${backendBaseUrlOld}/subscription/add`,
            url: `${backendBaseUrl}/subscription/add`,
            enabled_events: [
                'checkout.session.completed',
            ],
        });
        // console.log('User ID ------->', global.user_id, stripeResponse)
        // if(stripeResponse) {
        //     // await subscriptionModel.updateOne({createdBy: global.user_id}, {
        //     //     payment_id: req.data.payment_intent
        //     // })
        // }
        res.json({message: 'Stripe Response', data: stripeResponse})
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Internal Server Error'
        })
    }
}


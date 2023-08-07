const subscriptionModel = require('../../models/subscriptions/subscription.model');
const userSubscriptionModel = require('../../models/subscriptions/user.subscriptions');
const userModel = require('../../models/user.model')
const jwt = require("jsonwebtoken");
const config = require("config");
const {createChatDaddyAccount} = require("../../helper/techoverflow.whatsapp.helper");
const whatsAppMessagesRecordModel = require("../../models/whatsapp/whatsapp.messages.record");

module.exports.createSubscription = async (req, res) => {
    try {
        // console.log('In Subscription User ID', global.user_id, req?.body?.data?.object.payment_intent,
        //     req?.data?.object.payment_intent)

        // const updateSubscription = await subscriptionModel.updateOne({createdBy: global.user_id,
        // isActive:3}, {
        //     isActive: 1,
        //     payment_status: "paid",
        //     payment_id: req?.body?.data.object.payment_intent
        // })
        // console.log('Global ->', global.user_id)

        const decode = jwt.verify(req.body.data.object.metadata.user_id.toString(), config.get('JWT_SECRET_TOKEN'));
        if (decode) {
            req.user_id = decode.user_id;
        // console.log('---------> In Create Subscription--------', req.body.data.object.metadata, req.user_id)
        }
        // const updateSubscription = await userSubscriptionModel.findOneAndUpdate({createdBy: global.user_id,
        const updateSubscription = await subscriptionModel.findOneAndUpdate({createdBy: req.user_id,
        isActive:2}, {
            payment_id: req?.body?.data.object.payment_intent,
            isActive:1,
            payment_status:'unpaid',
        })
        const updateUserSubscription = await userSubscriptionModel.findOneAndUpdate({createdBy: req.user_id,
        isActive:2}, {
            payment_id: req?.body?.data.object.payment_intent,
            isActive:1,
            payment_status:'unpaid',
        })
        const checkSubscription =await subscriptionModel.findOne({ createdBy: req.user_id
        // const checkSubscription =await userSubscriptionModel.findOne({ createdBy: req.user_id
        , payment_id:!req?.body?.data.object.payment_intent})
            .or([{isActive:1},{isActive:3}])

        const checkUserSubscription =await userSubscriptionModel.findOne({ createdBy: req.user_id
        , payment_id:!req?.body?.data.object.payment_intent})
            .or([{isActive:1},{isActive:3}])

        if(checkSubscription){
            await subscriptionModel.updateOne({ _id: checkSubscription._id},{
                isActive:3
            })
        }
        if(checkUserSubscription){
            await userSubscriptionModel.updateOne({ _id: checkUserSubscription._id},{
                isActive:3
            })
        }
        const user = await userModel.findOneAndUpdate({_id:req?.user_id},{
            subscriptionId: updateSubscription?._id,
            userSubscriptionId: updateUserSubscription?._id
        })
        // delete global.user_id;
        // console.log('Updated Subscription',updateSubscription)
        res.status(200).json({
            message: 'Subscription Created Successfully',
            data: updateSubscription,
            user
        })
    } catch (err) {
        console.log('Error', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}


module.exports.updateSubscriptionStatus = async (req, res)=>{
    try{
        let status=3;
        req.body.paymentStatus.toLowerCase()==='paid'?status=1:status=3;
        const updateSubscription = await subscriptionModel.findOneAndUpdate({
            _id: req.body.subscriptionId
        },{
            payment_status:req.body.paymentStatus,
            isActive:status
        })
        const updateUserSubscription = await userSubscriptionModel.findOneAndUpdate({
            createdBy: updateSubscription.createdBy
        },{
            payment_status:req.body.paymentStatus,
            isActive:status
        })
        if(status===1){
            const findUser = await userModel.findOne({subscriptionId:req.body.subscriptionId})
            if(!findUser?.chatDaddyId) {
                const chatDaddyAccountResponse = await createChatDaddyAccount(req, findUser?.fullname);
            console.log('find User Subscription------>',findUser, chatDaddyAccountResponse)
                await userModel.findOneAndUpdate({subscriptionId: req.body.subscriptionId},
                    {chatDaddyId: chatDaddyAccountResponse?.accountId})
            }
            const getMessageCount = await whatsAppMessagesRecordModel.findOneAndUpdate({
                createdBy: findUser._id,
            },{
                messageCount:0
            })
        }
        if(updateUserSubscription && updateSubscription){
        res.status(200).json({
            message:'success',
            data:updateSubscription
        })
        }
        else{
            res.status(200).json({
                message:'Something went wrong'
            })
        }
    }
    catch (err) {
        console.log('Error', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

module.exports.getUserSubscription = async (req, res)=>{
    try{
        // const userSubscription = await subscriptionModel.findOne({
        const userSubscription = await userSubscriptionModel.findOne({
            createdBy: req.user_id,
            isActive:1,
            payment_status:"paid"
        }).populate(['team_inbox', 'whatsapp_shop', 'whatsapp_bot','broadcast'])


        if(userSubscription){
            const teamInbox = userSubscription.team_inbox.features.map(team_inbox=>{
                return {
                    title: team_inbox.title,
                    value:team_inbox[`${userSubscription.plan_type.toLowerCase()}`]
                }

            })
            const whatsAppShop = userSubscription.whatsapp_shop.features.map(team_inbox=>{
                return {
                    title: team_inbox.title,
                    value:team_inbox[`${userSubscription.plan_type.toLowerCase()}`]
                }

            })
            const whatsAppBot = userSubscription.whatsapp_bot.features.map(team_inbox=>{
                return {
                    title: team_inbox.title,
                    value:team_inbox[`${userSubscription.plan_type.toLowerCase()}`]
                }

            })
            const broadcast = userSubscription.broadcast.features.map(team_inbox=>{
                return {
                    title: team_inbox.title,
                    value:team_inbox[`${userSubscription.plan_type.toLowerCase()}`]
                }

            })
        res.status(200).json({
            message:'success',
            userSubscription,
           data: {
               teamInbox,
               whatsAppShop,
               whatsAppBot,
               broadcast,
           }
        })
        }
        else{
            res.status(200).json({
                message:'success',
                data:{
                    plan_name:"free",
                    total_amount:0
                }
            })
        }
    }
    catch (err) {
        console.log('Error', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}
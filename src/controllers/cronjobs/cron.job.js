const cron = require('node-cron');
const jwt = require("jsonwebtoken");
const config = require("config");
const offlineBotModel = require('../../models/offline bot/offlineBot');
const whatsAppMessagesRecordModel = require("../../models/whatsapp/whatsapp.messages.record");
const {io} = require('../../../index')
const dayjs = require('dayjs')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

let cronJob = false;
// io
//     .of('/api')
//     .on('connect', () => {
//         console.log("New client connected")
//     })

const offlineBotAutomation = async (req, res, next) => {
    // console.log('IN FUnction CRON JOB');
    //

    try {
        if (req?.user_type !== 'admin') {
            const token = req.headers?.authorization?.split(" ")?.[1] ?? "";
            if (token) {
                // console.log('------>', token)
                const decode = jwt.verify(token, config.get('JWT_SECRET_TOKEN'));
                // console.log('Decode: ', !!decode)
                if (decode) {
                    req.user_id = decode.user_id;

                    if (cronJob) {
                        // console.log('IN IF CRON JOB', cronJob);
                        next();
                    } else if (req?.user_id) {
                        // console.log('IN ELSE CRON JOB', cronJob);
                        const currentUserBot = await offlineBotModel.find({createdBy: req.user_id})
                            // .select({onlineHours: 1});

                        if (currentUserBot?.length > 0) {
                            // console.log(currentUserBot)
                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                            const date = new Date();
                            const day = date.getDay();
                            const currentDay = dayNames[day];

                            // console.log('------------>', currentDay); // Outputs the name of the day
                            for await(const allBots of currentUserBot) {
                                // allBots?.onlineHours?.forEach((bot) =>{
                                for await(const bot of allBots?.onlineHours) {
                                    if (bot?.weekdayName.toLowerCase() === currentDay.toLowerCase() && bot?.isActive === 1) {
                                       if (dayjs(bot.from.toISOString()).isSameOrBefore(dayjs()) && dayjs(bot.to.toISOString()).isSameOrAfter(dayjs())) {
                                            // await offlineBotModel.updateOne({
                                            //     createdBy: req.user_id,
                                            //     'onlineHours.weekdayName': currentDay
                                            // }, {
                                            //     $set: {
                                            //         'onlineHours.$.isActive': 3
                                            //     }
                                            // })
                                           if(allBots.setTriggerTime==='Infinite'){
                                               console.log('------------> IF Cron Job Activated');
                                               const task = cron.schedule('*/10 * * *  *', async () => {
                                                   // const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({createdBy: req.user_id}, {
                                                   //     $inc: {messageCount: 1}
                                                   // })
                                                   // if (!msgCount) {
                                                   //     await whatsAppMessagesRecordModel.create({
                                                   //         createdBy: req.user_id,
                                                   //         $inc: {messageCount: 1}
                                                   //     });
                                                   // }
                                                   console.log('currentUserBot--------> Bot Running')
                                                   global.io
                                                       .of('/api')
                                                       .emit('offline-bot-activated');
                                                   task.stop();

                                               });
                                               cronJob = true;
                                           }
                                           else{
                                               let cronjobTime =null;
                                               if(allBots.time==='Hours'){
                                                   cronjobTime = `* */${allBots.duration} * * *`
                                               }
                                               else if(allBots.time==='Minutes'){
                                                   cronjobTime = `*/${allBots.duration} * * * *`
                                               }
                                               else{
                                                   cronjobTime = `* * */${allBots.duration} * *`
                                               }
                                               console.log('------------> Else Cron Job Activated',cronjobTime);
                                               const task = cron.schedule(cronjobTime, async () => {
                                                   // const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({createdBy: req.user_id}, {
                                                   //     $inc: {messageCount: 1}
                                                   // })
                                                   // if (!msgCount) {
                                                   //     await whatsAppMessagesRecordModel.create({
                                                   //         createdBy: req.user_id,
                                                   //         $inc: {messageCount: 1}
                                                   //     });
                                                   // }
                                                   console.log('currentUserBot--------> Bot Running', cronjobTime)
                                                   global.io
                                                       .of('/api')
                                                       .emit('offline-bot-activated');
                                                   // task.stop();

                                               });
                                               cronJob = true;
                                           }
                                           global.cronjob = true;
                                            // next();
                                        } else {
                                            cronJob = false;
                                            // next();
                                        }

                                    } else {
                                        cronJob = false;
                                        // next();
                                    }
                                    // })
                                }
                            }
                        } else {
                            cronJob = false;
                        }
                        next();

                    }
                } else {
                    next();
                }
            } else {
                // console.log('IN ELSE LAST CRON JOB', cronJob);
                cronJob = false;
                next();
            }
        } else {
            next();
        }
    } catch (err) {
        console.log('Offline JOB Error----->', err);
        next();
    }
}

module.exports = {
    cronJob,
    offlineBotAutomation
}
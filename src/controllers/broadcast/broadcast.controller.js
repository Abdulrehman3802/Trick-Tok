const broadcastModel = require('../../models/broadcast/broadcast.model')
const tagsModel = require('../../models/tags/tag.model')
const contactModel = require('../../models/contacts/contacts.model')
const userModel = require('../../models/user.model')
const fs = require('fs');
const path= require('path')
const csvFile = require("csvtojson");
const config = require('config');
const WhatsappCloudAPI = require("whatsappcloudapi_wrapper");
const mongoose = require("mongoose");
const {BotsApi, CampaignsApi} = require("@chatdaddy/client");
const botTemplateModel = require('../../models/bot_templates.model')
// WhatsApp Credentials for accessing WhatsApp Cloud API BOT
const Whatsapp = new WhatsappCloudAPI({
    accessToken: config.get('Meta_WA_accessToken'),
    senderPhoneNumberId: config.get('Meta_WA_SenderPhoneNumberId'),
    WABA_ID: config.get('Meta_WA_wabaId'),
    graphAPIVersion: "v15.0",
});
// Delete Multiple broadcast from DB using array of ids from req.body
exports.deleteBulk = async (req, res) => {
    try {
        const userId = req.user_id;
        const broadcasts = await broadcastModel.find({ _id: req.body.ids, createdBy: userId, isActive: 1 });
        if (broadcasts) {
            console.log("Ids List", req.body.ids);
            const ids = req.body.ids;
            console.log(ids);
            const broadcast = await broadcastModel.updateMany({
                _id: { $in: ids },
                createdBy: userId
            }, { $set: { isActive: 3 } }, { multi: true });
            if (broadcast) {
                return res.status(200).json({
                    message: "Successfully Deleted",
                });
            } else {
                return res.status(404).json({
                    message: "Couldn't find broadcast"
                });
            }
        }

    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
}
// Create  new Broadcast instance to send message to multiple people

module.exports.createCDBroadCast=async (req, res) => {
    try{
        let chatDaddyId=null;
        let user = await userModel.findById(req.user_id)
        if(user){
            chatDaddyId= user.chatDaddyId
        }

        let allContacts = JSON.parse(req.body?.additionalContact)

        allContacts=allContacts.map(contact=>{
            return contact.toString().concat('@s.whatsapp.net')
        })

        // let json = JSON.stringify({recipientJids:allContacts});
        let json = {recipientJids:allContacts};
        // const path ='../../public/broadcast/recipients.json'
        // fs.writeFile(path, json, 'utf8', (err,data) => {
        //     console.log("The file has been saved!",data);
        //     if (err) throw err;
        // });
        // const path =`../../${__dirname}` +'../../public/broadcast/recipients.json'
        const pathFIle =`${path.resolve(process.cwd(), `public/broadcast/recipients_${req.user_id}.json`)}`
        fs.writeFile(pathFIle, JSON.stringify(json,null, 2),async(err, data) => {
            if(err) {
                throw err
            }
            const broadcast = new CampaignsApi({
                accessToken:req.chatDaddyToken
            })

            let messageFlowId = await botTemplateModel.findOne({
                botId: req.body.message
            })

            const broadCast = await broadcastModel.create({
                ...req.body,
                // broadcastHour: hour,
                createdBy: req.user_id,
                contacts: allContacts,
            });

            const broadcastAPI = broadcast.campaignAsyncCreate({
                campaignCreateAsync:{
                    accountId:chatDaddyId,
                    name:`${req.body.name}_${req.user_id}`,
                    sendTyping:true,
                    sendInterval:1,
                    messageTemplate:messageFlowId.chatDaddyFlowId,
                    turboMode:true,
                    scheduledAt:new Date().toISOString(),
                    recipientDataUrl:`${config.get('BACKEND_BASE_URL')}/assets/broadcast/recipients_${req.user_id}.json`
                }
            })
                .then(response=>{
                    console.log('------>response',response.data)
                    return response
                })
                .catch(err=>{
                    console.log('------>Error',err.message)
                    throw err
                })
            res.status(200).json({
                data:broadCast
            })

        });


    }catch(err){
        console.log('Error', err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

exports.createBroadcast = async (req, res) => {
    // console.log('in function', req.body)
    try {
        console.log('---------->',req.body.additionalContact)
        let intags = req.body?.includeTags
        let extags = req.body?.excludeTags
        const addContact = JSON.parse(req.body?.additionalContact)
        let allContacts = JSON.parse(req.body?.additionalContact)
        // let allContacts=[];
        let chatDaddyId=null;
        let user = await userModel.findById(req.user_id)
        if(user){
            chatDaddyId= user.chatDaddyId
        }

        // Ids of Contacts That include "req.body.includeTags" tags
        //
        // if (intags) {
        //    intags = JSON.parse(intags)
        //     // console.log(intags)
        //     let inTags = await tagsModel.find({ tagName: {$in:intags}, createdBy:req.user_id, isActive:1  }).select({_id:1})
        //     console.log("hellp ",inTags)
        //     if (!inTags) {
        //
        //         return res.status(200).json({
        //             error: true,
        //             message: 'Tags not found'
        //         })
        //     }
        //     inTags =inTags.map(tag => tag._id.toString())
        //     // console.log("intags______." ,inTags)
        //     const contacts = await contactModel.find({ tags: { $eq: inTags },createdBy:mongoose.Types.ObjectId(req.user_id), isActive:1   }).select({ phone_number: 1, _id: 0 })
        //     // Ids of Contacts That include "req.body.excludeTags" tags
        //     if (!contacts) {
        //         return res.status(200).json({
        //             error: true,
        //             message: 'Contacts not found'
        //         })
        //     }
        //     allContacts = contacts.map(e => {
        //         return e.phone_number
        //     })
        //     // console.log('INCLUDE----------',allContacts)
        // }
        //
        // if (extags) {
        //     extags = JSON.parse(extags)
        //     // console.log("extags______.")
        //     let exTags = await tagsModel.find({ tagName: {$in:extags}, createdBy:mongoose.Types.ObjectId(req.user_id), isActive:1   }).select({ _id: 1, tagName: 1 });
        //     if (!exTags) {
        //         return res.status(200).json({
        //             error: true,
        //             message: 'Tags not found'
        //         })
        //     }
        //     // exTags =exTags.map(tag => tag._id.toString())
        //     const econtacts = await contactModel.find({ tags: { $nin: exTags }, createdBy:mongoose.Types.ObjectId(req.user_id), isActive:1   }).select({ phone_number: 1, _id: 0 })
        //     if (!econtacts) {
        //         return res.status(200).json({
        //             error: true,
        //             message: 'Contacts not found'
        //         })
        //     }
        //     allContacts = econtacts.map(e => {
        //         return e.phone_number
        //     })
        //     console.log('EXCLUDE----------',allContacts)
        // }
        //
        // if (addContact && (intags || extags)) {
        //     // console.log('contact in broadcast-------->', { addContact });
        //     const add = JSON.parse(addContact)
        //     allContacts = allContacts.concat(add)
        //     // console.log('ADDCLUDE----------', allContacts)
        // }
        // else if (addContact) {
        //     allContacts = JSON.parse(addContact)
        //     // console.log('INCLUDE----------',allContacts)
        // }

        async function createCDBroadCast(allContacts) {
            // console.log("all contacts ============>", allContacts);
            // const hour = JSON.parse(req.body.broadcastHour);
            const broadCast = await broadcastModel.create({
                ...req.body,
                // broadcastHour: hour,
                createdBy: req.user_id,
                contacts: allContacts,
            });

            if (broadCast) {
                console.log(allContacts)
                let messageFlowId = await botTemplateModel.findOne({
                    botId: req.body.message
                })

               const resCd = await send_message(allContacts, messageFlowId.chatDaddyFlowId)
                // console.log(broadCast);s
                return res.status(200).json({
                    message: "Created Successfully",
                    TotalContacts: allContacts.length,
                    data: broadCast,
                    chatDaddy: resCd
                });
            } else {
                return res.status(200).json({
                    error: true,
                    message: 'Broadcast not created'
                })
            }
        }
        // You can also send contact number from CSV file
        // if (req.file) {
        //     let csvContact;
        //     const path = req.file.path
        //     console.log('->',path);
        //     csvFile()
        //         .fromFile(path)
        //         .then(async (jsonObj) => {
        //             csvContact = jsonObj.map(e => {
        //                 return e.phone_number
        //             })
        //             if(allContacts.length > 0) {
        //
        //                 console.log("file --->",allContacts)
        //                 allContacts = allContacts.push(csvContact);
        //             }else{
        //                 allContacts = csvContact
        //             }
        //             await createCDBroadCast(allContacts);
        //         })
        // } else {
        //     await createCDBroadCast(allContacts)
        // }
        // After saving into Database this function is sending text messages through whatsApp

        async function send_message(allContacts, messageFlowId){

             console.time("Time taken")
             console.log(chatDaddyId)
            for (const c of allContacts) {
                // console.log("wtsp")

                const botsApi = new BotsApi({
                    accessToken: req.chatDaddyToken
                })

                function sleep(ms) {
                    return new Promise((resolve) => {
                        setTimeout(resolve, ms);
                    });
                }
                await sleep(1000)
                const fireFlow = await botsApi.botsFire({
                    // id: 'bot_bb1d079c7df50ba4',
                    id: messageFlowId,
                    botsFireRequest: {
                        // accountId: req.body.chatDaddyId,
                        accountId: chatDaddyId,
                        toContact: `${c}@s.whatsapp.net`
                    }
                })

                // return fireFlow;

                //  Whatsapp.sendText({
                //     message: 'hello😀 This is TrickTok sample broadcast reply',
                //     recipientPhone: c
                // })
                //     .then(res => {})
                //     .catch(err => {})
            }
            console.timeEnd("Time taken")
        }
       await createCDBroadCast(allContacts)

    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            message: "Internal Server",
            error: e
        });
    }
}
// Find All the broadcast which you created

// exports.findBroadcasts = async (req, res) => {
//     try {
//         const id = req.user_id
//
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         let broadcast = await broadcastModel.find({ createdBy: id, isActive: 1 }).lean().skip(skip).limit(limit)
//         if (broadcast) {
//             let broadcasts = broadcast.map(e => {
//                 return { ...e, Progress: (Math.floor(Math.random() * 100) + 1) }
//             })
//             res.status(200).json({
//                 message: "Success",
//                 count: broadcasts?.length,
//                 data: broadcasts
//             });
//         } else {
//             res.status(400).json({
//                 error: true,
//                 message: "can't find any broadcast according to this User",
//             });
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(400).json({
//             message: "Internal Server",
//             error: e
//         });
//     }
// }

// Find All the broadcast that matches the search string

// exports.searchBroadcasts = async (req, res) => {
//     try {
//         const id = req.user_id
//         const letter = req.body.letter
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         let broadcast = await broadcastModel.find({ createdBy: id, isActive: 1, "name": {"$regex": letter, "$options": "i"} }).lean().skip(skip).limit(limit)
//         if (broadcast) {
//             let broadcasts = broadcast.map(e => {
//                 return { ...e, Progress: (Math.floor(Math.random() * 100) + 1) }
//             })
//             res.status(200).json({
//                 message: "Success",
//                 count: broadcasts?.length,
//                 data: broadcasts
//             });
//         } else {
//             res.status(400).json({
//                 error: true,
//                 message: "can't find any broadcast according to this User",
//             });
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(400).json({
//             message: "Internal Server",
//             error: e
//         });
//     }
// }

//Find All the broadcasts with Name Search

exports.getBroadcastsWithNameSearch = async (req, res) => {
    try {
        const id = req.user_id

        const page = req.body.page || 1
        const limit = req.body.limit || 10

        const skip = page * limit - limit
        const letter = req.body?.letter || ' '
        const status = req.body?.status || ' '
        console.log(status)
        if (letter && letter.trim().length > 0 || status  && status.trim().length > 0 ) {
            let broadcast = await broadcastModel.find({
                createdBy: id,
                isActive: 1,
                $or: [
                    {"name": {"$regex": letter, "$options": "i"}},
                    {"status": {"$regex": status, "$options": "i"}},
                ],
            }).sort({_id: -1})
                .lean().skip(skip).limit(limit)
            if (broadcast) {
                let broadcasts = broadcast.map(e => {
                    return { ...e, Progress: (Math.floor(Math.random() * 100) + 1) }
                })
                res.status(200).json({
                    message: "Success",
                    count: broadcasts?.length,
                    data: broadcasts
                });
            } else {
                res.status(400).json({
                    error: true,
                    message: "can't find any broadcast according to this User",
                });
            }
        } else {
            let broadcast = await broadcastModel.find({ createdBy: id, isActive: 1 }).lean().skip(skip).limit(limit)
            if (broadcast) {
                let broadcasts = broadcast.map(e => {
                    return { ...e, Progress: (Math.floor(Math.random() * 100) + 1) }
                })
                res.status(200).json({
                    message: "Success",
                    count: broadcasts?.length,
                    data: broadcasts.reverse()
                });
            } else {
                res.status(400).json({
                    error: true,
                    message: "can't find any broadcast according to this User",
                });
            }
        }

    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Internal Server",
            error: e
        });
    }
}

// Find One broadcast which you created
exports.findOneBroadcast = async (req, res) => {
    try {
        const id = req.params.id
        const broadcast = await broadcastModel.findOne({ _id: id, createdBy: req.user_id });
        if (broadcast) {
            res.status(200).json({
                message: "Success",
                data: broadcast
            });

        } else {

            res.status(400).json({
                error: true,
                message: "can't find keyword according to this User",
            });
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Internal Server",
            error: e
        });
    }
}
// Find Update broadcast which you created
exports.updateBroadcast = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const broadcast = await broadcastModel.findOneAndUpdate({ _id: id, createdBy: req.user_id }, data, { new: true });
        if (broadcast) {
            res.status(200).json({
                message: "Success",
                data: broadcast
            })
        } else {
            res.status(400).json({
                error: true,
                message: "can't find broadcast according to this User",
            })
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Internal Server",
            error: e
        });

    }
}
// Delete Broadcast
exports.deleteBroadcast = async (req, res) => {
    try {
        const id = req.params.id
        const broadcast = await broadcastModel.findOneAndUpdate({
            _id: id,
            createdBy: req.user_id
        }, { isActive: 3 }, { new: true });
        if (broadcast) {
            res.status(200).json({
                message: "Successfully deleted",

            })
        } else {
            res.status(400).json({
                error: true,
                message: "can't find broadcast according to this User",
            })
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Internal Server",
            error: e
        });
    }
}


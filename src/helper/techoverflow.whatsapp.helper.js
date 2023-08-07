const whatsAppModel = require("../models/whatsappverification/whatsappverification.model");
const audioConverter = require("audio-converter");
const fs = require('fs');
const axios = require('axios').default;
const whatsAppMessagesRecordModel = require("../models/whatsapp/whatsapp.messages.record")
const {
    KeywordActionCreateRequestObj, BotsApi, Configuration,
    TemplatesApiFactory, TemplateCreate, ContactsApi, ChatsApi, TagsApi, UsersApiFactory
} = require('@chatdaddy/client');
const path = require("path");
const Tag = require("../models/tags/tag.model");
const BACKEND_BASE_URL = require('config').get('BACKEND_BASE_URL')

module.exports.deleteChatDaddyAccount = async(req,chatDaddyId)=>{
    try {
       const user = new UsersApiFactory({
           accessToken:req.chatDaddyToken
       })
       return await user.usersDelete({
            id:chatDaddyId
        })
    }catch (err) {
        throw new Error('Internal Server Error: ' + error);
    }
}

module.exports.createChatDaddyAccount = async (req, nickname) => {
    try {
        // Create Chat Daddy Account
        const options = {
            method: 'POST',
            url: 'https://api-im.chatdaddy.tech/accounts',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            },
            data: {type: 'wa', tier: 'limited_msg_no_chat_history', nickname}
        };

        const response = await axios.request(options);
        return await response?.data;
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
async function getState(req) {
    try {
        const options = {
            method: 'GET',
            url: 'https://api-im.chatdaddy.tech/accounts',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };
        const response = await axios.request(options);
        const accounts = await response?.data?.accounts
        if (accounts?.length > 0) {
            const fetchAccount = accounts.find(account => account.accountId === req.query.chatDaddyId)
            if (fetchAccount) {
                return fetchAccount
            }
        }

    } catch (error) {
        throw new Error('Internal Server Error: ' + error);
    }
}
async function openConnectionToAccount(req) {
    try {
        // Create Chat Daddy Account
        const options = {
            method: 'POST',
            url: `https://api-im.chatdaddy.tech/accounts/${req.query.chatDaddyId}/open`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };
        const response = await axios.request(options);
        // console.log('Response=======>',await response?.data)
        const data = await response?.data?.connecting
        if (data) {
            return await getState(req);
        } else {
            return {message: "Error while generating QR Code", status: "failed"}
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error);
    }
}
module.exports.createContact = async (req, newContacts) => {
    try {
        // chatId 923097873037@s.whatsapp.net`
        const options = {

            method: 'POST',
            url: 'https://api-im.chatdaddy.tech/contacts/upsert',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            },
            data: {
                accountId: req.body.chatDaddyId,
                contacts: newContacts
            }
        };


        const response = await axios.request(options)
        console.log(response)
        const contacts = await response.data
        if (contacts) {
            return contacts
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.getAccountState = async (req) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://api-im.chatdaddy.tech/accounts',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };
        const response = await axios.request(options);
        const accounts = await response?.data?.accounts
        if (accounts.length > 0) {
            const accountState = accounts.find(account => account.accountId === req.query.chatDaddyId)
            // console.log(accountState)
            if (accountState?.state === 'close') {
                const accountResponse = await openConnectionToAccount(req)
                if (accountResponse) {
                    return {message: "Record Found", status: "success", data: accountResponse}
                }
            } else if (accountState) {
                return {message: "Record Found", status: "success", data: accountState}
            } else {
                // return {message:"No Record Found", status:"failed", code:404}
                return {message: "No Record Found", status: "failed", code: 404}
            }
        } else {
            return {message: "No Record Found", status: "failed", code: 404}
        }

    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
async function getChatsImages(req) {
    try {
        const options = {
            method: 'GET',
            url: 'https://api-im.chatdaddy.tech/contacts',
            params: {accountId: req.query.chatDaddyId, type: 'individual'},
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };

        const allContacts = await axios.request(options)
        return await allContacts?.data
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.getAllChats = async (req) => {
    try {
        let query = {
            accountId: req.query.chatDaddyId,
            // unread: req?.query?.unread !== 'null' ? Boolean(req.query?.unread) : null, // Unread = true
            // hasFailedMessage: req?.query?.hasFailedMessage !== 'null' ? Boolean(req.query?.hasFailedMessage) : null, // Failed Messages: true||false
            // archive: req?.query?.archive !== 'null' ? Boolean(req.query?.archive) : null, // archived true
            // hasUnsolvedNote: req?.query?.hasUnsolvedNote !== 'null' ? Boolean(req.query?.hasUnsolvedNote) : null,  // Unsolved Notes: true, false
            // type: req?.query?.type !== 'null' ? req.query?.type : null, // group / individual
            // hasPendingMessage: req?.query?.hasPendingMessage !== 'null' ? Boolean(req.query?.hasPendingMessage) : null, // message queue: true||false
            // lastMessageFromMe: req?.query?.lastMessageFromMe !== 'null' ? false : null // Chats not replied: false
        }
        if (req?.query?.unread) {
            query.unread = req?.query?.unread
        }
        if (req?.query?.hasFailedMessage) {
            query.hasFailedMessage = req?.query?.hasFailedMessage
        }
        if (req?.query?.archive) {
            query.archive = req?.query?.archive
        }
        if (req?.query?.hasUnsolvedNote) {
            query.hasUnsolvedNote = req?.query?.hasUnsolvedNote
        }
        if (req?.query?.type) {
            query.type = req?.query?.type
        }
        if (req?.query?.hasPendingMessage) {
            query.hasPendingMessage = req?.query?.hasPendingMessage
        }
        if (req?.query?.lastMessageFromMe) {
            query.lastMessageFromMe = false
        }
        if (req?.query?.search) {
            query.q = req?.query?.search
        }
        console.log(query);
        const options = {
            method: 'GET',
            url: 'https://api-im.chatdaddy.tech/chats',
            // params: {accountId: req.query.chatDaddyId},
            params: query,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };

        const response = await axios.request(options)
        return await response.data

    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.getSingleChat = async (req) => {
    try {
        // chatId 923097873037@s.whatsapp.net`
        const options = {
            method: 'GET',
            url: `https://api-im.chatdaddy.tech/messages/${req.query.chatDaddyId}/${req.query.chatId}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };

        const response = await axios.request(options)
        const singleChats = await response.data
        if (singleChats?.messages?.length > 0) {
            return singleChats
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.sendMessage = async (req) => {
    try {
        // console.log(req.query.chatId)
        const options = {
            method: 'POST',
            url: `https://api-im.chatdaddy.tech/messages/${req.query.chatDaddyId}/${req.query.chatId}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            },
            data: {text: null}
        };
        if (req?.body?.message) {
            options.data.text = req.body.message;
        }
        if (req?.file) {
            let pttAudio = false
            const today = new Date().toDateString().replaceAll(' ', '_');

            while (req.file.filename.indexOf(" ") !== -1) {
                req.file.filename = req.file.filename.replaceAll(" ", "")
            }

            // const ngrokURL= `https://3280-2400-adc5-168-a600-6164-1384-899c-d3ae.eu.ngrok.io/api/v1/assets/attachments/${today}/${req.file.filename}`
            const liveURL = `${BACKEND_BASE_URL}/assets/attachments/${today}/${req.file.filename}`
            // console.log(liveURL)

            console.log('-------> File', req.file);
            let attachmentType;
            if (req.file.mimetype.includes('image')) {
                attachmentType = 'image';
            } else if (req.file.mimetype.includes('video')) {
                attachmentType = 'video';
            } else if (req.file.mimetype.includes('octet-stream')) {
                attachmentType = 'audio';
                pttAudio = true
                req.file.mimetype = 'audio/ogg'


            }
                // else if(req.file.mimetype.includes('document')){
                //     attachmentType ='document';
            // }
            else {
                attachmentType = 'document';
            }
            // console.log("cdwdwd",req.file.mimetype)
            options.data.attachments = [{
                type: attachmentType,
                mimetype: req.file.mimetype,
                url: liveURL,
                pttAudio: pttAudio
            }]
            // console.log("--> wts controller message send",attachmentType)
            // console.log("--> wts controller message",req.file.mimetype)
        }
        const response = await axios.request(options)
        // console.log(response,"testing phasi")
        const msg = await response.data;
        if (msg) {
            const messagesSentCount = await updateMessageCount(req)
            // console.log('-------->', messagesSentCount)
            return msg;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.getOrderHistory = async (req) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://api-notifications.chatdaddy.tech/tracking/data',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            }
        };
        const response = await axios.request(options)
        const orderHistory = await response.data;
        if (orderHistory) {
            return orderHistory;
        } else {
            return null;
        }

    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.getAllContacts = async (req) => {
    try {
        // const options = {
        //     method: 'GET',
        //     url: 'https://api-im.chatdaddy.tech/contacts',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${req.chatDaddyToken}`
        //     },
        //     params: {accountId: req.query.chatDaddyId, returnTotalCount: 'true'},
        //
        // };
        // const response = await axios.request(options)
        const contacts = new ContactsApi({
            accessToken: req.chatDaddyToken
        })
        const response = await contacts.contactsGet({
            accountId: req.query.chatDaddyId,
            q: req.query.search
        })
        const allContacts = await response.data;
        if (allContacts) {
            return allContacts;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}

module.exports.createContacts = async (req) => {
    try {
        const contacts = new ContactsApi({
            accessToken: req.chatDaddyToken
        })
        // console.log(contacts)
        console.log('right place',req.body)
        const response = await  contacts.contactsPost({
            contactsPost: {
                accountId: req.body.chatDaddyId,
                contacts: [
                    {
                        name: req.body.name,
                        phoneNumber: req.body.phone_number,
                        tags: req.body?.tags || null,
                        assignee: req.body?.assignee || null
                    }
                ]
            }
        })

        // const options = {
        //     method: 'POST',
        //     url: `https://api-im.chatdaddy.tech/contacts/upsert`,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${req.chatDaddyToken}`
        //     },
        //     data:{
        //             accountId: req.body.chatDaddyId,
        //                 contacts:[
        //                     {
        //                         name: req.body.name,
        //                         phoneNumber: req.body.phone_number,
        //                         tags:req.body.tags || null,
        //                         assignee: req?.body?.assignee || null
        //                     }
        //                 ]
        //             }
        // };

        // const response = await axios.request(options)
        if (response) {
            return await response.data
        } else {
            return null;
        }

    } catch (error) {
        throw new Error('Internal Server Error: ' + error);
    }
}

module.exports.deleteContacts = async (req) => {
    try {

        const contactIds = req.body?.ids

        const contacts = new ContactsApi({
            accessToken: req.chatDaddyToken
        })

        // console.log(contacts)
        // console.log(req.body)
        const response = await contacts.contactsDelete({
            data: {
                accountId: req.body.chatDaddyId,
                contacts: contactIds
            }
        })

        // const options = {
        //     method: 'DELETE',
        //     url: `https://api-im.chatdaddy.tech/contacts`,
        //     params: {
        //         accountId: req.body.chatDaddyId,
        //         contacts: req.body.ids,
        //     },
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${req.chatDaddyToken}`
        //     }
        // };
        //
        // const response = await axios.request(options)
        if (response) {
            return await response.data
        } else {
            return null;
        }

    } catch (error) {
        throw new Error('Internal Server Error: ' + error);
    }
}

module.exports.getPaginateContacts = async (req) => {
    try {

        const contacts = new ContactsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }));
        // const parsedPage=JSON.parse(req.query?.page || "")
        // console.log()
        const query = {
            count: req.query?.count || 10,
            page: req.query?.page || "",
            accountId: req.query?.chatDaddyId,
            q: req.query?.letter || "",
            returnTotalCount: true,
            returnLastMessage: true,
        }
        console.log(query)
        // console.log(JSON.parse(query.page))
        const response = await contacts.contactsGet(query)
        // console.log(response.data)
        //From Postman params you need to parse it


        // console.log(parsedPage)
        //req.query?.page is working on frontend but not in postman params field

        // const options = {
        //     method: 'GET',
        //     url: 'https://api-im.chatdaddy.tech/contacts',
        //     params: {
        //         count: req.query?.count || 10,
        //         page: req.query?.page || null,
        //         accountId: req.query?.chatDaddyId,
        //         q: req.query?.letter || null,
        //         returnTotalCount: 'true',
        //     },
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${req.chatDaddyToken}`
        //     },
        // };
        // const response = await axios.request(options)
        // const allContacts = await response.data;
        if (response) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}

module.exports.checkWhatsAppResgister = async (req) => {
    try {
        //From Postman params you need to parse it

        const phone = req.query?.phoneNumber
        // console.log(parsedPage)
        //req.query?.page is working on frontend but not in postman params field

        const options = {
            method: 'GET',
            url: 'https://api-im.chatdaddy.tech/contacts/exists',
            params: {type: 'whatsapp', phoneNumber: phone},
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            },
        };
        const response = await axios.request(options)
        const allContacts = await response.data;
        if (allContacts) {
            return allContacts;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.logout = async (req) => {
    try {
        const options = {
            method: 'POST',
            url: `https://api-im.chatdaddy.tech/accounts/${req.query.chatDaddyId}/close`,
            params: {logout: 'true'},
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.chatDaddyToken}`
            },
        };
        const response = await axios.request(options)
        const logoutResponse = await response.data;
        if (logoutResponse) {
            return logoutResponse;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}
async function updateMessageCount(req) {
    try {
        let msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({createdBy: req.user_id}, {
            $inc: {messageCount: 1},

        }, {
            multi: true,
            new: true,
        });
        if (!msgCount) {
            msgCount = await whatsAppMessagesRecordModel.create({
                createdBy: req.user_id,
                messageCount: 1
            });
        }
        return msgCount;

    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }
}

module.exports.createTagChatDaddy = async (req, res) => {
    try {
        const tags = await Tag.create({
            tagName: req.body.name,
            createdBy: req.user_id
        })
        if (tags) {
            const t = new TagsApi(new Configuration({
                accessToken: req.chatDaddyToken
            }));
            return await t.tagsPost({name: tags.tagName})
        } else {
            return null
        }
    } catch (error) {
        console.log("-- in helpr", error)
    }
}

module.exports.getAllTagsCD = async (req, res) => {
    try {
        const t = new TagsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }));

        const tags = await t.tagsGet()
        if (tags) {
            return tags.data
        } else {
            return null
        }
    } catch (error) {
        console.log("-- in helpr", error)
    }
}
module.exports.deleteTag = async (req, res) => {
    try {

        const tagName = req.query?.tagName

        const t = new TagsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }));

        const tags = await t.tagsDelete({
            name: tagName
        })
        if (tags) {
            // console.log(tags)
            return tags.data
        } else {
            return null
        }

        // const tagName = req.query?.tagName
        // const options = {
        //     method: 'DELETE',
        //     url: 'https://api-im.chatdaddy.tech/tags',
        //     params: {name: tagName},
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${req.chatDaddyToken}`
        //     },
        // };
        // const response = await axios.request(options)
        // const deleteResponse = await response.data;
        // if (deleteResponse) {
        //     return deleteResponse;
        // } else {
        //     return null;
        // }
    } catch (error) {
        console.log("-- in helpr", error)
    }

}
module.exports.getChatsAndContacts = async (req, tags) => {
    try {
        const contact = new ContactsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }));
        const chat = new ChatsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }))
        const contactWithTag = await contact.contactsGet({tags: tags})
        const chatWithTag = await chat.chatsGet({tags: tags})
        console.log(chatWithTag.data.chats, "<---in the helper--->", contactWithTag.data.contacts)
        if (chatWithTag && contactWithTag) {
            const contacts = chatWithTag.data.chats.concat(contactWithTag.data.contacts);
            return contacts
        }
        if (contactWithTag) {
            return contactWithTag
        }
        if (chatWithTag) {
            return chatWithTag
        }
    } catch (error) {
        console.log("--> in helper catch", error)
    }

}
module.exports.createBotWithCD = async (req, dto) => {
    try {
        const bot = new BotsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }));
        let res =  await bot.botsCreate({
            name: dto.name
        });
        return res;
    } catch (error) {
        return error.response?.data
        // throw new Error('Internal Server Error: ' + error.message);
    }
}
module.exports.updateActionOfBotTemplateWithCD = async (req, botId, tree, botObj) => {
    try {
        const bot = new BotsApi(new Configuration({
            accessToken: req.chatDaddyToken
        }));

        const mappedTree = tree.map((action) => {
            if (action.message?.attachments?.length === 0) {
                delete action.message.attachments;
            }
            return {
                ...action,
            }
        })

        return await bot.botsPatch({
            id: botId,
            botPatch: {
                name: botObj.name,
                actions: mappedTree,
                startingActionId: 'init'
            }
        });
    } catch (error) {
        return error.response?.data
    }
}
module.exports.createMessageFlowTemplate = async (req) => {
    try {
        const template = new TemplatesApiFactory({
            accessToken: req.chatDaddyToken
        });
        const response = await template.templatesSubmitForReview({
            accountId: req.body.accountId,
        }, {
            "params": {
                "name": "string",
                "language": "stri",
                "category": "transactional"
            },
            "message": {
                "text": "string",
                "buttons": [
                    {
                        "id": "string",
                        "text": "string",
                        "url": "string",
                        "phoneNumber": "string"
                    }
                ],
                "attachments": [
                    {
                        "type": "image",
                        "url": "http://example.com",
                        "filename": "string"
                    }
                ]
            }
        })
    } catch (error) {
        throw new Error('Internal Server Error: ' + error.message);
    }

}

// These functions has been replaced by tag-cd.controller createTagChatDaddy, getAllTagsCD

// module.exports.createTag = async (req, res) => {
//     try {
//         const options = {
//             method: 'POST',
//             url: 'https://api-im.chatdaddy.tech/tags',
//             params: {name: req.body?.name},
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${req.chatDaddyToken}`
//             },
//         };
//         const response = await axios.request(options)
//         const createTag = await response.data;
//         if (createTag) {
//             return createTag;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         console.log("-- in helpr", error)
//     }
// }

// module.exports.getTags = async (req, res) => {
//     try {
//         const tag = new TagsApi(new Configuration({
//             accessToken: req.chatDaddyToken
//         }));
//         const allTags = await tag.tagsGet()
//         if (allTags) {
//             return allTags
//         }
//     } catch (error) {
//         console.log("-- in helpr", error)
//     }
//
// }

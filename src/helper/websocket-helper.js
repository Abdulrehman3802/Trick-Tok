const WebSocket = require("ws");
const {extractChatDaddyToken} = require("../../chatdaddy");
const keywordReplyModel = require("../models/keyword-reply/keyword-reply.model")
const messageFlowModel = require("../models/bot_templates.model")
const {sendMessage} = require("../helper/techoverflow.whatsapp.helper")
// async function sendKeyWordReply(msg) {
//     try{
//         console.log('Message sent----------->',msg,global?.user_id);
//         const getFlows = await keywordReplyModel.findOne({
//             createdBy:global?.user_id,
//             keyword:msg
//         })
//         if(getFlows){
//             const getMessages = await messageFlowModel.findOne({
//                 botId:getFlows.bot,
//                 createdBy:global?.user_id
//             })
//         }
//     }catch(error){
//         throw new Error('Internal Server Error: ' + error.message);
//     }
// }
module.exports.WebSocketHelper = (() => {
    const connect =  () => {

        const WebSocket = require('ws');
        const crypto = require('crypto');
        const CryptoJS = require('crypto-js');

        let token = global.chatDaddyToken;

        let ws = new WebSocket(`wss://live.chatdaddy.tech?accessToken=${token}&events=chat-update&events=chat-insert&events=chat-delete&events=message-update&events=message-insert&events=message-delete`);

        ws.on('open', function open() {
            console.log('WS connected');
        });

        // ws.on('chat-update', function incoming(data) {
        //     console.log('WS chat-update', data);
        // });
        //
        // ws.on('chat-insert', function incoming(data) {
        //     console.log('WS chat-insert', data);
        // })
        //
        // ws.on('chat-delete', function incoming(data) {
        //     console.log('WS chat-delete', data);
        // })
        //
        // ws.on('message-update', function incoming(data) {
        //     console.log('WS message-update', data);
        // })
        //
        // ws.on('message-insert', function incoming(data) {
        //     console.log('WS message-insert', data);
        // })
        //
        // ws.on('message-delete', function incoming(data) {
        //     console.log('WS message-delete', data);
        // })
        //
        // ws.onerror = function (error) {
        //     console.log('WS error', error);
        // }
        //
        // ws.addListener('message-insert', function (data) {
        //     console.log('WS message-insert', data);
        // })

        ws.onmessage = async function (event) {
            // console.log('WS message', event);
            // console.log('WS message', event.data);

            const data = JSON.parse(event.data);

            switch (data.event) {
                case 'chat-update':
                    // console.log('WS chat-update', data);
                    break;
                case 'chat-insert':
                    // console.log('WS chat-insert', data);
                    break;
                case 'chat-delete':
                    // console.log('WS chat-delete', data);
                    break;
                case 'message-update':
                    // console.log('WS message-update', data);
                    break;
                case 'message-insert':
                    console.log('WS message-insert', data);
                    // const attachments = data?.data[0].attachments;
                    // const decryptedAttachments = attachments.map(attachment => {
                    //     console.log('enc key: ', attachment.decryption.keys.enc)
                    //     console.log('iv key: ', attachment.decryption.keys.iv)
                    // console.log('WS message-insert', data?.data[0].text);
                    // await sendKeyWordReply(data?.data[0].text)
                    // const attachments = data?.data[0].attachments;
                    // const decryptedAttachments = attachments.map(attachment => {
                    //     // console.log('enc key: ', attachment.decryption.keys.enc)
                    //     // console.log('iv key: ', attachment.decryption.keys.iv)
                    //     const decryptedAttachment = decryptImageURL(attachment.url, attachment.decryption.keys.enc, attachment.decryption.keys.iv);
                    //     return decryptedAttachment;
                    // });
                    // console.log('decryptedAttachments', decryptedAttachments);
                    // console.log('WS attachments', attachments);
                    global.io
                        .of('/api')
                        .emit('cd-message-insert', data);
                    break;
                case 'message-delete':
                    console.log('WS message-delete', data);
                    break;
            }
        }

        ws.onclose = function (event) {
            console.log('WS close');
        }

        ws.onerror = async function (error) {
            // console.log('WS error', error);
            ws.close()

            await extractChatDaddyToken();

            // ws = new WebSocket(`wss://live.chatdaddy.tech?accessToken=${global.chatDaddyToken}&events=chat-update&events=chat-insert&events=chat-delete&events=message-update&events=message-insert&events=message-delete`);
            connect();
        }

        function decryptImageURL(encodedURL, encKey, ivKey) {
            // Decode the URL-encoded string
            // let url = decodeURIComponent(encodedURL);
            //
            // let iv = Buffer.from(ivKey).slice(0, 16);
            // if (iv.length < 16) {
            //     iv = Buffer.concat([iv, Buffer.alloc(16 - iv.length, 0)]);
            // }
            //
            // // Decrypt the URL using the given key
            // let decipher = crypto.createDecipheriv('aes-256-cbc', encKey, iv);
            // let decrypted = decipher.update(url, 'base64', 'utf8');
            // decrypted += decipher.final('utf8');
            // return decrypted;

            // Encrypted URL
            const encryptedURL = encodedURL;

// AES Key
            const key = CryptoJS.enc.Base64.parse(encKey);

// AES IV (Initialization Vector)
            const iv = CryptoJS.enc.Base64.parse(ivKey);

// Decrypt the encrypted URL
            const decryptedBytes = CryptoJS.AES.decrypt(
                encryptedURL,
                key,
                {
                    iv: iv,
                    padding: CryptoJS.pad.Pkcs7,
                    mode: CryptoJS.mode.CBC
                }
            );

            const decryptedURL = decryptedBytes.toString(CryptoJS.enc.Utf8);
            // console.log("Decrypted URL: ", decryptedURL);
        }
    }

    connect()
})



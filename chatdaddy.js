
const {makeAccessTokenFactory, Scope, BotsApi} = require('@chatdaddy/client');

const config = require('config');
const teamId = config.get('CHAT_DADDY_TEAM_ID')
const chatDaddyRefreshToken = config.get('CHAT_DADDY_REFRESH_TOKEN')
// import axios from "axios";
// create a factory that takes care of auto-renewing access tokens when they expire

// (async() => {
module.exports.getChatDaddyToken = async (req, res, next) => {
    // console.log('in getChatDaddyToken')
// team ID you want to generate the token for
    // read the section below to see how to get your team ID
    let chatDaddyToken = null

    // console.log('getChatDaddyToken')

    const getToken = makeAccessTokenFactory({
        request: {
            refreshToken: chatDaddyRefreshToken, // example, use your own refresh token
       scopes: [Scope.MessagesSendToAll, Scope.AccountCreate, Scope.AccountRead,
                Scope.ChatsAccessAll, Scope.AccountPatch, Scope.AccountDelete,
                Scope.ContactsReadAll, Scope.ContactsReadAssigned, Scope.MessagesDelete,
                Scope.ChatsDelete, Scope.ChatdaddyHook, Scope.MessagesSchedule,
                Scope.MessagesSendToAssigned, Scope.TagsCreate,
                Scope.TagsRead, Scope.TagsDelete, Scope.TagsCreate, Scope.TagsRead, Scope.TagsDelete,
                Scope.ContactsCreate, Scope.ContactsDelete, Scope.ContactsUpdate,Scope.KeywordRead,
               Scope.KeywordCreate, Scope.KeywordDelete, Scope.KeywordUpdate, Scope.TemplatesRead,
           Scope.TemplatesDelete, Scope.TemplatesUpdate, Scope.TemplatesCreate, Scope.CampaignsCreate,
       Scope.CampaignsDelete, Scope.CampaignsUpdate, Scope.CampaignsRead],
    }});

    const token = await getToken(teamId)
    // console.log(token);
    // above line would print something like "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

    // send using WA API

    // var options = {
    //     method: 'POST',
    //     url: 'https://api-im.chatdaddy.tech/messages/acc_205a7b2a-add0-4bb5-a6_0f9e/923374666439@s.whatsapp.net',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token.token}`
    //     },
    //     data: {text: 'chatdaddy Api', buttons:[{
    //         text:"test button",
    //             id:"123"
    //         },]}
    // };

    // axios.request(options).then(function (response) {
    //     console.log(response.data);
    // }).catch(function (error) {
    //     console.error(error);
    // });
    // const options = {
    //     method: 'POST',
    //     url: 'https://api-im.chatdaddy.tech/accounts',
    //     headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`},
    //     data: {type: 'wa', tier: 'limited_msg_no_chat_history', nickname: 'adab'}
    // };
    //
    // axios.request(options).then(function (response) {
    //     console.log(response.data);
    // }).catch(function (error) {
    //     console.error(error);
    // });
    // axios.post(
    //     'https://api-im.chatdaddy.tech/messages/923374666439@s.whatsapp.net',
    //     {
    //             text: 'Hi there!'
    //         },
    //     {
    //         headers: {
    //             'authorization': `Bearer ${token}`,
    //             'content-type': 'application/json'
    //         },
    //     }
    // ).then(e => console.log(e))
    //     .catch(err => console.log(err))
    global.chatDaddyToken = token.token
    req.chatDaddyToken = token.token
    // console.log('Chat Daddy ----->', req.chatDaddyToken)


    // socket.connect
    // await config.set("CHAT-DADDY-TOKEN", chatDaddyToken)
    // console.log(config.get("CHAT-DADDY-TOKEN"))
    next()
}

module.exports.extractChatDaddyToken = async () => {
    // console.log('in getChatDaddyToken')
// team ID you want to generate the token for
    // read the section below to see how to get your team ID
    let chatDaddyToken = null

    // console.log('getChatDaddyToken')

    const getToken = makeAccessTokenFactory({
        request: {
            refreshToken: chatDaddyRefreshToken, // example, use your own refresh token
           scopes: [Scope.MessagesSendToAll, Scope.AccountCreate, Scope.AccountRead,
                Scope.ChatsAccessAll, Scope.AccountPatch, Scope.AccountDelete,
                Scope.ContactsReadAll, Scope.ContactsReadAssigned, Scope.MessagesDelete,
                Scope.ChatsDelete, Scope.ChatdaddyHook, Scope.MessagesSchedule,
                Scope.MessagesSendToAssigned, Scope.TagsCreate,
                Scope.TagsRead, Scope.TagsDelete, Scope.TagsCreate, Scope.TagsRead, Scope.TagsDelete,
                Scope.ContactsCreate, Scope.ContactsDelete, Scope.ContactsUpdate, Scope.KeywordRead,
           Scope.KeywordCreate, Scope.KeywordDelete, Scope.KeywordUpdate, Scope.TemplatesRead,
           Scope.TemplatesDelete, Scope.TemplatesUpdate, Scope.TemplatesCreate, Scope.CampaignsCreate,
               Scope.CampaignsDelete, Scope.CampaignsUpdate, Scope.CampaignsRead],
            // scopes: [Scope.MessagesSendToAll, Scope.AccountCreate, Scope.AccountRead,
            //     Scope.ChatsAccessAll, Scope.AccountPatch, Scope.AccountDelete,
            //     Scope.ContactsReadAll, Scope.ContactsReadAssigned, Scope.NotificationRead, Scope.MessagesDelete,
            //     Scope.ChatsDelete, Scope.ChatdaddyHook, Scope.TemplatesCreate, Scope.TemplatesDelete,
            //     Scope.TemplatesRead, Scope.TemplatesUpdate, Scope.KeywordRead, Scope.KeywordCreate,
            //     Scope.KeywordDelete, Scope.KeywordUpdate, Scope.MessagesSchedule,
            //     Scope.MessagesSendToAssigned, Scope.CampaignsCreate, Scope.TagsCreate,
            //     Scope.TagsRead, Scope.TagsDelete, Scope.TagsCreate, Scope.TagsRead, Scope.TagsDelete,
            //     Scope.ContactsCreate, Scope.ContactsDelete, Scope.ContactsUpdate], // only add scopes to send messages
        },
    });

    const token = await getToken(teamId);
    // console.log(token);
    // above line would print something like "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

    // send using WA API

    // var options = {
    //     method: 'POST',
    //     url: 'https://api-im.chatdaddy.tech/messages/acc_205a7b2a-add0-4bb5-a6_0f9e/923374666439@s.whatsapp.net',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token.token}`
    //     },
    //     data: {text: 'chatdaddy Api', buttons:[{
    //         text:"test button",
    //             id:"123"
    //         },]}
    // };

    // axios.request(options).then(function (response) {
    //     console.log(response.data);
    // }).catch(function (error) {
    //     console.error(error);
    // });
    // const options = {
    //     method: 'POST',
    //     url: 'https://api-im.chatdaddy.tech/accounts',
    //     headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`},
    //     data: {type: 'wa', tier: 'limited_msg_no_chat_history', nickname: 'adab'}
    // };
    //
    // axios.request(options).then(function (response) {
    //     console.log(response.data);
    // }).catch(function (error) {
    //     console.error(error);
    // });
    // axios.post(
    //     'https://api-im.chatdaddy.tech/messages/923374666439@s.whatsapp.net',
    //     {
    //             text: 'Hi there!'
    //         },
    //     {
    //         headers: {
    //             'authorization': `Bearer ${token}`,
    //             'content-type': 'application/json'
    //         },
    //     }
    // ).then(e => console.log(e))
    //     .catch(err => console.log(err))
    global.chatDaddyToken = token.token
    // console.log('Chat Daddy ----->', global.chatDaddyToken)
}
// })()


require('dotenv').config();
const config = require('config');
const qr = require('qrcode-base64');
const qrCodeTerminal = require('qrcode-terminal');


// const { Client, LegacySessionAuth, LocalAuth, WAState } = require('whatsapp-web.js');
// let client = new Client({
//     // session: sessionCfg,
//     authStrategy: new LocalAuth({
//         clientId: 'client-1',
//     })
//     // puppeteer: {
//     //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     // }
// });

// process.env = require('./src/controllers/whatsapp/whatsapp.credentials')(process.env.NODE_ENV || 'development');
const express = require('express');


// const fileUpload = require('express-fileupload')
// require('events').EventEmitter.defaultMaxListeners = 15;

// Routes
const signUpValidationRouter = require('./src/routes/signupvalidation/signupvalidation');
const userRouter = require('./src/routes/user.routes');
const roleRouter = require('./src/routes/role.routes');
const permissionRouter = require('./src/routes/permission.routes');
const authRouter = require('./src/routes/auth.routes');
const contactRouter = require('./src/routes/contacts/contacts.routes');
const siteRouter = require('./src/routes/sitesettings/sitesetting.routes');
const integrationRouter = require('./src/routes/integrations/integration.routes');
const botActionsRouter = require('./src/routes/bots.routes');
const {subscriptionRouter, getUserSubscriptionRouter} = require('./src/routes/subscriptions/subscriptions.routes');
const notificationRouter = require('./src/routes/notification/notification.routes');
const dataBase = require('./src/config/db.config');
const yearlyRouter = require("./src/routes/gopro/yearly.routes");
const quarterlyRouter = require("./src/routes/gopro/quaterly.routes");
const tagsRouter = require("./src/routes/tags/tags.routes");
const goProFeaturesRouter = require("./src/routes/gopro/goProFeature.routes");
const generateLinkRouter = require("./src/routes/generate-link/generate-link.routes");
const Draft_Bot_template_router = require("./src/routes/draft_newBots")
const whatsAppRouter = require("./src/routes/whatsapp/whatsapp.routes");
const teamRoutes = require("./src/routes/team/team.routes");
const bugReportingRoutes = require("./src/routes/bugsreporting/bugsReporting.routes");
const CustomizeDashboardRouter = require("./src/routes/customizeDashboard/customizeDashboard.router")
const {paymentsRoutes, webhookRouter} = require("./src/routes/payments/payment.routes");

const dashboardRouter = require("./src/routes/dashboard/dashboard.routes");
const newBotRouter = require("./src/routes/newBots.routes");
const keywordsRoutes = require("./src/routes/Keyword-reply/keyword-reply.routes");
const broadcastRouter = require("./src/routes/broadcast/broadcast.routes");
const whatsappController = require("./src/controllers/whatsapp/whatsapp.controller");
const loginValidator = require("./src/controllers/authorizations/user.auth");
const offlineBotCronJob = require("./src/controllers/cronjobs/cron.job");
const whatsAppMessagesRecordModel = require("./src/models/whatsapp/whatsapp.messages.record")
const graphsRouter = require("./src/routes/userGraphs/userGraphs.routes");
const bodyParser = require("body-parser")

const whatsAppAccessRouter = require('./src/routes/rolespermissionsaccess/verify.access.routes');

const offlineBotRouter = require('./src/routes/offlineBot Routes/offlineBot');

const googleFormRouter = require("./src/routes/googleform/google.form.routes");

const whatsappUMRouter = require('./src/routes/whatsapp/whatsapp-um.router');

const {whatsappCDRouter, webHookRouter} = require('./src/routes/whatsapp/techoverflow.whatsapp.routes');

const ws = require('ws');

// -------------------------

const {getChatDaddyToken} = require('./chatdaddy');
// console.log('Chat Daddy Token',async ()=>{
//     await getChatDaddyToken()
// })

// ----------------------------
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');


const app = express();
const {createServer} = require('http');
const {Server: Socket} = require('socket.io');
const router = require('./src/routes/whatsapp/whatsapp.routes');
const socketApp = express();

// ----------------------------------------------------------------------
// const http = new createServer(app);
let SocketIO = null;
const socketHttp = new createServer(app);
const io = new Socket(socketHttp, {
    cors: true,
    origins: ['*'],
    // path: '/api/socket.io',
});
//
// try {
//     const webSocket = new ws('wss://live.chatdaddy.tech')
//     webSocket.on('connection', () => {
//         console.log('WebSocket connection')
//     })
//     webSocket.on('open', () => {
//         console.log('WebSocket Open connection')
//     })
// }catch (err) {
//     console.log('Error connecting--->',err)
// }

io
    .of('/api') // this is namespace like ( localhost:5000/api ) here, "/api" is namespace
    .on('connection', (sock) => {
        // console.log('Socket running : ');
        sock.on('disconnect', () => {

        });
    });
// socketHttp.listen(8000, () => {
//     console.log('Socket io is running on port: ', 8000);
// });
global.io = io;
global.cronjob = false
// ------------------------------------------------------------------------

app.use('/api/v1/assets', express.static('public'));
require('./src/controllers/authorizations/passport-stretgy');
const orderRouter = require("./src/routes/order/order.route");

// const tagsRouterCD = require("./src/routes/tags/tag-cd.route");

const {asyncConfig} = require("config/async");
const {WebSocketHelper} = require("./src/helper/websocket-helper");


app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
    origin:"*"
}))
// app.use(cors({
//     'Access-Control-Allow-Origin': '*', //normal-website.com
//     'Access-Control-Allow-Methods': '*',
//     'Access-Control-Allow-Headers': 'Special-Request-Header',
//     'Access-Control-Allow-Credentials': true
// }));
app.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5000");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    req.socketio = io;
    next();
});

app.use(getChatDaddyToken)

// WebSocketHelper()
// const socketRouter = require('express').Router();

// app.use(function (req, res, next) {
//     req.socketio.on('get-chats', function (data) {
//         console.log('in on get-chats: ', { data })
//     })
//     req.socketio.on('qr', function (data) {
//         console.log('In QR');
//     })
//     next()
// })
// app.use(bodyParser.json());

// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     }),
// );

// io
//     .of('/api')// this is namespace like ( localhost:5000/api ) here, "/api" is namespace
//     .use(async (socket, next) => {
//         socket.on('qr', async function (data) {
//             console.log('In QR');
//             // const waState = await client.getState();
//             // console.log({ waState })
//             if (client && client.info) {
//                 // await client.initialize();
//                 // console.log('client && client.info: ', await client.getChats())
//                 socket.emit('ready');
//             } else {
//                 console.log('else client && client.info is Empty: ');
//                 client.on('loading_screen', msg => {
//                     console.log('loading_screen: ', { msg });
//                 });
//
//                 client.on('change_state', (waState) => {
//                     console.log('on change_state: ', waState);
//                 });
//
//                 client.on('qr', async (qrcode) => {
//                     const waState = await client.getState();
//                     console.log('in client qr: ', { waState });
//                     const img = await qr.drawImg(qrcode, {
//                         typeNumber: 4,
//                         errorCorrectLevel: 'M',
//                         size: 500
//                     });
//                     console.log(img);
//                     qrCodeTerminal.generate(qrcode, { small: true });
//                     socket.emit('qr', img);
//                     // res.send('Successfully connected')
//
//                 });
//                 client.on('ready', async () => {
//                     console.log('Client is ready!', client.info);
//                     // const allChats = await client.getChats();
//                     // console.log(allChats);
//
//                     socket.emit('ready');
//                     // res.send('Successfully connected')
//                 });
//                 client.on('authenticated', (session) => {
//                     console.log('Session is ready!', session);
//                 });
//
//                 client.on('remote_session_saved', msg => {
//                     console.log('remote_session_saved: ', { msg });
//                 });
//                 await client.initialize();
//                 // client = new Client({
//                 //     // session: sessionCfg,
//                 //     authStrategy: new LocalAuth({
//                 //         clientId: 'client-1',
//                 //     })
//                 // })
//
//                 // await client.initialize();
//
//
//                 // socket.emit('ready');
//             }
//
//         });
//
//         client.once('message', (msg) => {
//             // console.log('Message received', msg?.from);
//             const id = msg?.from;
//             socket.emit('msg-received', id);
//         });
//
//         socket.on('get-chats', async function () {
//             try {
//                 console.log('Chats are ready!', client.info);
//                 console.log("Here is all the chats", await client.getChats());
//                 const chats = await client.getChats();
//                 console.log("Chats After Chats", chats);
//                 if (chats) {
//                     socket.emit('chats', chats);
//                 }
//             } catch (e) {
//                 console.log('get-chats exception: ', e.message);
//                 socket.emit('get-chats', []);
//             }
//         });
//
//         socket.on('get-chat-by-id', async (id, count = 10) => {
//             console.log(id);
//             try {
//                 const singleChat = await client.getChatById(id);
//                 console.log({ singleChat });
//                 if (singleChat) {
//                     const msgs = await singleChat.fetchMessages({ limit: count });
//                     // console.log({ msgs })
//                     socket.emit('get-single-chats', msgs);
//                 } else {
//                     socket.emit('get-single-chats', []);
//                 }
//             } catch (e) {
//                 console.log('get-chat-by-id exception: ', e);
//                 socket.emit('get-single-chats', []);
//             }
//         });
//         socket.on('sendMessage', async ({ Id, message }) => {
//             try {
//                 console.log(Id, message);
//                 const newMsg = await client.sendMessage(Id, message);
//                 if (newMsg) {
//                     app.use(async (req, res, next) => {
//                         const msgCount = await whatsAppMessagesRecordModel.findOneAndUpdate({ createdBy: req.user_id }, {
//                             $inc: { messageCount: 1 }
//                         });
//                         if (!msgCount) {
//                             await whatsAppMessagesRecordModel.create({
//                                 createdBy: req.user_id,
//                                 $inc: { messageCount: 1 }
//                             });
//                         }
//                         next();
//                     });
//                     socket.emit('send-message-success');
//                 }
//             } catch (e) {
//                 socket.emit('send-message-error');
//                 console.log("send-message-error", e.message);
//             }
//         });
//
//         next();
//     });
//
// io
//     .of('/api')
//     .on('connect', () => {
//     console.log("New client connected")
// })


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: '/public/images/'
// }));

dataBase.connectDB();

// const port = process.env.PORT || 3000
const port = config.get('PORT') || 3000;

app.get('/', (req, res) => {
    res.send(`Server Running on Port http://localhost:${port}`);
    // console.log('Chat Daddy ----->', req.chatDaddyToken)
});


app.use('/api/v1', authRouter);
app.use('/api/v1', signUpValidationRouter);
app.use('/api/v1', whatsAppRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', roleRouter);
app.use('/api/v1', webhookRouter);
app.use('/api/v1', subscriptionRouter);
app.use('/api/v1/whatsapp-ch', webHookRouter);

app.use(loginValidator.authenticateUser);
WebSocketHelper()

// app.use(async (req, res, next) => {
//     // console.log('------>', global?.cronjob)
//     if (!global?.cronjob) {
//         await offlineBotCronJob.offlineBotAutomation(req, res, next)
//
//     }
// });

app.use('/api/v1', paymentsRoutes);
app.use('/api/v1', getUserSubscriptionRouter);
app.use('/api/v1/whatsapp-um', whatsappUMRouter);
app.use('/api/v1/whatsapp-ch', whatsappCDRouter);

app.use('/api/v1', permissionRouter);
app.use('/api/v1', contactRouter);
app.use('/api/v1', siteRouter);
app.use('/api/v1', Draft_Bot_template_router);
app.use('/api/v1', integrationRouter);
app.use('/api/v1', yearlyRouter);
app.use('/api/v1', quarterlyRouter);
app.use('/api/v1', goProFeaturesRouter);
app.use('/api/v1', tagsRouter);
app.use('/api/v1', generateLinkRouter);
app.use('/api/v1', notificationRouter);
app.use('/api/v1', offlineBotRouter);
app.use('/api/v1', googleFormRouter);
app.use('/api/v1', CustomizeDashboardRouter)
app.use('/api/v1', teamRoutes);
app.use('/api/v1', whatsAppAccessRouter);
app.use('/api/v1', bugReportingRoutes);
app.use('/api/v1', dashboardRouter);
app.use('/api/v1', keywordsRoutes);
app.use('/api/v1', broadcastRouter);
// app.use('/api/v1', botActionsRouter)
app.use('/api/v1/new', newBotRouter)
app.use('/api/v1', orderRouter)
app.use('/api/v1', graphsRouter)


socketHttp.listen(port, () => {
    console.log(`Server Running on Port http://localhost:${port} in mode: ${process.env.NODE_ENV}`);
});

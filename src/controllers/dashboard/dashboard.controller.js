const {faker} = require('@faker-js/faker');
const ContactModel = require("../../models/contacts/contacts.model");
const UserModel = require("../../models/user.model");
const TagModel = require("../../models/tags/tag.model");
const OrderModel = require("../../models/order/order.model");
const whatsappMessagesModel = require("../../models/whatsapp/whatsapp.messages.model");
const customizeDashboard = require("../../models/Customize-Dashboard/Customize-Dashboard.model")
const {mongo} = require("mongoose");
const mongoose = require("mongoose");

function convertDateToTimestamp(dateString) {
    // Create a new Date object from the date string
    let date = new Date(dateString);

    // Get the timestamp in milliseconds
    let timestamp = date.getTime();

    // Divide the timestamp by 1000 to get the timestamp in seconds
    // Return the timestamp in seconds
    return timestamp / 1000;
}

const whatsAppAverageReplyStats = async (modeType, startDate, endDate) => {
    try {
        const mode = modeType;
        const startDates = convertDateToTimestamp(startDate)
        const endDates = convertDateToTimestamp(endDate)

        // console.log('------------------->         ', startDates, endDates, mode);


        const data = [];
        let numDays, numWeeks, numMonths;

        // Calculate the number of days, weeks, or months in the interval based on the mode
        if (mode === 'Day') {

            const messagesSent = await whatsappMessagesModel.find({
                'data.fromMe': true,
                'data.timestamp':
                    {
                        $gte: startDates,
                        $lt: endDates
                    }

            })
            const messagesReceive = await whatsappMessagesModel.find({
                'data.fromMe': false,
                'data.timestamp': {
                    $gte: startDates,
                    $lt: endDates
                }
            })

            // console.log({Total: messagesSent?.length > messagesReceive?.length ? messagesSent?.length - messagesReceive?.length : messagesReceive?.length - messagesSent?.length}, 'messagesSent', startDates, 'startDates', endDates, 'endDates')

            numDays = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            for (let i = 0; i < numDays; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const month = date.toLocaleString('default', {month: 'long'});
                // console.log('Data     -------> ', data);

                data.push({
                    Total: messagesSent?.length > messagesReceive?.length ? messagesSent?.length - messagesReceive?.length : messagesReceive?.length - messagesSent?.length,
                    createAt: date.toISOString().split('T')[0],
                    name: `Day ${i + 1}`,
                    month: month
                });
            }
        } else if (mode === 'Week') {
            const numWeeks = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 7));
            for (let i = 0; i < numWeeks; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (i * 7));
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: Math.floor(Math.random() * 100),
                    createAt: date.toISOString().split('T')[0],
                    name: `Week ${i + 1}`,
                    month: month
                });
            }
        } else if (mode === 'Month') {
            const numMonths = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30));
            for (let i = 0; i < numMonths; i++) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + i);
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: Math.floor(Math.random() * 100),
                    createAt: date.toISOString().split('T')[0],
                    name: `Month ${i + 1}`,
                    month: month
                });
            }
        }


        return data;

    } catch (err) {
        console.log(err);
        throw err;
    }

}
module.exports.whatsappMessagesController = async (req, res) => {
    try {
        // const userId = req.user_id
        // console.log(userId)
        const data = {
            "_data": {
                "id": {
                    "fromMe": true,
                    "remote": "923471551695@c.us",
                    "id": "5510ECBB13D53C5B54AE0D47250DD74B",
                    "_serialized": "true_923471551695@c.us_5510ECBB13D53C5B54AE0D47250DD74B"
                },
                "rowId": 999999594,
                "body": "Thank you for contacting Trainings For Tomorrow! Our representative will contact you Soon! :blush:",
                "type": "chat",
                "t": 1672206921,
                "from": {
                    "server": "c.us",
                    "user": "923377216564",
                    "_serialized": "923377216564@c.us"
                },
                "to": {
                    "server": "c.us",
                    "user": "923471551695",
                    "_serialized": "923471551695@c.us"
                },
                "self": "in",
                "ack": 2,
                "invis": true,
                "star": false,
                "kicNotified": false,
                "isFromTemplate": false,
                "pollOptions": [],
                "pollInvalidated": false,
                "latestEditMsgKey": null,
                "latestEditSenderTimestampMs": null,
                "mentionedJidList": [],
                "isVcardOverMmsDocument": false,
                "isForwarded": false,
                "labels": [],
                "hasReaction": false,
                "productHeaderImageRejected": false,
                "lastPlaybackProgress": 0,
                "isDynamicReplyButtonsMsg": false,
                "isMdHistoryMsg": true,
                "stickerSentTs": 0,
                "isAvatar": false,
                "requiresDirectConnection": false,
                "pttForwardedFeaturesEnabled": true,
                "isEphemeral": false,
                "isStatusV3": false,
                "links": []
            },
            "id": {
                "fromMe": true,
                "remote": "923471551695@c.us",
                "id": "5510ECBB13D53C5B54AE0D47250DD74B",
                "_serialized": "true_923471551695@c.us_5510ECBB13D53C5B54AE0D47250DD74B"
            },
            "ack": 2,
            "hasMedia": false,
            "body": "Welcome to Whatsapp",
            "type": "chat",
            "timestamp": 1672206921,
            "from": "923377216564@c.us",
            "to": "923471551695@c.us",
            "deviceType": "android",
            "isForwarded": false,
            "forwardingScore": 0,
            "isStatus": false,
            "isStarred": false,
            "fromMe": false,
            "hasQuotedMsg": false,
            "vCards": [],
            "mentionedIds": [],
            "isGif": false,
            "isEphemeral": false,
            "links": []
        }
        await whatsappMessagesModel.create({
            data: data,
            createdBy: "63b2d4a7397215549ebe9290",
        })
        res.send('Ok')
    } catch (err) {
        console.log(err);
        throw err;
    }


}
const getDailyDashboardStats = async (req, res) => {
    try {
        const contactTags = await ContactModel.find({createdAt: Date.now()})
        let tagsRecords = [];
        if (contactTags?.length > 0) {
            tagsRecords = contactTags?.map(tag => {
                const today = new Date(tag?.createdAt);

                const month = today.toLocaleString('default', {month: 'long'});
                return {
                    reading: tag?.tags?.length,
                    createdAt: tag?.createdAt,
                    id: tag?._id,
                    name: month,
                    month

                }
            })
            res.json({
                message: 'Tags Found',
                reading: tagsRecords
            })
        }
        res.json({
            message: 'No Tags Found',
            reading: 0
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
}
const getWeeklyDashboardStats = async (req, res) => {
    try {
        const contactTags = await ContactModel.find().select('tags createdAt');
        let tagsRecords = [];
        if (contactTags?.length > 0) {
            tagsRecords = contactTags?.map(tag => {
                const today = new Date(tag?.createdAt);

                const month = today.toLocaleString('default', {month: 'long'});
                return {
                    reading: tag?.tags?.length,
                    createdAt: tag?.createdAt,
                    id: tag?._id,
                    name: month,
                    month

                }
            })

        }

        const newConnections = await UserModel.find();
        let connections = []
        if (newConnections?.length > 0) {
            for await(const conn of newConnections) {
                const today = new Date(conn?.createdAt);
                const readings = await UserModel.find({createdAt: conn?.createdAt});
                if (readings?.length > 0) {
                    const month = today.toLocaleString('default', {month: 'long'});
                    connections.push({
                        reading: readings?.length,
                        createdAt: conn?.createdAt,
                        id: conn?._id,
                        name: month,
                        month
                    })
                }
            }
        }

        const month = faker.date.month()
        const data = {
            reading: faker.random.numeric(2),
            name: month,
            month,
            createdAt: faker.date.past(),
            id: faker.datatype.uuid()
        }
        // console.log('------->  ', data)
        res.send([
            {id: 1, title: "Message Sent", result: result, status: false, data: [data, data]},
            {id: 2, title: "Avg Team Response  Time", status: true, data: [data, data]},
            {id: 3, title: "Tasks Added", status: true, data: [data, data]},
            {id: 4, title: "Tasks Solved", status: false, data: [data, data]},
            {id: 5, title: "New Connections", status: true, data: connections},
            {id: 6, title: "Payments Received", status: false, data: [data, data]},
            {id: 7, title: "Order Received", status: false, data: [data, data]},
            {id: 8, title: "Avg Reply Rate", status: false, data: [data, data]},
            {id: 9, title: "Contacts Tagged", status: true, data: tagsRecords},
            {id: 10, title: "Message Flows Sent", status: false, data: [data, data]},
            {id: 11, title: "Avg Message Flow Reply Rate", status: false, data: [data, data]}
        ]);


    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
}
module.exports.getDashboardStats = async (req, res) => {
    try {
        if (req.query.filter === 'week') {
            await getWeeklyDashboardStats(req, res);
        } else if (req.query.mode === 'daily') {
            await whatsAppAverageReplyStats(req, res);
            // await getDailyDashboardStats(req, res);
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
}
const generateData = (mode, startDate, endDate, timeDifferenceInDays) => {
    // Initialize an empty array to store the data
    const data = [];

    if (timeDifferenceInDays > 1) {
        if (mode === 'Day') {
            const numDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
            for (let i = 0; i < numDays; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: Math.floor(Math.random() * 10),
                    createAt: date.toISOString().split('T')[0],
                    name: `Day ${i + 1}`,
                    month: month
                });
            }
        } else if (mode === 'Week') {
            const numWeeks = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
            for (let i = 0; i < numWeeks; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (i * 7));
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: Math.floor(Math.random() * 10),
                    createAt: date.toISOString().split('T')[0],
                    name: `Week ${i + 1}`,
                    month: month
                });
            }
        } else if (mode === 'Month') {
            const numMonths = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
            for (let i = 0; i < numMonths; i++) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + i);
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: Math.floor(Math.random() * 10),
                    createAt: date.toISOString().split('T')[0],
                    name: `Month ${i + 1}`,
                    month: month
                });
            }
        }
    } else {
        if (mode === 'Day') {
            const numDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
            for (let i = 0; i < numDays; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: 0,
                    createAt: date.toISOString().split('T')[0],
                    name: `Day ${i + 1}`,
                    month: month
                });
            }
        } else if (mode === 'Week') {
            const numWeeks = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
            for (let i = 0; i < numWeeks; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (i * 7));
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: 0,
                    createAt: date.toISOString().split('T')[0],
                    name: `Week ${i + 1}`,
                    month: month
                });
            }
        } else if (mode === 'Month') {
            const numMonths = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
            for (let i = 0; i < numMonths; i++) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + i);
                const month = date.toLocaleString('default', {month: 'long'});
                data.push({
                    Total: 0,
                    createAt: date.toISOString().split('T')[0],
                    name: `Month ${i + 1}`,
                    month: month
                });
            }
        }
    }
    return data;
}
const calculateResult = (data) => {
    return data.reduce((acc, cur) => acc + cur.Total, 0);
}

module.exports.getDashboardStatsData = async (req, res) => {
    const mode = req.query.mode;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    let user = await UserModel.findOne({_id: req.user_id})
    const userCreatedAt = new Date(user?.createdAt)
    const currentTime = new Date()
    const timeDifference = currentTime.getTime() - userCreatedAt.getTime();
    const timeDifferenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Return the response with the data
    let rsData = await getContactTaggedStats(mode, startDate, endDate)
    let data = await customizeDashboard.findOne({createdBy: req.user_id})
    if(!data){
        return {
            code: 500,
            status: "fail",
            error: "error Finding Dashboard",
        };
    }
    // console.log(data.AvgTeamResponseTime)
    res.send([
        {
            id: 1,
            title: "Message Sent",
            status: data.MessageSent,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 2,
            title: "Avg Team Response  Time",
            status: data.AvgTeamResponseTime,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 3,
            title: "Tasks Added",
            status: data.TasksAdded,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 4,
            title: "Tasks Solved",
            status: data.TasksSolved    ,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 5,
            title: "New Connections",
            status: data.NewConnections,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 6,
            title: "Payments Received",
            status: data.PaymentsReceived,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 7,
            title: "Order Received",
            status: data.OrderReceived,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 8,
            title: "Avg Reply Rate",
            status: data.AvgReplyRate,
            // result: calculateResult(whatsAppAverageReplyStats(mode, startDate, endDate)),
            result: 0,
            data: await whatsAppAverageReplyStats(mode, req.query.startDate, req.query.endDate)
            // result: calculateResult(generateData(mode, startDate, endDate)),
            // data: generateData(mode, startDate, endDate)
        },
        {
            id: 9,
            title: "Contacts Tagged",
            status: data.ContactsTagged,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 10,
            title: "Message Flows Sent",
            status: data.MessageFlowsSent,
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        },
        {
            id: 11,
            title: "Avg Message Flow Reply Rate",
            status: data.AvgMessageFlowReplyRate,
            // result: calculateResult(generateData(req.query.mode, req.query.startDate, req.query.endDate)),
            // data: generateData(req.query.mode, req.query.startDate, req.query.endDate)
            result: calculateResult(generateData(mode, startDate, endDate, timeDifferenceInDays)),
            data: generateData(mode, startDate, endDate, timeDifferenceInDays)
        }
    ]);
}
const getContactTaggedStats = (mode, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let match = {};
        if (mode === 'Day') {
            match = {
                updatedAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            };
        } else if (mode === 'Week') {
            // Calculate the start and end of the week for the given dates
            const startOfWeek = getStartOfWeek(startDate);
            const endOfWeek = getEndOfWeek(endDate);
            match = {
                updatedAt: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            };
        } else if (mode === 'Month') {
            // Calculate the start and end of the month for the given dates
            const startOfMonth = getStartOfMonth(startDate);
            const endOfMonth = getEndOfMonth(endDate);
            match = {
                updatedAt: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            };
        }

        // Find the contacts that match the filter
        ContactModel.find(match, (err, contacts) => {
            if (err) {
                reject(err);
            } else {
                // Count the number of contacts that have tags
                const taggedContacts = contacts.filter((contact) => {
                    return contact.tags && contact.tags.length > 0;
                }).length;

                // Convert the contacts to the desired format
                const data = {
                    count: taggedContacts
                };
                resolve(data);
            }
        });
    });
}

function getStartOfWeek(startDate) {
    const date = new Date(startDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function getEndOfWeek(endDate) {
    const date = new Date(endDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff + 6));
}

function getStartOfMonth(startDate) {
    const date = new Date(startDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(endDate) {
    const date = new Date(endDate);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

Date.prototype.getWeek = function () {
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};


module.exports.ordersReceivedStats = async (req, res) => {
    try {

        const mode = req.query.mode;
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        let pipeline = [];

        if (mode === 'Day') {
            console.log("In Day Mode");
            pipeline = [
                {
                    $match: {
                        createdAt: {$exists: true}
                    }
                },
                {
                    $match: {
                        createdBy: mongoose.Types.ObjectId(req.user_id)
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%d",
                                date: "$createdAt"
                            }
                        },
                        Total: {$count: {}}
                    }
                }
            ];

            let orderCount = await OrderModel.aggregate(pipeline);
            console.log("orderCount ------>   ", orderCount);
            let filledResponseForDays = getFilledResponseForDays(orderCount, startDate, endDate);
            return res.status(200).json({
                id: 7,
                title: "Order Received",
                result: calculateResult(filledResponseForDays),
                data: filledResponseForDays,
                totalPointsInData: filledResponseForDays.length,
            });

        } else if (mode === 'Week') {
            console.log("In Week Mode");

            pipeline = [
                {
                    $match: {
                        createdAt: {$exists: true}
                    }
                },
                {
                    $match: {
                        createdBy: mongoose.Types.ObjectId(req.user_id)
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%V",
                                date: "$createdAt"
                            }
                        },
                        Total: {$count: {}}
                    }
                }
            ];

            let orderCount = await OrderModel.aggregate(pipeline);
            let filledResponseForWeeks = getFilledResponseForWeeks(orderCount, startDate, endDate);
            return res.status(200).json({
                id: 7,
                title: "Order Received",
                result: calculateResult(filledResponseForWeeks),
                data: filledResponseForWeeks,
                totalPointsInData: filledResponseForWeeks.length,
            });

        } else if (mode === 'Month') {
            console.log("In Month Mode");

            pipeline = [
                {
                    $match: {
                        createdAt: {$exists: true}
                    }
                },
                {
                    $match: {
                        createdBy: mongoose.Types.ObjectId(req.user_id)
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%m",
                                date: "$createdAt"
                            }
                        },
                        Total: {$count: {}}
                    }
                }
            ];

            let orderCount = await OrderModel.aggregate(pipeline);
            console.log("orderCount ------>   ", orderCount);
            let filledResponseForMonths = getFilledResponseForMonths(orderCount, startDate, endDate);
            return res.status(200).json({
                id: 7,
                title: "Order Received",
                result: calculateResult(filledResponseForMonths),
                data: filledResponseForMonths,
                totalPointsInData: filledResponseForMonths.length,
            });
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

function getFilledResponseForDays(orderCount, startDate, endDate) {
    let filledResponse = [];

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        let currentDay = currentDate.getDate().toString().padStart(2, "0");

        let orderCountForCurrentDay = orderCount.find(
            (entry) => entry._id === currentDay
        );
        if (orderCountForCurrentDay) {
            filledResponse.push(orderCountForCurrentDay);
        } else {
            filledResponse.push({_id: currentDay, Total: 0});
        }
    }

    return filledResponse;
}

function getFilledResponseForWeeks(orderCount, startDate, endDate) {
    let filledResponse = [];

    for (
        let currentDate = startDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 7)
    ) {
        let currentWeek = currentDate.getWeek().toString().padStart(2, "0");

        let orderCountForCurrentWeek = orderCount.find(
            (entry) => entry._id === currentWeek
        );
        if (orderCountForCurrentWeek) {
            filledResponse.push(orderCountForCurrentWeek);
        } else {
            filledResponse.push({_id: currentWeek, Total: 0});
        }
    }

    return filledResponse;
}

function getFilledResponseForMonths(orderCount, startDate, endDate) {
    let filledResponse = [];

    for (
        let currentDate = startDate;
        currentDate <= endDate;
        currentDate.setMonth(currentDate.getMonth() + 1)
    ) {
        let currentMonth = currentDate.getMonth().toString().padStart(2, "0");

        let orderCountForCurrentMonth = orderCount.find(
            (entry) => entry._id === currentMonth
        );
        if (orderCountForCurrentMonth) {
            filledResponse.push(orderCountForCurrentMonth);
        } else {
            filledResponse.push({_id: currentMonth, Total: 0});
        }
    }

    return filledResponse;
}


/*
        orderCount = await OrderModel.aggregate(pipeline);


        Date.prototype.getWeek = function () {
            const date = new Date(this.getTime());
            date.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            // January 4 is always in week 1.
            const week1 = new Date(date.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        };
        console.log('GetWeek', endDate.getWeek());
        // here I am getting empty data
        const defaultData = [];

        for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
            let formattedDate;
            if (mode === 'Day') {
                formattedDate = date.toISOString().substring(0, 10);
            } else if (mode === 'Week') {
                formattedDate = `${date.getFullYear()}-${date.getWeek()}`;
            } else if (mode === 'Month') {
                formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}`;
            }
            defaultData.push({_id: formattedDate, Total: 0});
        }

        if (orderCount.length === 0) {
            res.status(200).json({
                success: true,
                data: defaultData
            });
        } else {
            res.status(200).json({
                success: true,
                data: orderCount
            });
        }
*/
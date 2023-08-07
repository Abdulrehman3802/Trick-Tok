const mongoose = require('mongoose')

const goProFeaturesSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: [true, "Must select a Group Name"],
    },
    features: {
        type: [
            {
                title: {
                    type: String,
                    required: [true, "Must select a title"],
                    default: 29,
                },
                free: {
                    type: String,
                    required: [true, "Price for mini plan is Required"],
                    default: 29,
                },
                mini: {
                    type: String,
                    required: [true, "Price for mini plan is Required"],
                    default: 29,
                },
                pro: {
                    type: String,
                    required: [true, "Price for pro plan is Required"],
                    default: 129,
                },
                max: {
                    type: String,
                    required: [true, "Price for max plan is Required"],
                    default: 399,
                },
                isActive: {
                    type: Number,
                    default: 1,
                }
            }
        ]
    },
    isActive: {
        type: Number,
        default: 1,
    }

}, {timestamps: true})


module.exports = mongoose.model('go_pro_feature', goProFeaturesSchema);











// {
//     [
//     {
//         "groupName": "Whatsapp Shop",
//         "features": [
//             {
//                 "title": "Product Catalogue Listing",
//                 "free": "5",
//                 "mini": "20",
//                 "pro": "500",
//                 "max": "Unlimited",
//             },
//             {
//                 "title": "Number of Orders",
//                 "free": "20",
//                 "mini": "100",
//                 "pro": "5000",
//                 "max": "Unlimited"
//             }
//         ]
//     },
//     {
//         "groupName": "Marketing & CRM",
//         "features": [
//             {
//                 "title": "Number of Messages / Month",
//                 "free": "1",
//                 "mini": "2",
//                 "pro": "10",
//                 "max": "Unlimited"
//             },
//             {
//                 "title": "Number of Tags",
//                 "free": "10",
//                 "mini": "10",
//                 "pro": "100",
//                 "max": "Unlimited"
//             },
//             {
//                 "title": "Custom Fields",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true"
//             },
//             {
//                 "title": "Export of Contacts",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true"
//             }
//         ]
//     },
//     {
//         "_id": "639ad62235adebc2ef284a1d",
//         "groupName": "Data and Security",
//         "features": [
//             {
//                 "title": "Export Analytics Data",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "false",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639ad62235adebc2ef284a1e"
//             },
//             {
//                 "title": "Chat History Archiving: Backup & Export",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "false",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639ad62235adebc2ef284a1f"
//             },
//             {
//                 "title": "Service Level Agreement (SLA)",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "false",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639ad62235adebc2ef284a20"
//             },
//             {
//                 "title": "Contact Information Masking for Teammates",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639ad62235adebc2ef284a21"
//             }
//         ],
//         "isActive": 1,
//         "createdAt": "2022-12-15T08:09:06.435Z",
//         "updatedAt": "2022-12-15T08:09:06.435Z",
//         "__v": 0
//     },
//     {
//         "_id": "639b1815d9cb55886e200c80",
//         "groupName": "Branding",
//         "features": [
//             {
//                 "title": "Remove ChatDaddy Branding on Notification & Shop Messages",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b1815d9cb55886e200c81"
//             },
//             {
//                 "title": "Remove ChatDaddy Branding on Buttons",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "false",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b1815d9cb55886e200c82"
//             }
//         ],
//         "isActive": 1,
//         "createdAt": "2022-12-15T12:50:29.072Z",
//         "updatedAt": "2022-12-15T12:50:29.072Z",
//         "__v": 0
//     },
//     {
//         "_id": "639b186ad9cb55886e200c84",
//         "groupName": "API Integrations",
//         "features": [
//             {
//                 "title": "WhatsApp Business API",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b186ad9cb55886e200c85"
//             },
//             {
//                 "title": "API Request / Minutes",
//                 "free": "60 RPM",
//                 "mini": "60 RPM",
//                 "pro": "60 RPM",
//                 "max": "Custom",
//                 "isActive": 1,
//                 "_id": "639b186ad9cb55886e200c86"
//             }
//         ],
//         "isActive": 1,
//         "createdAt": "2022-12-15T12:51:54.337Z",
//         "updatedAt": "2022-12-15T12:51:54.337Z",
//         "__v": 0
//     },
//     {
//         "_id": "639b190bd9cb55886e200c88",
//         "groupName": "Whatsapp Bot",
//         "features": [
//             {
//                 "title": "Number of Message Flow with Buttons",
//                 "free": "3",
//                 "mini": "3",
//                 "pro": "10",
//                 "max": "200",
//                 "isActive": 1,
//                 "_id": "639b190bd9cb55886e200c89"
//             },
//             {
//                 "title": "Buttons with URLs",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b190bd9cb55886e200c8a"
//             }
//         ],
//         "isActive": 1,
//         "createdAt": "2022-12-15T12:54:35.231Z",
//         "updatedAt": "2022-12-15T12:54:35.231Z",
//         "__v": 0
//     },
//     {
//         "_id": "639b19e5d9cb55886e200c8c",
//         "groupName": "Team Inbox",
//         "features": [
//             {
//                 "title": "Number of Messages / Month",
//                 "free": "100",
//                 "mini": "1500",
//                 "pro": "3000",
//                 "max": "Unlimited",
//                 "isActive": 1,
//                 "_id": "639b19e5d9cb55886e200c8d"
//             },
//             {
//                 "title": "Included Staff Login",
//                 "free": "2",
//                 "mini": "3",
//                 "pro": "5",
//                 "max": "10",
//                 "isActive": 1,
//                 "_id": "639b19e5d9cb55886e200c8e"
//             }
//         ],
//         "isActive": 1,
//         "createdAt": "2022-12-15T12:58:13.693Z",
//         "updatedAt": "2022-12-15T12:58:13.693Z",
//         "__v": 0
//     },
//     {
//         "_id": "639b1b0dd9cb55886e200c90",
//         "groupName": "Support",
//         "features": [
//             {
//                 "title": "Chat",
//                 "free": "true",
//                 "mini": "true",
//                 "pro": "true",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b1b0dd9cb55886e200c91"
//             },
//             {
//                 "title": "WhatsApp",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "true",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b1b0dd9cb55886e200c92"
//             },
//             {
//                 "title": "Priority Support",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "false",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b1b0dd9cb55886e200c93"
//             },
//             {
//                 "title": "Dedicated Customer Success Manager",
//                 "free": "false",
//                 "mini": "false",
//                 "pro": "false",
//                 "max": "true",
//                 "isActive": 1,
//                 "_id": "639b1b0dd9cb55886e200c94"
//             }
//         ],
//         "isActive": 1,
//         "createdAt": "2022-12-15T13:03:09.728Z",
//         "updatedAt": "2022-12-15T13:03:09.728Z",
//         "__v": 0
//     }
// ]
// }
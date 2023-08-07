const Contact = require("../../models/contacts/contacts.model");
const Tag = require("../../models/tags/tag.model");
const csvFile = require("csvtojson");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const TeamModel = require("../../models/team/team.model");
const Order = require("../../models/order/order.model");
const {createContacts, deleteContacts} = require("../../helper/techoverflow.whatsapp.helper");
const ObjectId = mongoose.Types.ObjectId;
const {createContact} = require("../../helper/techoverflow.whatsapp.helper")
const {default: axios} = require("axios");
const {ContactsApi} = require("@chatdaddy/client");
module.exports.createContact = async (req, res) => {
    try {

        // const userId = req.user_id;
        // // console.log("Data", req.body);
        // let tags = req.body.tags;
        // if (tags) {
        //     let tagIds = [];
        //     //find all tags, exist in the database if they are not then create them
        //     for (let tag of tags) {
        //         let foundTag = await Tag.findOne({tagName: tag, isActive: 1, createdBy: req.user_id});
        //         if (foundTag) {
        //             tagIds.push(foundTag._id);
        //         }
        //         if (!foundTag) {
        //             let newTag = new Tag({tagName: tag, createdBy: req.user_id});
        //             let tagRes = await newTag.save();
        //             if (tagRes) {
        //                 tagIds.push(tagRes._id);
        //             }
        //         }
        //     }
        //     req.body.tags = tagIds;
        // }
        // const contactExist = await Contact.findOne({
        //     phone_number: req.body.phone_number,
        //     createdBy: userId,
        //     isActive: 1
        // });
        // if (contactExist) {
        //     res.status(404).json({
        //         message: "Contact already exist",
        //     });
        // }
        // if (!contactExist) {
        //     const newContact = await Contact.create({
        //         ...req.body,
        //         createdBy: userId
        //     });
        //     if (newContact) {
        //         return res.status(201).json({
        //             message: "New Contact Created Successfully",
        //             data: newContact,
        //         });
        //     } else {
        //         return res.status(400).json({
        //             message: "Bad Request",
        //         });
        //     }
        // }

        const newContact = await createContacts(req);
        if (newContact) {
            res.status(201).json({
                message: 'Successfully Created Contact',
                status: 'success',
                data: newContact
            })
        } else {
            res.status(500).json({
                message: 'Something went wrong',
                status: 'fail',
            })
        }

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            data: err,
        });
    }
};

module.exports.importCSV = async (req, res) => {
    try {
        // console.log(req.file);
        const userId = req.user_id;
        if (req.file) {
            const path = req.file.path;
            // const path = `${__dirname}/../../../public/` + csv.name;
            // // req.body.image=`${csv.name}`
            // await csv.mv(path);
            // console.log(path);
            csvFile()
                .fromFile(path)
                .then(async (jsonObj) => {
                    // console.log(jsonObj)
                    const chatDaddyContacts = jsonObj.map(e => {
                        let tagObjects;
                        // console.log(e)
                        let Alltags = e?.Tags.split(',');
                        // console.log(Alltags)
                        if (Alltags[0] !== '' && Alltags.length > 0) {
                            tagObjects = Alltags.map(tag => {
                                // console.log('ohooooooooo ',tag)
                                if(tag) {
                                    return {
                                        name: tag
                                    }
                                }
                            })
                            return {
                                name: e?.Name,
                                phoneNumber: e["Phone Number"],
                                tags: tagObjects,
                            }
                        }
                        else {
                            return {
                                name: e?.Name,
                                phoneNumber: e["Phone Number"]
                            }
                        }
                    })
                    // console.log(chatDaddyContacts)
                    const contacts = new ContactsApi({
                        accessToken: req.chatDaddyToken
                    })

                    const response = await contacts.contactsPost({
                        contactsPost:{
                            accountId: req.body.chatDaddyId,
                            contacts: chatDaddyContacts
                        }
                    }).catch(err=> {
                        console.log(err)
                    })
                    // console.log(req.body.chatDaddyId)
                    // console.log('im nottt heerrrreeeee')


                    for (let i = 0; i < jsonObj.length; i++) {
                        // console.log('in loop')
                        // console.log(jsonObj)
                        const findPhone = await Contact.findOne({
                            phone_number: jsonObj[i]["Phone Number"],
                            createdBy: userId,
                            isActive: 1
                        });
                        // console.log(findPhone);
                        if (findPhone) {
                            continue;
                        }
                        if (!findPhone) {
                            // console.log("i got in !findPhone")
                            // console.log("in not phone",jsonObj[i])
                            let Alltags = jsonObj[i].Tags.split(',');
                            // console.log(Alltags)
                            let tagIds = [];
                            for (let tag of Alltags) {
                                let foundTag = await Tag.findOne({tagName: tag, createdBy: req.user_id});
                                // console.log(foundTag._id)
                                if (foundTag) {
                                    tagIds.push(foundTag._id);
                                    // console.log('push ka bad')
                                }
                                if (Alltags.length > 0 && tag !== '') {
                                    if (!foundTag) {
                                        let newTag = new Tag({tagName: tag, createdBy: req.user_id});
                                        let tagRes = await newTag.save();
                                        // console.log('creatinggggg',tagRes)
                                        if (tagRes) {
                                            tagIds.push(tagRes._id);
                                        }
                                    }
                                }
                            }
                            // console.log(tagIds)
                            const Team = await TeamModel.findOne({$or: [{teamAdmin: userId}, {teamMember: userId}]})
                                .populate({
                                    path: 'teamAdmin',
                                    model: 'user',
                                    select: 'fullname'
                                })
                                .populate({
                                    path: 'teamMembers',
                                    model: 'user',
                                    select: 'fullname'
                                });
                            // console.log("--> team",jsonObj)
                            const assigne = await User.findOne({fullname: jsonObj[i].Assignee});
                            // console.log("Assignee---->",assigne)
                            if (Team) {
                                if (assigne) {
                                    // console.log('not phone admin ', Team.teamAdmin.fullname === assigne.fullname)
                                    if (Team.teamAdmin.fullname === assigne.fullname) {
                                        // console.log("in teamAdmin---",jsonObj[i])
                                        await Contact.create({
                                            name:jsonObj[i].Name,
                                            phone_number: jsonObj[i]["Phone Number"],
                                            tags: tagIds,
                                            createdBy: userId,
                                            assignee: assigne
                                        });
                                    } else {
                                        const promises = Team.teamMembers.map(async e => {
                                            // console.log(e)
                                            // console.log('not phone member',e.fullname === assigne.fullname)
                                            if (e.fullname === assigne.fullname) {
                                                // console.log("in teamMember---",jsonObj[i])
                                                return Contact.create({
                                                    name:jsonObj[i].Name,
                                                    phone_number: jsonObj[i]["Phone Number"],
                                                    tags: tagIds,
                                                    createdBy: userId,
                                                    assignee: assigne
                                                });
                                            }
                                        });
                                        await Promise.all(promises);
                                    }
                                } else {
                                    // console.log("without Team---",jsonObj[i])
                                    await Contact.create({
                                        name:jsonObj[i].Name,
                                        phone_number: jsonObj[i]["Phone Number"],
                                        tags: tagIds,
                                        createdBy: userId,
                                        assignee: null
                                    });
                                }
                            }
                        }
                    }
                    return res.status(200).json({
                        message: "Contacts Created by importing from Csv",
                        data: response.data
                    });
                });
        } else {
            return res.status(404).json({
                message: "File not found",
            });
        }

    } catch (e) {
        console.log("Error ====> ", e);
        return res.status(501).json({
            message: "Internal Server Error",
        });
    }
};


module.exports.getAllContactsWithNameSearch = async (req, res) => {
    // const userId= req.user_id;

    try {
        const userId = req.user_id;
        const page = req.body.page || 1
        const limit = req.body.limit || 10

        const skip = page * limit - limit
        const letter = req.body?.letter
        const totalContacts = await Contact.find({createdBy: userId, isActive: 1})
        if (letter) {
            let allContacts = await Contact.find({
                createdBy: userId,
                isActive: 1,
                $or: [
                    {"name": {"$regex": letter, "$options": "i"}},
                    {"phone_number": {"$regex": letter, "$options": "i"}},
                ],
            })
                .populate([
                    {
                        path: "tags",
                        model: "tag",
                        select: {tagName: 1, _id: 1},
                        match: {isActive: 1}
                    },
                    {
                        path: "assignee",
                        model: "user",
                        select: {fullname: 1, _id: 1},
                        match: {isActive: 1}
                    },
                ]).sort({_id: -1})
                .skip(skip).limit(limit)
            // console.log(allContacts);
            if (allContacts?.length > 0) {
                res.status(200).json({
                    message: "success",
                    allContacts: totalContacts?.length,
                    count: allContacts?.length,
                    data: allContacts,
                });
            } else {
                res.status(200).json({
                    message: "No Record Found",
                    data: [],
                });
            }
        } else {
            let allContacts = await Contact.find({createdBy: userId, isActive: 1}).populate([
                {
                    path: "tags",
                    model: "tag",
                    select: {tagName: 1, _id: 1},
                    match: {isActive: 1}
                },
                {
                    path: "assignee",
                    model: "user",
                    select: {fullname: 1, _id: 1},
                    match: {isActive: 1}
                },
            ]).sort({_id: -1})
                .skip(skip).limit(limit)
            // console.log(allContacts);
            if (allContacts?.length > 0) {
                res.status(200).json({
                    message: "success",
                    allContacts: totalContacts?.length,
                    count: allContacts?.length,
                    data: allContacts,
                });
            } else {
                res.status(200).json({
                    message: "No Record Found",
                    data: [],
                });
            }
        }

    } catch (err) {
        res.status(501).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};

module.exports.updateContact = async (req, res) => {
    try {
        const userId = req.user_id;
        const contact = await Contact.findOne({_id: req.params.id, createdBy: userId, isActive: 1});
        if (contact) {
            const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body);
            res.status(203).json({
                message: "success",
                data: updatedContact,
            });
        } else {
            res.status(200).json({
                message: "No Contact Found",
            });
        }
    } catch (err) {
        res.status(501).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};
//this route in not used anywhere
module.exports.deleteContact = async (req, res) => {
    try {
        // const userId = req.user_id;
        // const contact = await Contact.findOne({_id: req.params.id, createdBy: userId});
        const contact = await deleteContacts(req)
        if (contact) {
            // await Contact.findByIdAndUpdate(req.params.id, {isActive: 3});
            res.status(203).json({
                message: "Contact successfully Deleted",
                status: 'success'
            });
        } else {
            res.status(200).json({
                message: "No Contact Found",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            data: err.message,
        });
    }
};
module.exports.deleteContacts = async (req, res) => {
    console.log("--------------------> Delete Contact 1111 <-------------------------");
    try {
        const userId = req.user_id;
        const contacts = await Contact.find({_id: req.body.ids, createdBy: userId, isActive: 1});
        if (contacts) {
            // console.log("Ids List", req.body.ids);
            const ids = req.body.ids;
            console.log(ids);
            const contact = await Contact.updateMany({
                _id: {$in: ids},
                createdBy: userId
            }, {$set: {isActive: 3}}, {multi: true});
            if (contact) {
                return res.status(200).json({
                    message: "Successfully Deleted",
                });
            } else {
                return res.status(404).json({
                    message: 'Could not delete contacts in bulk'
                });
            }
        }

    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};
module.exports.addTagBulk = async (req, res, next) => {
    console.log("--------------------> addTagBulk <-------------------------");

    try {
        let updatedContact;
        const userId = req.user_id;
        // console.log("Data ----------> ", req.body);
        const ids = req.body.ids;
        let tags = req.body.tags;
        const contacts = await Contact.find({_id: ids, createdBy: userId, isActive: 1});
        // console.log(contacts)
        let tagIds = [];
        //find all tags, exist in the database if they are not then create them
        for (let tag of tags) {
            let foundTag = await Tag.findOne({tagName: tag, createdBy: userId, isActive: 1});
            if (foundTag) {
                tagIds.push(foundTag._id);
            }
            if (!foundTag) {
                let newTag = new Tag({tagName: tag, createdBy: userId});
                let tagRes = await newTag.save();
                if (tagRes) {
                    tagIds.push(tagRes._id);
                }
            }
        }

        tags = tagIds;

        for (let contact of contacts) {
            // console.log('entered first loop', contact.tags.length)
            if (contact.tags.length === 0) {
                // console.log('entered second')
                updatedContact = await Contact.updateOne({
                    _id: contact._id,
                    createdBy: userId
                }, {tags: tags}, {new: true});
            } else {
                const contactTagIds = await Contact.findOne({
                    _id: contact._id,
                    isActive: 1,
                    createdBy: userId
                }).select({tags: 1})
                console.log(contactTagIds)
                let arrayOfTags = contactTagIds.tags.map(e => {
                    return e
                })
                // console.log("before",arrayOfTags)
                arrayOfTags = arrayOfTags.concat(tagIds)
                // console.log("after",arrayOfTags)

                arrayOfTags = arrayOfTags.map(tag => {
                    return tag.toString();
                });
                let tags2 = [...new Set(arrayOfTags)];
                // console.log('after t2', tags2);
                tags2 = tags2.map(tag => {
                    return new ObjectId(tag);
                });
                updatedContact = await Contact.updateOne({
                    _id: contact._id,
                    createdBy: userId
                }, {tags: tags2}, {new: true});
            }
        }
        if (updatedContact) {
            res.status(200).json({
                message: "Successfully Tag added",
                data: updatedContact,
            });
        } else {
            res.status(404).json({
                message: "Record Not Found",
                data: null,
            });
        }
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};
module.exports.deleteTagBulk = async (req, res, next) => {
    console.log("--------------------> deleteTagBulk <-------------------------");
    try {
        const tags = req.body.tags;
        // console.log("Tags ----------------> ", tags);
        let updatedContact;
        const userId = req.user_id;
        const ids = req.body.ids;
        // console.log("Ids List  ----------->", ids);

        updatedContact = await Contact.updateMany({_id: {$in: ids}, createdBy: userId}, {$pullAll: {tags: tags}});

        // console.log("---------",updatedContact)
        if (updatedContact) {
            res.status(200).json({
                message: "Successfully Tag Deleted",
                data: updatedContact,
            });
        } else {
            res.status(404).json({
                message: "Record Not Found",
                data: null,
            });
        }
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};
module.exports.addAssignee = async (req, res, next) => {
    try {
        const user = req.body.userId;
        // console.log("User--------->", user);
        let updatedContact;

        const ids = req.body.ids;
        // console.log("Ids List", ids);

        updatedContact = await Contact.updateMany(
            {_id: {$in: ids}},
            {$set: {assignee: mongoose.Types.ObjectId(user)}},
            {multi: true, new: true}
        );

        // console.log("---------",updatedContact)
        if (updatedContact) {
            res.status(200).json({
                message: "Assignee added Successfully",
                data: updatedContact,
            });
        } else {
            res.status(404).json({
                message: "Record Not Found",
                data: null,
            });
        }
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};
module.exports.removeAssignee = async (req, res, next) => {
    try {
        let updatedContact;
        const ids = req.body.ids;
        console.log("Ids List", ids);

        updatedContact = await Contact.updateMany({_id: {$in: ids}}, {$set: {assignee: null}}, {
            multi: true,
            new: true
        });

        // console.log("---------",updatedContact)
        if (updatedContact) {
            res.status(200).json({
                message: "Assignee Deleted Successfully",
                data: updatedContact,
            });
        } else {
            res.status(404).json({
                message: "Record Not Found",
                data: null,
            });
        }
    } catch (err) {
        console.log("Error", err);
        res.status(501).json({
            message: "Internal Server Error",
        });
    }
};

//These two functions have been replaced by getAllContactsWithNameSearch

// module.exports.getAllContacts = async (req, res) => {
//     // const userId= req.user_id;
//
//     try {
//         const userId = req.user_id;
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         // console.log(userId)
//         let allContacts = await Contact.find({ createdBy: userId, isActive: 1 }).populate([
//             {
//                 path: "tags",
//                 model: "tag",
//                 select: { tagName: 1, _id: 1 },
//                 match: { isActive: 1 }
//             },
//             {
//                 path: "assignee",
//                 model: "user",
//                 select: { fullname: 1, _id: 1 },
//                 match: { isActive: 1 }
//             },
//         ]).skip(skip).limit(limit)
//         // console.log(allContacts);
//         if (allContacts?.length > 0) {
//             res.status(200).json({
//                 message: "success",
//                 count: allContacts?.length,
//                 data: allContacts,
//             });
//         } else {
//             res.status(200).json({
//                 message: "No Record Found",
//                 data: [],
//             });
//         }
//     } catch (err) {
//         res.status(501).json({
//             message: "Internal Server Error",
//             data: err.message,
//         });
//     }
// };

// module.exports.searchContact = async (req, res, next) => {
//     try {
//         const id = req.user_id
//         const letter = req.body.letter
//
//         const page = req.body.page
//         const limit = req.body.limit
//
//         const skip = page * limit - limit
//         // option "i" will make in case-insensitive
//         const contacts = await Contact.find({createdBy: id, isActive: 1, "name": {"$regex": letter, "$options": "i"}}).populate([
//             {
//                 path: "tags",
//                 model: "tag",
//                 select: { tagName: 1, _id: 1 },
//                 match: { isActive: 1 }
//             },
//             {
//                 path: "assignee",
//                 model: "user",
//                 select: { fullname: 1, _id: 1 },
//                 match: { isActive: 1 }
//             },
//         ]).skip(skip).limit(limit)
//
//         if (contacts) {
//             return res.status(200).json({
//                 message: 'Success: List of Contacts is',
//                 count: contacts?.length,
//                 data: contacts
//             })
//         } else {
//             return res.status(404).json({
//                 message: 'Orders not found',
//                 data: null
//             })
//         }
//
//     } catch (e) {
//         console.log('Error ', e)
//         return res.status(501).json({
//             message: "Error Occurred"
//         })
//     }
// }

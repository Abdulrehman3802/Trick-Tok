const Tag = require('../../models/tags/tag.model')
const {createTagChatDaddy, getAllTagsCD} = require("../../../chatdaddy");

module.exports.createTag = async (req, res, next) => {
    try {
        const tag = await Tag.create({
            ...req.body,
            createdBy: req.user_id
        })
        if (tag) {
            console.log('in createTag', tag)
            const Chtags = await createTagChatDaddy(req, res, tag)
            console.log(Chtags)
            return res.status(201).json({
                message: 'Tag Created Successfully',
                data: tag,
                chTag: Chtags.statusText
            })
        } else {
            return res.status(404).json({
                message: 'Tag not found',
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred",
            data: e
        })
    }
}

module.exports.allTagsWithSearch = async (req, res, next) => {
    try {
        const user_id = req.user_id
        const letter = req.body?.letter

        if (letter) {
            const tags = await Tag.find({
                createdBy: user_id,
                isActive: 1,
                "tagName": {"$regex": letter, "$options": "i"},
            })
            if (tags && tags.length > 0) {
                return res.status(200).json({
                    message: 'found',
                    flag: true,
                    data: tags
                })
            } else {
                return res.status(200).json({
                    message: 'Tags not found with this user',
                    flag: false,
                    data: []
                })
            }
        }
        const tags = await Tag.find({createdBy: user_id, isActive: 1});
        if (tags && tags.length > 0) {
            return res.status(200).json({
                message: 'found',
                flag: true,
                data: tags
            })
        } else {
            return res.status(404).json({
                message: 'Tags not found with this user',
                flag: false,
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}
// This Route is not used anymore!!!!!!!!
module.exports.activeTags = async (req, res, next) => {
    try {
        const tags = await Tag.find({isActive: 1});

        if (tags) {
            return res.status(200).json({
                message: 'found',
                data: tags
            })
        } else {
            return res.status(404).json({
                message: 'Tags not found',
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.viewOneTag = async (req, res, next) => {
    try {
        const id = req.params.id
        const tag = await Tag.findOne({_id: id, createdBy: req.user_id});

        if (tag) {
            return res.status(200).json({
                message: 'found',
                data: tag
            })
        } else {
            return res.status(404).json({
                message: 'Tag not found with this user',
                data: null
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.updateTag = async (req, res, next) => {
    try {
        const id = req.params.id
        let tagResponse = await Tag.findOneAndUpdate({_id: id, createdBy: req.user_id}, req.body, {new: true})

        if (tagResponse) {
            return res.status(200).json({
                message: "Successfully updated",
                data: tagResponse
            })
        } else {
            return res.status(404).json({
                message: `No Tag Found with id ${req.body.id} or with this user ${req.user_id} `
            })
        }

    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.deleteTag = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleteTag = await Tag.findOneAndUpdate({_id: id, createdBy: req.user_id}, {isActive: 3}, {new: true})
        if (deleteTag) {
            return res.status(200).json({
                message: 'Deleted Successfully',
                data: deleteTag
            })
        } else {
            return res.status(404).json({
                message: 'No Record Found with this user',
                data: []
            })
        }
    } catch (e) {
        console.log('Error ', e)
        return res.status(501).json({
            message: "Error Occurred"
        })
    }
}

module.exports.getTagsByName = async (req, res) => {
    try {
        const tags = await Tag.find({
            "tagName": {"$regex": req.query.name, "$options": "i"},
            "createdBy": req.user_id
        });

        if (tags?.length > 0) {
            return res.status(200).json({
                message: 'Found Successfully',
                data: tags
            })
        } else {
            return res.status(404).json({
                message: 'No Record Found',
                data: []
            })
        }
    } catch (err) {
        console.log('Error ', err)
        return res.status(501).json({
            message: "Error Occurred",
            error: err.message
        })
    }
}

module.exports.getAllTagsCD = async (req, res, next) => {

        try{
            const tags = await getAllTagsCD(req, res)
            if(tags){
                console.log(tags)
                res.status(200).json({
                    message: "Success",
                    data : tags.data
                })
            }

        }
        catch(err) {
        console.log(err)
        res.status(500).json({err})
    }
}

// const sanitizeHtml = require("sanitize-html");
const mongoose = require("mongoose")

const Scribble = require("../models/scribble");
const HttpError = require("../utils/HttpError");
const Star = require("../models/star");

const MAX_LIMIT = 6, DEFAULT_PAGE = 1;


module.exports.createNewScribble = async (req, res, next) => {
    let newScribble, title, description;
    try {
        title = req.body.title;
        description = req.body.description;

        newScribble = new Scribble({
            title,
            description,
            html: '',
            css: '',
            js: '',
            forkedFrom: null,
            author: req.userData.userId
        })

        await newScribble.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, "Error creating new scribble"));
    }

    res.status(201).json({ scribble: newScribble });
}

module.exports.getScribbles = async (req, res, next) => {
    let scribbles;
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    // if limit is not defined or exceeds max limit then assign max limit
    limit = !limit || (limit > MAX_LIMIT) ? MAX_LIMIT : limit;
    // if page is not defined then assign default value
    page = !page || page < 1 ? DEFAULT_PAGE : page;

    try {
        // scribbles = await Scribble.find({})
        //     .select('-__v')
        //     .sort({ createdAt: -1 })
        //     .limit(limit)
        //     .skip((page - 1) * limit)
        //     .populate('author', '-password -createdAt -__v');

        scribbles = await Scribble.aggregate([
            {
                $lookup: {
                    from: 'stars',
                    localField: '_id',
                    foreignField: 'scribble',
                    as: 'stars'
                },
            },
            {
                $lookup: {
                    from: 'users', // Use the name of the users collection
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorData',
                },
            },
            {
                $unwind: '$authorData'
            },
            {
                $addFields: {
                    starCount: { $size: '$stars' },
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },

            {
                $project: {
                    stars: 0,
                    'authorData.password': 0
                }
            }
        ])

        console.log(scribbles)

        if (scribbles.length == 0) {
            return next(new HttpError(404, "Scribbles not found"));
        }
    } catch (err) {
        return next(new HttpError(500, "Error fetching scribbles"));
    }

    res.status(200).json({ scribbles })
}

module.exports.searchScribbles = async (req, res, next) => {
    let scribbles;
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let term = req.query.term;
    limit = !limit || (limit > MAX_LIMIT) ? MAX_LIMIT : limit;
    page = !page || page < 1 ? DEFAULT_PAGE : page;

    if (!term) {
        return next(new HttpError(404, "Not found"));
    }

    try {
        scribbles = await Scribble.aggregate([
            {
                $match: {
                    title: {
                        $regex: term,
                        $options: 'i',
                    },
                }
            },
            {
                $lookup: {
                    from: 'stars',
                    localField: '_id',
                    foreignField: 'scribble',
                    as: 'stars'
                },
            },
            {
                $lookup: {
                    from: 'users', // Use the name of the users collection
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorData',
                },
            },
            {
                $unwind: '$authorData'
            },
            {
                $addFields: {
                    starCount: { $size: '$stars' },
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },

            {
                $project: {
                    stars: 0,
                    'authorData.password': 0
                }
            }
        ])
        if (scribbles.length == 0) {
            return next(new HttpError(404, "Scribbles not found"));
        }
    } catch (err) {
        return next(new HttpError(500, "Error fetching scribbles"));
    }

    res.status(200).json({ scribbles })

}

module.exports.updateScribble = async (req, res, next) => {
    let targetScribble;
    const { scribbleId } = req.params;
    const { title, description } = req.body;
    try {
        targetScribble = await Scribble.findById(scribbleId)
        if (!targetScribble) {
            return next(new HttpError(404, "Scribble Not found , update failed"));
        }

        // check if the current user is the author
        if (targetScribble.author.toString() !== req.userData.userId) {
            return next(new HttpError(401, "You are not authorized to do that"));
        }
        targetScribble.title = title;
        targetScribble.description = description;

        await targetScribble.save();
    } catch (err) {
        return next(new HttpError(500, "Error while updating data"));
    }

    res.status(200).json({
        updateScribble: {
            _id: targetScribble._id,
            title: targetScribble.title,
            description: targetScribble.description
        }
    })
}

module.exports.deleteScribble = async (req, res, next) => {
    const { scribbleId } = req.params
    let targetScribble;
    try {
        targetScribble = await Scribble.findById(scribbleId);

        if (!targetScribble) {
            return next(new HttpError(404, "Scribble Not found , delete failed"));
        }

        if (targetScribble.author.toString() !== req.userData.userId) {
            return next(new HttpError(401, "You are not authorized to do that"));
        }
        // proceed with deletion
        await Scribble.findByIdAndDelete(scribbleId);
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, "Error while deleting data"));
    }

    res.status(200).json({ message: 'Deleted successfully' });
}

module.exports.getScribbleById = async (req, res, next) => {
    let scribble;
    const { scribbleId } = req.params;
    try {
        // scribble = await Scribble.findById(scribbleId).populate('author', '-password -createdAt -__v');
        scribble = await Scribble.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(scribbleId)
                }
            },
            {
                $lookup: {
                    from: 'stars',
                    localField: '_id',
                    foreignField: 'scribble',
                    as: 'stars'
                },
            },
            {
                $lookup: {
                    from: 'users', // Use the name of the users collection
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorData',
                },
            },
            {
                $unwind: '$authorData'
            },
            {
                $addFields: {
                    starCount: { $size: '$stars' },
                }
            },
            {
                $project: {
                    stars: 0,
                    'authorData.password': 0
                }
            }
        ])
        if (scribble.length == 0) {
            return next(new HttpError(404, "Scribble not found"));
        }
    } catch (err) {
        console.log(err)
        return next(new HttpError(500, "Error while fetching data"));
    }
    res.status(200).json({ scribble: { ...scribble[0] } });
}

module.exports.updateCode = async (req, res, next) => {
    const { scribbleId } = req.params;
    const { key, body } = req.body;
    let targetScribble;
    try {
        targetScribble = await Scribble.findById(scribbleId);
        if (!targetScribble) {
            return next(new HttpError(404, "Scribble Not Found"));
        }

        if (targetScribble.author.toString() !== req.userData.userId) {
            return next(new HttpError(401, "You are not authorized to do that"));
        }

        // sanitized with default options (play around with options later)
        // sanitizedBody = sanitizeHtml(body);

        // update
        targetScribble[key] = body;
        await targetScribble.save();

    } catch (err) {
        console.log(err);
        return next(new HttpError(500, "Error while saving"));
    }

    res.status(200).json({ message: 'Saved successfully' })
}

module.exports.forkScribble = async (req, res, next) => {
    const { scribbleId } = req.params;
    let scribble, newScribble;
    try {
        scribble = await Scribble.findById(scribbleId);
        // create a copy and delete necessary fields
        let copiedScribble = { ...scribble.toObject() };
        delete copiedScribble._id;
        delete copiedScribble.createdAt;
        delete copiedScribble.lastEditedAt;

        const convertedId = new mongoose.Types.ObjectId(scribbleId)

        newScribble = new Scribble({
            ...copiedScribble,
            author: req.userData.userId,
            forkedFrom: convertedId
        })
        await newScribble.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, "Couldn't fork scribble"));
    }

    res.status(201).json({ scribbleId: newScribble._id, message: 'Fork successful' });

}

module.exports.getScribblesByUserId = async (req, res, next) => {
    const { userId } = req.params;

    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    // if limit is not defined or exceeds max limit then assign max limit
    limit = !limit || (limit > MAX_LIMIT) ? MAX_LIMIT : limit;
    // if page is not defined then assign default value
    page = !page || page < 1 ? DEFAULT_PAGE : page;
    let scribbles;
    try {
        scribbles = await Scribble.aggregate([
            {
                $match: {
                    author: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'stars',
                    localField: '_id',
                    foreignField: 'scribble',
                    as: 'stars'
                },
            },
            {
                $lookup: {
                    from: 'users', // Use the name of the users collection
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorData',
                },
            },
            {
                $unwind: '$authorData'
            },
            {
                $addFields: {
                    starCount: { $size: '$stars' },
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },

            {
                $project: {
                    stars: 0,
                    'authorData.password': 0
                }
            }
        ])
        if (!scribbles) {
            return next(new HttpError(404, 'No data found'));
        }
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, "Server error"));
    }

    res.status(200).json({ scribbles });
}

module.exports.toggleStar = async (req, res, next) => {
    const { scribbleId } = req.params;
    try {
        const scribble = await Scribble.findById(scribbleId);
        if (!scribble) {
            return next(new HttpError(404, "Scribble not found"));
        }

        const star = await Star.findOne({
            user: req.userData.userId,
            scribble: scribbleId
        })

        // if we found it then delete it
        if (star) {
            await Star.deleteOne({
                user: req.userData.userId,
                scribble: scribbleId
            })

            return res.status(200).json({
                message: 'Unstarred successfully'
            })
        } else {
            // create a new star if we don't have one yet
            const star = new Star({
                user: req.userData.userId,
                scribble: scribbleId
            })

            await star.save();

            return res.status(201).json({
                message: 'Starred successfully'
            })
        }


    } catch (err) {
        next(new HttpError(500, "Server error"));
    }
}

module.exports.hasUserStarred = async(req , res , next) =>{
    let star;
    const {scribbleId} = req.params;
    try{
        star = await Star.findOne({
            user : req.userData.userId,
            scribble : scribbleId
        })

        if(star){
            return res.status(200).json({
                hasStarred : true
            })
        }
    }catch(err){
        return next(new HttpError(500))
    }

    return res.status(200).json({
        hasStarred : false
    })
}
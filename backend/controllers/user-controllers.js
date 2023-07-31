const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require("../models/user");
const Scribble = require("../models/scribble");
const HttpError = require("../utils/HttpError");

const SALT_ROUNDS = 12;
const SECRET_KEY = 's12kez90Yo0qpo33#77@Zzx[0_0]{zxaZ';

module.exports.signup = async (req, res, next) => {

    let createdUser;
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return next(new HttpError(409, 'Email already in use'));
        }

        // if no account found with given email then proceed with 
        let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        createdUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await createdUser.save();

    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Error encountered during signup'));
    }

    // log in the user

    let token;
    try {

        token = jwt.sign(
            {
                userId: createdUser.id,
                email: createdUser.email
            },
            SECRET_KEY,

        );
    } catch (err) {
        console.log(err);
        return next(500, 'Error logging you in , try again');
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
    });
}


module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    let foundUser, isValidPassword = false;
    try {
        foundUser = await User.findOne({ email });
        if (!foundUser) {
            return next(new HttpError(401, 'Invalid credentials'));
        }
        isValidPassword = await bcrypt.compare(password, foundUser.password);
    } catch (err) {
        return next(new HttpError(500, "Error while logging in"));
    }

    if (!isValidPassword) {
        return next(new HttpError(401, 'Invalid credentials [pass]'));
    }

    // log in / sign token
    let token;
    try {

        token = jwt.sign(
            {
                userId: foundUser.id,
                email: foundUser.email
            },
            SECRET_KEY,


        );
    } catch (err) {
        return next(500, 'Log in failed');
    }



    res.status(200).json(
        {
            userId: foundUser.id,
            email: foundUser.email,
            token: token
        }
    )
}


module.exports.getUserProfile = async (req, res, next) => {
    const { userId } = req.params;
    let user , scribbleCount;
    try {
        user = await User.findById(userId, '-password');
        if (!user) {
            return next(new HttpError(404, 'User not found'));
        }
        scribbleCount = await Scribble.countDocuments({author : userId});
    } catch (err) {
        return next(new HttpError(500, 'Server error'));
    }

    // res.status(200).json({user : { ...user , scribbleCount }});
    res.status(200).json({user : {
        _id : user._id,
        name : user.name,
        email : user.email,
        scribbleCount
    }});
}
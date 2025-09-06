import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Ensure your user model is correct

import multer from "multer";

import path from "path";
// Use environment variable or fallback
const secretCryptoKey = "jwtSecretKey";

// ✅ Validate required and non-required fields
export const vaildObject = async (required, non_required, res) => {
    let empty = [];

    for (let key in required) {
        if (required.hasOwnProperty(key)) {
            if (required[key] === undefined || required[key] === '') {
                empty.push(key);
            }
        }
    }

    if (empty.length !== 0) {
        const msg = empty.toString() + (empty.length > 1 ? " fields are required" : " field is required");
        res.status(400).json({
            success: false,
            msg: msg,
            code: 400,
            body: {}
        });
        return;
    } else {
        if (required.hasOwnProperty('security_key') && required.security_key !== "") {
            const msg = "Invalid security key";
            res.status(403).json({
                success: false,
                msg: msg,
                code: 403,
                body: []
            });
            return false;
        }
        const merged_object = Object.assign(required, non_required);
        delete merged_object.checkexit;

        for (let data in merged_object) {
            if (merged_object[data] === undefined) {
                delete merged_object[data];
            } else if (typeof merged_object[data] === 'string') {
                merged_object[data] = merged_object[data].trim();
            }
        }

        return merged_object;
    }
};

// ✅ Return current Unix timestamp
export const unixTimestamp = () => {
    return Math.floor(Date.now() / 1000);
};

// ✅ JWT Authentication Middleware
export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, secretCryptoKey, async (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }

            try {
                const existingUser = await User.findOne({
                    _id: payload.data._id,
                    loginTime: payload.data.loginTime,
                  
                });

                if (existingUser) {
                    req.user = existingUser;
                    next();
                } else {
                    res.sendStatus(403);
                }
            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    } else {
        res.sendStatus(403);
    }
};

// ✅ JWT User Verification Middleware
export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, secretCryptoKey, async (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }

            try {
                const existingUser = await User.findOne({
                    _id: payload.data._id,
                    loginTime: payload.data.loginTime,
                });

                if (existingUser) {
                    req.user = existingUser;
                    next();
                } else {
                    res.sendStatus(401);
                }
            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    } else {
        res.sendStatus(401);
    }
};

// ✅ Success Response Utility
export const success = (res, message, body = {}) => {
    return res.status(200).json({
        success: 1,
        code: 200,
        message: message,
        body: body
    });
};

// ✅ Error Response Utility
export const error = (res, err, body = {}) => {
    console.error(err, '===========================> error');
    const code = typeof err === 'object' ? (err.code || 400) : 400;
    const message = typeof err === 'object' ? (err.message || '') : err;
    res.status(code).json({
        success: false,
        code: code,
        message: message,
        body: body
    });
};

// ✅ 401 Error Response Utility
export const error401 = (res, err, body = {}) => {
    const message = typeof err === 'object' ? (err.message || '') : err;
    const code = 401;
    res.status(code).json({
        success: false,
        code: code,
        message: message,
        body: body
    });
};


const storage = multer.diskStorage({
    destination: function(req,files,cb) {
        cb(null,'./uploads')
    },
    filename:function(req,files,cb){
        const newFileName - Date.now() + Path2D.extname(file.originalname)
        cb(null, newFileName)
    }
})

const fileFilter = (req,file,cb) => {
    if( file.mimetype.startWith('image/')|| file.mimetype('image/png')){
cb(null,true)
    }else{
        cb(null,Error('Only images are allowed'), false)
    }
}

const uploads = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5;
    },
    fileFilter:fileFilter
})


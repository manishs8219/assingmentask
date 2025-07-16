import User from '../models/user.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import  { vaildObject, success, error, unixTimestamp } from '../helpers/helper.js';


const saltRounds = 10;
const secretCryptoKey = "jwtSecretKey";

export const signup = async (req, res) => {
    try {
        const required = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        const nonRequired = {
           
            role: req.body.role,
        };

        const getdata = await vaildObject(required, nonRequired, res);

          

        const existingUser = await User.findOne({ email: getdata.email });
        if (existingUser) {
            return success(res, "This email already exists. Please use another email.", existingUser);
        }

        const hashedPassword = await bcrypt.hashSync(getdata.password, saltRounds);

        const newUser = await User.create({
            name: getdata.name,
            email: getdata.email,
            password: hashedPassword,
           
            role: getdata.role || 'user',
        });

        return success(res, "SignUp Successfully", newUser);
    } catch (err) {
        return error(res, error.message || error);
    }
};

export const login = async (req, res) => {
    try {
        const required = {
            email: req.body.email,
            password: req.body.password,
        };
        const nonRequired = {};

        const getdata = await vaildObject(required, nonRequired, res);

        const user = await User.findOne({ email: getdata.email });
        if (!user) {
            return error(res, 'User not found');
        }

        const isPasswordMatch = await bcrypt.compare(getdata.password, user.password);
        if (!isPasswordMatch) {
            return error(res, 'Incorrect email or password');
        }

        const time = unixTimestamp();

        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    loginTime: time,
                    
                },
            }
        );

        const token = jwt.sign(
            {
                data: {
                    _id: user._id,
                    email: user.email,
                    loginTime: time,
                   
                },
            },
            secretCryptoKey,
            { expiresIn: "365d" }
        );

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          
            token: token,
        };

        return success(res, 'Login Successfully', userResponse);
    } catch (err) {
        return error(res, err);
    }
};

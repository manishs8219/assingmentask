import categoryDB from "../models/category.js";
import  { vaildObject, success, error } from '../helpers/helper.js';

export const addCategory = async (req,res) => {
    try {
        
        const required = {
            name:req.body.name
        }

        const nonRequired = {}

        const getData = await vaildObject(required,nonRequired,res)

        if(!getData){
            return
        }

        const addData = await categoryDB.create({
            name:getData.name
        })

        return success(res,"Add category successfully",addData)
    } catch (err) {
        return error(res,err)
    }
}

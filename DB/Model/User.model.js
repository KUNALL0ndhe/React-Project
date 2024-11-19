import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        usename : {
            type: String,
            required: true,
            unique: true,
        },
        email : {
            type: String,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
            unique: true
        }
    }, {
        timestamps:true
    });

export const User = mongoose.model("User", UserSchema)
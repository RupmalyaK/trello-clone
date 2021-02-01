import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxLength:30,
        minlength:1,
    },
    users:{
        type: [{ type: Schema.Types.ObjectId, ref: "user" }],
        required:true,
    },
    colorIndex:{
        type:Number,
        default:0,
        max:8,
    },
    description:{
        type:String,
        maxLength:240,
        minLength:0,
        default:"",
    },
    typeIndex:{
        type:Number,
        default:0,
        max:3,
    },
    },{timestamps:true});
    
export default mongoose.model("task",taskSchema);
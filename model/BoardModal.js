import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
name:{
    type:String,
    required:true,
    maxLength:30,
    minlength:3,
},
users:{
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    default: [],
},
colorIndex:{
    type:Number,
    default:0,
    max:8,
},
typeIndex:{
    type:Number,
    default:0,
    max:3,
}
});

const boardsSchema = new Schema({
    users:{
        type: [{ type: Schema.Types.ObjectId, ref: "user" }],
        default: [],
    },
    name:{
        type:String,
        required:true,
        maxLength:30,
        minlength:3,
    },
    colorIndex:{
        type:Number,
        default:0,
        max:8,
    },
    toDoTasks:{
        type:[taskSchema],
        default:[],
    },
    inDevelopmentTasks:{
        type:[taskSchema],
        default:[],
    },
    toBeReviewedTasks:{
        type:[taskSchema],
        default:[],
    },
    finishedTasks:{
        type:[taskSchema],
        default:[],
    },
    categoryIndex:{
        type:[Number],
        default:[0,1,2,3],
    },
    starred:{
        type:Boolean,
        default:false,
    }
});


export default mongoose.model("board",boardsSchema)
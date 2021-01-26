import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {

    displayName: {
      type: String,
      maxLength: 20,
      required: true,
    },
    email: {
      type: String,
      maxLength: 32,
      required: true,
    },
    userName:{
      type:String,
      //required:true,
    },
    password: {
      type: String,
      maxLength: 32,
      required: true,
    },
    colorIndex:{
      type:Number,
      max:8,
      default:0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);

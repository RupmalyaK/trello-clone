import UserModel from "../model/UserModel.js";
import { isAuthenticated } from "../controller/authController.js";
import { Router } from "express";
import mongoose from "mongoose";



const router = Router();


router.get("/search/:searchString",/* isAuthenticated,*/ async (req, res, next) => {
  const { searchString } = req.params;
  try {
    if (!searchString) {
      res.status(200).json([]);
      return;
    }
    const users = await UserModel.find({
      userName: { $regex: new RegExp(searchString, "i") },
    });

    const startWith = [];
    const notStartWith = [];
    users.forEach((user) => {
      if (user.userName.match(new RegExp(`^${searchString}`, "i"))) {
        startWith.push(user);
      } else {
        notStartWith.push(user);
      }
    });
    const allUsers = [...startWith, ...notStartWith];
    res.status(200).json(allUsers.slice(0, 10));
  } catch (err) {
   // console.log(err);
    next(err);
  }
});








export default router;

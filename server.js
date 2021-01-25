import express from "express";
import cors from "cors";
import path from "path";
import dotEnv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import bodyParser from "body-parser";
import boardRouter from "./routes/boardsRoute.js";
import taskRouter from "./routes/taskRoute.js";

if (process.env.NODE_ENV !== "production") {
    dotEnv.config();
}

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cors());

/*EXPRESS ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/boards", boardRouter);
app.use("/api/tasks",taskRouter);

/**Static files*/

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}

//Error Handling
app.use(function (req, res) {
    res.type('json');
    res.send({ errors: res.errors });
})





/*STARTING APP*/
app.listen(port, err => {
    if (err) {
        throw err;
    }
    console.log("server running on port ", + port);
});

/*MONGOOSE CONFIG*/
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "trello-db" });
        const db = mongoose.connection;
        db.on("error", err => {
            throw error;
        });
    }
    catch (error) {
        console.log("MONGODB ERROR: ", error);
    }
})();










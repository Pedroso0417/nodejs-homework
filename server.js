import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`server is running.use our API on ${PORT}`)
    );
    console.log("Database connection successful");
  })

  .catch((error) => {
    console.log(`Server not running. error message: ${error.message}`);
  });

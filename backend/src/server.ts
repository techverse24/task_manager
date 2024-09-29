import { config } from "dotenv";
import app from "./app";
import { connectDB } from "./config/database";

config();

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV}`);
});

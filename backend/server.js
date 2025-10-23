import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const corsOptions = {
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "7mb" })); // parse JSON request bodies
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend","dist");
  
  console.log("========================================");
  console.log("__dirname:", __dirname);
  console.log("Frontend path:", frontendPath);
  console.log("Does dist exist?", fs.existsSync(frontendPath));
  if (fs.existsSync(frontendPath)) {
    console.log("Files in dist:", fs.readdirSync(frontendPath));
    
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.error("⚠️ Frontend dist folder not found! Build may have failed.");
    app.get("*", (req, res) => {
      res.status(503).send("Frontend not built. Check build logs.");
    });
  }
  console.log("========================================");
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});

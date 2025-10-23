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

if (process.env.NODE_ENV !== "production") {
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
		})
	);
}

app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

if (process.env.NODE_ENV === "production") {
  // Get project root (go up from backend directory)
  const projectRoot = path.resolve(__dirname, "..");
  const frontendPath = path.join(projectRoot, "frontend", "dist");
  
  console.log("========================================");
  console.log("__dirname:", __dirname);
  console.log("Project root:", projectRoot);
  console.log("Frontend path:", frontendPath);
  console.log("Does dist exist?", fs.existsSync(frontendPath));
  if (fs.existsSync(frontendPath)) {
    console.log("Files in dist:", fs.readdirSync(frontendPath));
  }
  console.log("========================================");
  
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const clientRouter = require("./routes/clientRoutes");
const projectRouter = require("./routes/projectRoutes");
const taskRouter = require("./routes/taskRoutes");
const taskDetailRouter = require("./routes/taskDetailRoutes");
const { requireSession } = require("./middleware/auth");

const commentRoutes = require("./routes/commentRoutes");
const fileRoutes = require("./routes/fileRoutes");
const fileDetailRoutes = require("./routes/fileDetailRoutes");
const timeEntryRoutes = require("./routes/timeEntryRoutes")
const inviteRoutes = require("./routes/inviteRoutes");
const membershipRoutes = require("./routes/membershipRoutes")
// Importing this now just proves every model file compiles and
// registers with Mongoose without errors - this is our checkpoint for
// Step 2 before we move on to auth and routes.
require("./models");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/clients",clientRouter)
app.use("/api/projects",projectRouter)
app.use("/api/projects/:projectId/tasks", requireSession, taskRouter);
app.use("/api/tasks", requireSession, taskDetailRouter);
app.use("/api/tasks/:taskId/comments", requireSession, commentRoutes);
app.use("/api/tasks/:taskId/files", requireSession, fileRoutes);
app.use("/api/files", requireSession, fileDetailRoutes);
app.use("/api/tasks/:taskId/time-entries", requireSession, timeEntryRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/memberships", requireSession, membershipRoutes)


app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "AgencyDesk API is running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
})


const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

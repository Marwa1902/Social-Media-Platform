// app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const messageRoute = require("./routes/messages");
const http = require("http"); // Require HTTP module for Socket.IO
const socketIo = require("socket.io"); // Require socket.io module

dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

connectToDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/messages", messageRoute);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to homepage");
});

// Start server
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
    console.log(`Server is alive and running on port ${PORT}`);
});

// Set up Socket.IO
const io = socketIo(server);

// Socket.IO event handlers
io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle receiving and broadcasting messages
    socket.on("sendMessage", (message) => {
        console.log("Message received:", message);
        io.emit("receiveMessage", message); // Broadcast the message to all connected clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

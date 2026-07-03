module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // 1. حدث انضمام مستخدم
        socket.on("chat:join", (data) => {
            socket.username = data.username;
            console.log(`${data.username} joined the room`);
            socket.broadcast.emit("chat:message", { 
                username: "System", 
                text: `${data.username} has joined the chat` 
            });
        });

        // 2. حدث إرسال واستقبال الرسائل
        socket.on("chat:message", (data) => {
            io.emit("chat:message", {
                username: socket.username || data.username || "Anonymous",
                text: data.text
            });
        });

        // 3. حدث مؤشر الكتابة
        socket.on("chat:typing", (data) => {
            socket.broadcast.emit("chat:typing", {
                username: socket.username,
                isTyping: data.isTyping
            });
        });

        // 4. حدث قطع الاتصال المدمج
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            if (socket.username) {
                io.emit("chat:message", { 
                    username: "System", 
                    text: `${socket.username} has left the chat` 
                });
            }
        });
    });
};

//импорты
const express = require('express'); //подключаем express - создает http сервер
const http = require('http'); //для связи express с  socket.io
const { Server } = require('socket.io'); //Server - класс, websocket сервера

//инициализация
const app = express(); //приложение
const server = http.createServer(app); //сервер

//подключение
const io = new Server(server, {
    //безопасность, разрешение на подключение
    cors: {
        origin: "*",
    }
});

/*вызывается при подключении клиента
socket - конкретный пользователь*/
io.on('connection', (socket) => {
    console.log("User connected", socket.id);

    socket.on('message', (msg) => {
        console.log('Mwssage:', msg);
        io.emit('message', msg);
    })

    socket.on('disconnect', (socket) => {
        console.log("User disconnected");
    })
})

//запуск сервера
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
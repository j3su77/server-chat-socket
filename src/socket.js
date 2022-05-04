"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const logger_1 = __importDefault(require("./utils/logger"));
const EVENTS = {
    connection: "connection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
    },
};
const rooms = {};
function socket({ io }) {
    logger_1.default.info(`Sockets enabled`);
    io.on(EVENTS.connection, (socket) => {
        logger_1.default.info(`User connected ${socket.id}`);
        socket.emit(EVENTS.SERVER.ROOMS, rooms);
        /*
         * When a user creates a new room
         */
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
            console.log({ roomName });
            // create a roomId
            const roomId = (0, nanoid_1.nanoid)();
            // add a new room to the rooms object
            rooms[roomId] = {
                name: roomName,
            };
            socket.join(roomId);
            // broadcast an event saying there is a new room
            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
            // emit back to the room creator with all the rooms
            socket.emit(EVENTS.SERVER.ROOMS, rooms);
            // emit event back the room creator saying they have joined a room
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
        });
        /*
         * When a user sends a room message
         */
        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {
            const date = new Date();
            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
                message,
                username,
                time: `${date.getHours()}:${date.getMinutes()}`,
            });
        });
        /*
         * When a user joins a room
         */
        socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
        });
    });
}
exports.default = socket;

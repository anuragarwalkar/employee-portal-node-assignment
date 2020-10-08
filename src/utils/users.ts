import { Server, Socket } from 'socket.io';
import usersModel from '../models/user';
import { User } from '../shared/models/user.model';

let users: User[] = [];
const onlineUsers: { [key: string]: boolean } = { }

export const removeUser = (userId: string): User => {
    let removedUser: any;
    for (let [index, client] of users.entries()) {
        if (client.userId === userId) {
            client.isOnline = false;
            delete onlineUsers[userId]
            removedUser = client;
            users.splice(index, 1);
            break;
        }
    }

    return removedUser;
}

export const getUserById = (userId: string): User | undefined => {
    return users.find(user => {
        return user.userId === userId
    })
}

export const joinUser = async (userId: string) => {
    const existingUser = getUserById(userId);
    let user: any = null;

    if (!existingUser) {
        user = await usersModel.findById(userId).lean();
        user.userId = user._id.toString();
        user.isOnline = true;
        delete user.password;
        delete user._id

        users.push(user);
        onlineUsers[userId] = true;
    }

    return existingUser ? existingUser : user;
}

export const getIsUserOnline = (userId: string) => {
    return onlineUsers[userId] === true;
}

export const dissconnectUser = (socket: Socket, io: Server) => {
    return () => {
    const userId = socket.handshake.query.userId;
    const removedUser = removeUser(userId);
    io.emit('diconnectedUser', removedUser);
    console.log('disconnected client:', userId);
    }
}

export const forceDisconnectUser = (socket: Socket, io: Server) => {
    return () => {
        const userId = socket.handshake.query.userId;
        dissconnectUser(userId, io);
        socket.disconnect();
    }
}
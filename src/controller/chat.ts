import chatModel from '../models/chat';

export const insertChatToDb = async (sender: string, recipient: string, message: string) => {
    return chatModel.create({sender, recipient, message});
}
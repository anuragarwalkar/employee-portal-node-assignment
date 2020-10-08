import mongoose from 'mongoose';
const { Types: { ObjectId } } = mongoose;

export const getAllUsers= (userId: string) => {
    return [
        {
            $match: {
                _id: {$ne: ObjectId(userId)},
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullName: 1,
                userId: '$_id',
                _id: 0,
                picture: 1
            }
        }
    ]
}

export const getUser = (userId: string) => {
    return [
        {
            $match: {
                _id: {$eq: ObjectId(userId)},
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullName: 1,
                userId: '$_id',
                _id: 0,
                picture: 1
            }
        }
    ]
}
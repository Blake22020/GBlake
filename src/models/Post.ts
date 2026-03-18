import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface IPost extends Document {
    title: string;
    text: string;
    createdAt: Date;
    likes: number;
    author: Types.ObjectId
}

const PostSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    likes: {
        type: Number,
        default: 0,
    },

    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

PostSchema.index({
    title: 'text',
    text: 'text'
}, {
    name: "post_text_index",
    weights: {
        title: 5,
        text: 1
    }
});

export default mongoose.model<IPost>("Post", PostSchema);
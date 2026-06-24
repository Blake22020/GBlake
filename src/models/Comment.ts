import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
    text: string;
    author: Types.ObjectId;
    post: Types.ObjectId;
    parent: Types.ObjectId | null;
    likes: number;
    likedBy: Types.ObjectId[];
    edited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        text: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 1000,
        },
        author: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: Types.ObjectId,
            ref: "Post",
            required: true,
        },
        parent: {
            type: Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
        edited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

CommentSchema.index({ post: 1, parent: 1, createdAt: -1 });

export default mongoose.model<IComment>("Comment", CommentSchema);

import mongoose, {Schema, Types, Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    visualName: string;
    bio: string;
    email: string;
    password: string;
    followings: Types.ObjectId[];
    followers: Types.ObjectId[];
    avatar: string;
    role: number;
    posts: Types.ObjectId[];
    likes: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        minlength:1,
        maxlength:20,
        required: true,
        unique:true,
    },
    visualName: {
        type: String,
        minlength:1,
        maxlength:40,
        default: 'New User',
    },
    bio: {
        type: String,
        minlength:3,
        maxlength:80,
        default: "..."
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    followings: [{
        type: Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followers: [{
        type: Types.ObjectId,
        ref: 'User',
        default: []
    }],
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    role: {
        type: Number,
        default: 0,
        enum: [-1, 0, 1, 2, 3],
        required: true,
    },
    posts: [{
        type: Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    likes: [
        {
            type: Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ]
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj
}

export default mongoose.model<IUser>("User", UserSchema);
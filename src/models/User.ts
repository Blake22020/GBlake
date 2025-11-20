import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    bio: string;
    email: string;
    password: string;
    followings: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    avatar: string;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        default: "Новый пользователь",
        minlength:3,
        maxlength:20
    },
    bio: {
        type: String,
        default: "...",
        minlength:3,
        maxlength:40
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    }
})

export default mongoose.model<IUser>("User", UserSchema);
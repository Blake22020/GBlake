"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        minlength: 1,
        maxlength: 20,
        required: true,
        unique: true,
    },
    visualName: {
        type: String,
        minlength: 1,
        maxlength: 40,
        default: 'New User',
    },
    bio: {
        type: String,
        default: "...",
        minlength: 3,
        maxlength: 80
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
            type: mongoose_1.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    followers: [{
            type: mongoose_1.Types.ObjectId,
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
            type: mongoose_1.Types.ObjectId,
            ref: 'Post',
            default: []
        }],
    likes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Post',
            default: []
        }
    ]
}, { timestamps: true });
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
exports.default = mongoose_1.default.model("User", UserSchema);

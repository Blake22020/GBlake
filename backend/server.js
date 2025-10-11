const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();
 
app.use(express.static("public"));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/social", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const userSchema = new Schema({
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
    email: {
        type: String,
        unique: true,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followers: {
        type: Number,
        default: 0
    }
    
})
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength:1,
        maxlength:20
    },
    text: {
        type: String,
        required: true,
        default: "",
        minlength:1,
        maxlength:40
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);


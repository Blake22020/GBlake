import React from "react";

interface PostInterface {
    title: string;
    text: string;
    createdAt: Date;
    likes: number;
    author: {
        name: string;
        avatar: string;
        _id: string;
    }
}

function Post(post: PostInterface) {
    return (
        <article className="post">

        </article>
    )
}

export default Post;
import React, { useState, useMemo, useCallback } from "react";
import LikeIcon from "./icons/Like/LikeIcon";
import LikedIcon from "./icons/Like/LikedIcon";
import CommentIcon from "./icons/Comment/CommentIcon";
import Comments from "./Comments";
import { likePost } from "../services/api";
import { timeAgo } from "../utils/time";
import toast from "react-hot-toast";

interface PostInterface {
    title: string;
    text: string;
    createdAt: Date;
    likes: number;
    liked?: boolean;
    commentsCount?: number;
    author: {
        username: string;
        avatar: string;
        _id: string;
    };
    _id: string;
}

function Post(post: PostInterface) {
    const [liked, setLiked] = useState(!!post.liked);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);

    const timeAgoStr = useMemo(() => timeAgo(post.createdAt), [post.createdAt]);

    const toggleLike = useCallback(async () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikesCount((prev) => prev + (wasLiked ? -1 : 1));

        const revert = () => {
            setLiked(wasLiked);
            setLikesCount((prev) => prev + (wasLiked ? 1 : -1));
        };

        const token = localStorage.getItem("token");

        try {
            const res = await likePost(post._id, token);

            if (!res || res.likes === undefined || res.likes === null) {
                revert();
                toast.error("Сервер не ответил или вернул ошибку.");
                return;
            }

            setLikesCount(res.likes);
            toast.success("Лайк поставлен!");
        } catch (error: any) {
            revert();
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error("Ошибка. Не удалось лайкнуть" + errMsg);
        }
    }, [liked, post._id]);

    return (
        <article className="flex flex-col gap-[30px] bg-bg-contactButton mx-auto my-[25px] p-[20px] rounded-[35px] w-[90%] min-[500px]:w-[400px] min-[600px]:w-[350px] min-[750px]:w-[450px] min-[900px]:w-[550px] min-[1050px]:w-[700px] text-white post">
            <div className="flex justify-between items-center post__header">
                <div className="flex items-start gap-[15px] h-fit post__header__title">
                    <a
                        href={"/user/" + post.author._id}
                        className="bg-white rounded-[50%] w-[32px] object-cover aspect-square"
                    >
                        {" "}
                        <img
                            src={
                                process.env.REACT_APP_API_URL +
                                post.author.avatar
                            }
                            className="post__header__avatar"
                            alt=""
                        />{" "}
                    </a>
                    <h1 className="m-0 text-[1.5rem]">
                        {post.author.username}
                    </h1>
                </div>
                <p className="m-0 text-[1rem] text-white/75 post__header__date">
                    {timeAgoStr}
                </p>
            </div>
            <div className="flex flex-col gap-[10px] min-[750px]:gap-[40px] min-[1050px]:gap-[10px] post__body">
                <h1 className="font-bold text-[1.5rem] min-[750px]:text-[1.7rem] min-[900px]:text-[2rem]">
                    {post.title}
                </h1>
                <p className="text-[1.1rem] min-[500px]:text-[1.2rem] min-[750px]:text-[1.3rem] min-[1050px]:text-[1.4rem]">
                    {post.text}
                </p>
            </div>
            <div className="post__footer">
                <div className="flex gap-[15px] post__footer__buttons">
                    <button
                        className="flex items-center gap-[12px] bg-bg-contactButton hover:bg-bg-contactButtonHover px-[20px] py-[5px] border-0 rounded-[25px] text-[1.4rem] text-white cursor-pointer post__footer__buttons__btn"
                        onClick={toggleLike}
                    >
                        {liked ? <LikedIcon /> : <LikeIcon />}
                        {likesCount}
                    </button>
                    <button
                        className="flex items-center gap-[12px] bg-bg-contactButton hover:bg-bg-contactButtonHover px-[20px] py-[5px] border-0 rounded-[25px] text-[1.4rem] text-white cursor-pointer post__footer__buttons__btn"
                        onClick={() => setShowComments((v) => !v)}
                    >
                        <CommentIcon />
                        {commentsCount}
                    </button>
                </div>
            </div>
            {showComments && (
                <Comments
                    postId={post._id}
                    postAuthorId={post.author._id}
                    onCountChange={(delta) =>
                        setCommentsCount((prev) => Math.max(0, prev + delta))
                    }
                />
            )}
        </article>
    );
}

export default React.memo(Post);
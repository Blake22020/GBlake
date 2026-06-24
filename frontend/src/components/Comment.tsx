import React, { useState, useMemo, useCallback } from "react";
import LikeIcon from "./icons/Like/LikeIcon";
import LikedIcon from "./icons/Like/LikedIcon";
import Button from "./Button";
import Textarea from "./Textarea";
import { likeComment } from "../services/api";
import { timeAgo } from "../utils/time";
import toast from "react-hot-toast";

export interface CommentData {
    _id: string;
    text: string;
    createdAt: Date;
    edited: boolean;
    likes: number;
    liked?: boolean;
    parent: string | null;
    author: {
        _id: string;
        username: string;
        avatar: string;
    };
    replies?: CommentData[];
}

interface CommentProps {
    comment: CommentData;
    postAuthorId: string;
    isReply?: boolean;
    onReply: (parentId: string, text: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

function Comment({
    comment,
    postAuthorId,
    isReply = false,
    onReply,
    onEdit,
    onDelete,
}: CommentProps) {
    const [liked, setLiked] = useState(!!comment.liked);
    const [likesCount, setLikesCount] = useState(comment.likes);
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [submitting, setSubmitting] = useState(false);

    const timeAgoStr = useMemo(
        () => timeAgo(comment.createdAt),
        [comment.createdAt],
    );

    const myId = localStorage.getItem("id");
    const canModify =
        comment.author._id === myId || postAuthorId === myId;

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
            const res = await likeComment(comment._id, token);
            if (!res || res.likes === undefined || res.likes === null) {
                revert();
                toast.error("Сервер не ответил или вернул ошибку.");
                return;
            }
            setLikesCount(res.likes);
        } catch (error: any) {
            revert();
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error("Не удалось лайкнуть: " + errMsg);
        }
    }, [liked, comment._id]);

    const submitReply = useCallback(async () => {
        if (!replyText.trim() || submitting) return;
        setSubmitting(true);
        try {
            await onReply(comment._id, replyText.trim());
            setReplyText("");
            setShowReply(false);
        } finally {
            setSubmitting(false);
        }
    }, [replyText, submitting, onReply, comment._id]);

    const submitEdit = useCallback(async () => {
        if (!editText.trim() || submitting) return;
        setSubmitting(true);
        try {
            await onEdit(comment._id, editText.trim());
            setEditing(false);
        } finally {
            setSubmitting(false);
        }
    }, [editText, submitting, onEdit, comment._id]);

    return (
        <div
            className={`flex flex-col gap-[8px] bg-white/5 my-[8px] p-[15px] rounded-[20px] ${
                isReply ? "ml-[30px]" : ""
            }`}
        >
            <div className="flex items-center gap-[10px]">
                <a
                    href={"/user/" + comment.author._id}
                    className="bg-white rounded-full w-[26px] aspect-square object-cover flex-shrink-0"
                >
                    <img
                        src={process.env.REACT_APP_API_URL + comment.author.avatar}
                        className="rounded-full w-[26px] aspect-square object-cover"
                        alt=""
                    />
                </a>
                <span className="font-bold text-[1rem]">
                    {comment.author.username}
                </span>
                <span className="ml-auto text-white/60 text-[0.85rem]">
                    {timeAgoStr}
                    {comment.edited ? " (ред.)" : ""}
                </span>
            </div>

            {editing ? (
                <div className="flex flex-col gap-[8px]">
                    <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        maxLength={1000}
                        rows={2}
                        className="px-[15px] py-[10px] w-full"
                    />
                    <div className="flex gap-[10px]">
                        <Button
                            type="button"
                            onClick={submitEdit}
                            className="px-[15px] py-[5px] text-[0.9rem]"
                        >
                            Сохранить
                        </Button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setEditText(comment.text);
                            }}
                            className="bg-transparent border-0 text-white/60 text-[0.9rem] cursor-pointer"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            ) : (
                <p className="m-0 text-[1.05rem] break-words">{comment.text}</p>
            )}

            <div className="flex items-center gap-[15px] text-[0.9rem]">
                <button
                    onClick={toggleLike}
                    className="flex items-center gap-[6px] bg-transparent border-0 text-white cursor-pointer"
                >
                    {liked ? <LikedIcon /> : <LikeIcon />}
                    {likesCount}
                </button>

                {!isReply && (
                    <button
                        onClick={() => setShowReply((v) => !v)}
                        className="bg-transparent border-0 text-white/70 hover:text-white cursor-pointer"
                    >
                        Ответить
                    </button>
                )}

                {comment.author._id === myId && (
                    <button
                        onClick={() => setEditing((v) => !v)}
                        className="bg-transparent border-0 text-white/70 hover:text-white cursor-pointer"
                    >
                        Изменить
                    </button>
                )}

                {canModify && (
                    <button
                        onClick={() => onDelete(comment._id)}
                        className="bg-transparent border-0 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                        Удалить
                    </button>
                )}
            </div>

            {showReply && (
                <div className="flex flex-col gap-[8px] mt-[5px]">
                    <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Ваш ответ..."
                        maxLength={1000}
                        rows={2}
                        className="px-[15px] py-[10px] w-full"
                    />
                    <Button
                        type="button"
                        onClick={submitReply}
                        className="self-start px-[15px] py-[5px] text-[0.9rem]"
                    >
                        Отправить
                    </Button>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            postAuthorId={postAuthorId}
                            isReply
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;

import { useState, useCallback, useEffect } from "react";
import Comment, { CommentData } from "./Comment";
import CommentSkeleton from "./CommentSkeleton";
import Button from "./Button";
import Textarea from "./Textarea";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
    getComments,
    createComment,
    editComment,
    deleteComment,
} from "../services/api";
import toast from "react-hot-toast";

interface CommentsProps {
    postId: string;
    postAuthorId: string;
    onCountChange?: (delta: number) => void;
}

function Comments({ postId, postAuthorId, onCountChange }: CommentsProps) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [newText, setNewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadComments = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await getComments(postId, token, page, 10);
            if (res.length < 10) setHasMore(false);
            setComments((prev) => {
                const fresh = res.filter(
                    (c: CommentData) => !prev.some((p) => p._id === c._id),
                );
                return [...prev, ...fresh];
            });
            setPage((prev) => prev + 1);
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    }, [postId, page, isLoading, hasMore]);

    useEffect(() => {
        if (page === 1 && comments.length === 0 && hasMore) {
            loadComments();
        }
    }, [loadComments, page, comments.length, hasMore]);

    const lastElementRef = useInfiniteScroll({
        isLoading,
        hasMore,
        onLoadMore: loadComments,
    });

    const handleCreate = useCallback(async () => {
        if (!newText.trim() || submitting) return;
        setSubmitting(true);
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Войдите, чтобы комментировать");
            setSubmitting(false);
            return;
        }
        try {
            const created = await createComment(postId, newText.trim(), token);
            setComments((prev) => [{ ...created, replies: [] }, ...prev]);
            setNewText("");
            onCountChange?.(1);
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error(errMsg);
        } finally {
            setSubmitting(false);
        }
    }, [newText, submitting, postId, onCountChange]);

    const handleReply = useCallback(
        async (parentId: string, text: string) => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Войдите, чтобы отвечать");
                return;
            }
            try {
                const created = await createComment(postId, text, token, parentId);
                setComments((prev) =>
                    prev.map((c) =>
                        c._id === parentId
                            ? { ...c, replies: [...(c.replies || []), created] }
                            : c,
                    ),
                );
                onCountChange?.(1);
            } catch (error: any) {
                const errMsg =
                    error?.response?.data?.message ||
                    error.message ||
                    "Неизвестная ошибка";
                toast.error(errMsg);
            }
        },
        [postId, onCountChange],
    );

    const handleEdit = useCallback(async (id: string, text: string) => {
        const token = localStorage.getItem("token");
        try {
            const updated = await editComment(id, text, token);
            setComments((prev) =>
                prev.map((c) => {
                    if (c._id === id) {
                        return { ...c, text: updated.text, edited: true };
                    }
                    if (c.replies?.some((r) => r._id === id)) {
                        return {
                            ...c,
                            replies: c.replies.map((r) =>
                                r._id === id
                                    ? { ...r, text: updated.text, edited: true }
                                    : r,
                            ),
                        };
                    }
                    return c;
                }),
            );
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error(errMsg);
        }
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            const token = localStorage.getItem("token");
            try {
                await deleteComment(id, token);
                setComments((prev) => {
                    const topLevel = prev.find((c) => c._id === id);
                    if (topLevel) {
                        onCountChange?.(-(1 + (topLevel.replies?.length || 0)));
                        return prev.filter((c) => c._id !== id);
                    }
                    return prev.map((c) => {
                        if (c.replies?.some((r) => r._id === id)) {
                            onCountChange?.(-1);
                            return {
                                ...c,
                                replies: c.replies.filter((r) => r._id !== id),
                            };
                        }
                        return c;
                    });
                });
            } catch (error: any) {
                const errMsg =
                    error?.response?.data?.message ||
                    error.message ||
                    "Неизвестная ошибка";
                toast.error(errMsg);
            }
        },
        [onCountChange],
    );

    return (
        <div className="flex flex-col mt-[10px] pt-[15px] border-t border-white/10">
            <div className="flex flex-col gap-[10px] mb-[15px]">
                <Textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Написать комментарий..."
                    maxLength={1000}
                    rows={2}
                    className="px-[15px] py-[10px] w-full"
                />
                <Button
                    type="button"
                    onClick={handleCreate}
                    className="self-start px-[20px] py-[6px] text-[0.95rem]"
                >
                    Отправить
                </Button>
            </div>

            {comments.map((comment) => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    postAuthorId={postAuthorId}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}

            <div ref={lastElementRef} style={{ height: "10px" }} />
            {isLoading && (
                <>
                    <CommentSkeleton />
                    <CommentSkeleton />
                </>
            )}
            {!isLoading && comments.length === 0 && (
                <p className="text-white/50 text-center py-[10px]">
                    Пока нет комментариев
                </p>
            )}
        </div>
    );
}

export default Comments;

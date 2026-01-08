import React, { useState } from "react";
import '../styles/components/post.css'
import LikeIcon from './icons/Like/LikeIcon'
import LikedIcon from "./icons/Like/LikedIcon";
import { likePost } from "../services/api"
import Modal from "./Modal";

interface PostInterface {
    title: string;
    text: string;
    createdAt: Date;
    likes: number;
    liked?: boolean;
    author: {
        username: string;
        avatar: string;
        _id: string;
    }
    _id: string;
}

function plural(value: number, forms: [string, string, string]): string {
    const mod10 = value % 10;
    const mod100 = value % 100;

    if (mod100 >= 11 && mod100 <= 14) return forms[2];
    if (mod10 === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4) return forms[1];
    return forms[2];
}

function timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) return "только что";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);
    const months  = Math.floor(days / 30);
    const years   = Math.floor(days / 365);

    if (years > 0) {
        return `${years} ${plural(years, ["год", "года", "лет"])} назад`;
    }

    if (months > 0) {
        return `${months} ${plural(months, ["месяц", "месяца", "месяцев"])} назад`;
    }

    if (days > 0) {
        return `${days} ${plural(days, ["день", "дня", "дней"])} назад`;
    }

    if (hours > 0) {
        return `${hours} ${plural(hours, ["час", "часа", "часов"])} назад`;
    }

    if (minutes > 0) {
        return `${minutes} ${plural(minutes, ["минута", "минуты", "минут"])} назад`;
    }

    return "только что";
}

function Post(post: PostInterface) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: '', text: '' });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const [liked, setLiked] = useState(!!post.liked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const toggleLike = async ()=> {
        setLiked(prev => !prev);
        setLikesCount(prev => prev + (liked ? -1 : 1));

        const token = localStorage.getItem('token')

        try {
            const res = await likePost(post._id, token);

            if (!res) {
                openModal('Не удалось лайкнуть', 'Сервер не ответил или вернул ошибку.');
                return;
            }

            if(!res.likes) {
                openModal('Не удалось лайкнуть', 'Сервер не ответил');
                return;
            }
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
            openModal('Ошибка. Не удалось лайкнуть', errMsg);
        }
    }

    return (
        <article className="post">
            <div className="post__header">
                <div className="post__header__title">
                    <a href={'https://gblake.ru/users/' + post.author._id}> <img src={"https://gblake.ru/uploads/" + post.author.avatar} className="post__header__avatar" alt=""/> </a>
                    <h1 className="post__header__title">{post.author.username}</h1>
                </div>
                <p className="post__header__date">{timeAgo(post.createdAt)}</p>
            </div>
            <div className='post__body'>
                <h1>{post.title}</h1>
                <p>{post.text}</p>
            </div>
            <div className="post__footer">
                <div className="post__footer__buttons">
                    <button className="post__footer__buttons__btn" onClick={toggleLike}>
                        {liked ? <LikedIcon /> : <LikeIcon />}
                        {likesCount}
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
        </article>
    )
}

export default Post;
import { registerRequest2, uploadAvatar } from "../services/api";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setMeta } from "../services/description";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import { ReactComponent as PlusIcon } from "../assets/plus.svg";

function Register2() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Продолжение регистрации | GBlake";
        setMeta("description", "Регистрация");
    }, []);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleAddClick() {
        if (!fileInputRef.current) return;
        fileInputRef.current.click();
    }

    const [avatar, setAvatar] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("ref: ", fileInputRef.current);
        const file = e.target.files?.[0];

        if (!file) return;
        setAvatar(file);
        console.log(file);
    }

    const previewUrl = avatar ? URL.createObjectURL(avatar) : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    async function handleSubmit() {
        if (!avatar) {
            toast.error("Выбери фото");
            return;
        }

        if (!name.trim()) {
            toast.error("Введи имя");
            return;
        }

        if (avatar.size > 4 * 1024 * 1024) {
            toast.error("Фото слишком большое (макс 4МБ)");
            return;
        }

        if (!avatar.type.startsWith("image/")) {
            toast.error("Неверный формат файла");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Требуется авторизация");
                return;
            }

            await registerRequest2({ visualName: name, bio: bio }, token);
            const res = await uploadAvatar(avatar, token);
            localStorage.setItem("avatar", res.avatar);
            toast.success("Регистрация завершена успешно!");
            navigate("/");
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Ошибка при сохранении";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="bg-[#191919] w-screen h-screen register-main-window">
            <div className="flex justify-center items-center bg-gradient-to-b from-[rgba(110,91,255,0.35)] to-[rgba(11,12,16,1)] w-screen h-screen register-window">
                <div className="flex max-[600px]:flex-col gap-[66px] max-[578px]:gap-[22px] bg-white/10 max-[1080px]:p-[20px] px-[85px] py-[100px] border-[1.5px] border-white/30 border-solid rounded-[55px] w-[1000px]] max-[1080px]:w-[778px] max-[600px]:w-[95%] max-[750px]:w-[578px] max-[900px]:w-[678px] text-white register2">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <div
                        className="flex flex-col gap-[20px] max-[750px]:gap-[5px] bg-white/5 hover:bg-white/10 p-[20px] max-[750px]:p-[5px] rounded-[45px] max-[750px]:rounded-[35px] w-[40%] max-[500px]:w-full text-[1.8rem] max-[900px]:text-[1.3rem] text-center cursor-pointer addCard"
                        onClick={handleAddClick}
                    >
                        <div
                            className="bg-white/5 p-[15px] max-[750px]:p-[5px] rounded-[35px] max-[750px]:rounded-[30px] addIcon"
                            id="addIcon"
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    className="rounded-[10px] max-[750px]:rounded-[25px] w-full object-cover aspect-square"
                                    alt="Твоя аватарка"
                                />
                            ) : (
                                <PlusIcon width="100%" height="100%" />
                            )}
                        </div>
                        {previewUrl ? "Фото добавлено" : "Добавить фото"}
                    </div>
                    <form
                        className="flex flex-col justify-between max-[600px]:gap-[25px] max-[600px]:mx-auto max-[600px]:my-0 max-[600px]:w-[50%] addForm"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className="flex flex-col gap-[30px] max-[750px]:gap-[10px] addInputs">
                            <Input
                                placeholder="Отображаемое имя"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                maxLength={40}
                                className="max-[750px]:p-[15px] px-[25px] py-[15px] text-[2rem] max-[750px]:text-[1.2rem] max-[900px]:text-[1.5rem] resize-none"
                            />
                            <Textarea
                                placeholder="Описание"
                                rows={2}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={80}
                                className="max-[750px]:p-[15px] px-[25px] py-[15px] text-[2rem] max-[750px]:text-[1.2rem] max-[900px]:text-[1.5rem]"
                            />
                        </div>
                        <Button
                            type="submit"
                            onClick={() => {}}
                            className="p-[20px] max-[750px]:p-[15px] text-[2rem] max-[900px]:text-[1.5rem]"
                        >
                            Создать профиль
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register2;

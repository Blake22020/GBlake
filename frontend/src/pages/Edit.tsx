import { useEffect, useState } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { setMeta } from "../services/description";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUserProfile, uploadAvatar } from "../services/api";
import toast from "react-hot-toast";

interface UserData {
    id: string;
    username: string;
    visualName: string;
    bio: string;
    avatar: string;
}

function Edit() {
    useEffect(() => {
        document.title = "Редактирование профиля | GBlake";
        setMeta("description", "Редактирование профиля");
    }, []);

    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        visualName: "",
        bio: "",
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const data = await getUserData(token);
                setUserData(data);
                setFormData({
                    username: data.username || "",
                    visualName: data.visualName || "",
                    bio: data.bio || "",
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                navigate(`/user/${userData?.id || localStorage.getItem("id")}`);
            }
        };

        fetchUserData();
    }, [navigate, userData?.id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setIsLoading(true);

        try {
            await updateUserProfile(formData, token);

            if (avatarFile) {
                await uploadAvatar(avatarFile, token);
            }

            if (formData.visualName) {
                localStorage.setItem("visualName", formData.visualName);
            }

            toast.success("Профиль успешно обновлен");
            navigate(`/user/${userData?.id || localStorage.getItem("id")}`);
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col pt-[65px] pl-[200px] max-[900px]:pt-[100px] max-[900px]:h-auto max-[900px]:pb-[50px] max-[600px]:pl-0 w-screen h-screen object-cover">
            <LoginNavbarHeader />
            <div className="relative flex flex-col justify-center items-center gap-[75px] h-full">
                <button
                    className="absolute top-[40px] right-[40px] max-[1100px]:top-[15px] max-[1100px]:right-[15px] bg-transparent p-0 border-0 w-[50px] max-[1100px]:w-[40px] max-[1100px]:h-[40px] aspect-square cursor-pointer"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                        viewBox="0 0 24 24"
                    >
                        <g data-name="Layer 2">
                            <g data-name="close">
                                <rect
                                    width="50"
                                    height="50"
                                    transform="rotate(180 12 12)"
                                    opacity="0"
                                />
                                <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                            </g>
                        </g>
                    </svg>
                </button>
                <form
                    className="flex flex-col gap-[75px] max-[1300px]:gap-[50px]"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center gap-[50px] max-[1300px]:gap-[20px] max-[900px]:flex-col">
                        <div
                            className="flex flex-col gap-[33px] bg-white/15 hover:bg-white/20 p-[30px] rounded-[35px] text-white transition-all duration-300 ease-in cursor-pointer max-[900px]:w-full max-[900px]:text-center"
                            onClick={() =>
                                document
                                    .getElementById("avatar-upload")
                                    ?.click()
                            }
                        >
                            <img
                                src={
                                    avatarFile
                                        ? URL.createObjectURL(avatarFile)
                                        : `${process.env.REACT_APP_API_URL}${userData.avatar}`
                                }
                                alt=""
                                className="box-border bg-white/15 rounded-[50%] w-full object-cover aspect-square"
                            />
                            <h2 className="text-[2rem] max-[1300px]:text-[1.5rem] max-[1100px]:text-[1.4rem]">
                                Загрузить фото
                            </h2>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: "none" }}
                                id="avatar-upload"
                            />
                        </div>
                        <div className="flex flex-col gap-[20px] w-[500px] max-[1300px]:w-[400px] max-[1100px]:w-[350px] h-full">
                            <input
                                name="username"
                                placeholder="Уникальное имя"
                                maxLength={20}
                                value={formData.username}
                                onChange={handleInputChange}
                                className="bg-white/15 hover:bg-white/20 focus:bg-white/25 px-[35px] py-[20px] border-0 rounded-[35px] outline-none w-full text-[2rem] max-[1300px]:text-[1.5rem] max-[1100px]:text-[1.4rem] text-white transition-all duration-300 ease-out"
                            />
                            <input
                                name="visualName"
                                placeholder="Отображаемое имя"
                                maxLength={40}
                                value={formData.visualName}
                                onChange={handleInputChange}
                                className="bg-white/15 hover:bg-white/20 focus:bg-white/25 px-[35px] py-[20px] border-0 rounded-[35px] outline-none w-full text-[2rem] max-[1300px]:text-[1.5rem] max-[1100px]:text-[1.4rem] text-white transition-all duration-300 ease-out"
                            />
                            <textarea
                                name="bio"
                                placeholder="Описание"
                                rows={2}
                                maxLength={80}
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="bg-white/15 hover:bg-white/20 focus:bg-white/25 px-[35px] py-[20px] border-0 rounded-[35px] outline-none w-full h-full font-['Montserrat',_sans-serif] font-[400] text-[2rem] max-[1300px]:text-[1.5rem] max-[1100px]:text-[1.4rem] text-white transition-all duration-300 ease-out"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-500 p-[15px] border-0 rounded-[35px] outline-0 font-[700] text-[2.25rem] max-[1300px]:text-[1.8rem] max-[1100px]:text-[1.5rem] text-white transition-all duration-300 ease-in cursor-pointer"
                    >
                        {isLoading ? "Сохранение..." : "Сохранить"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Edit;

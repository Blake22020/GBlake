import { useEffect, useState } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { getUser, promoteUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminPanel() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) {
                    toast.error("Ошибка авторизации");
                    return;
                }
                const user = await getUser(id);
                const role = user.role;
                if (role < 2) {
                    toast.error("Недостаточно прав");
                    return;
                }
            } catch {
                toast.error("Ошибка");
                return;
            }
        };
        checkRole();
    }, [navigate]);

    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/404");
                return;
            }
            const res = await promoteUser(Number(role), token, userId);

            if (res && res.message) {
                toast.success(res.message);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="flex flex-col pt-[65px] max-[900px]:pt-[50px] pb-[110px] pl-[200px] max-[600px]:pl-0 max-[900px]:pl-[200px] w-screen h-screen object-cover adminPage">
            <LoginNavbarHeader />
            <div className="flex flex-col justify-center items-center w-full h-full adminWindow">
                <div className="shadow-[0_0_100px_0_#6e5bff] p-[45px] rounded-[45px] w-[50%] min-h-[70%] adminPanel">
                    <form
                        className="flex flex-col justify-between h-full gap-[30px]"
                        onSubmit={handleSubmit}
                    >
                        <h1 className="text-[2rem] text-white text-center">
                            Админ панель
                        </h1>
                        <div className="flex flex-col gap-[40px] inputs">
                            <input
                                placeholder="id пользователя"
                                className="bg-white/10 hover:bg-white/15 focus:bg-white/20 pt-[20px] pr-0 pb-[20px] pl-[30px] border-0 rounded-[35px] outline-none text-[2rem] text-white"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                            <input
                                placeholder="Роль (-1, 0, 1, 2)"
                                className="bg-white/10 hover:bg-white/15 focus:bg-white/20 pt-[20px] pr-0 pb-[20px] pl-[30px] border-0 rounded-[35px] outline-none text-[2rem] text-white"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[linear-gradient(135deg,#6e5bff,#a08eff)] p-[15px] border-0 rounded-[35px] outline-0 font-700 text-[3rem] text-white hover:-translate-y-[20px] transition-all cursor-pointer"
                        >
                            Изменить роль
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;

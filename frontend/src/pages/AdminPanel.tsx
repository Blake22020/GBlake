import { useCallback, useEffect, useState } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { getAdminStats, getAdminUsers, getUser, promoteUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ROLE_LABELS: Record<number, { label: string; color: string }> = {
    "-1": { label: "Забанен", color: "bg-red-500/20 text-red-400" },
    0: { label: "Пользователь", color: "bg-white/10 text-white/60" },
    1: { label: "Модератор", color: "bg-blue-500/20 text-blue-400" },
    2: { label: "Админ", color: "bg-purple-500/20 text-purple-400" },
    3: { label: "Создатель", color: "bg-yellow-500/20 text-yellow-400" },
};

interface AdminUser {
    _id: string;
    username: string;
    visualName: string;
    email: string;
    role: number;
    avatar?: string;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    totalPosts: number;
    newUsersThisWeek: number;
    newPostsThisWeek: number;
    byRole: Record<number, number>;
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
    return (
        <div className="flex flex-col gap-1 bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
            <span className="text-white/50 text-xs sm:text-sm">{label}</span>
            <span className="text-white text-2xl sm:text-3xl font-bold">{value.toLocaleString()}</span>
            {sub && <span className="text-white/40 text-xs">{sub}</span>}
        </div>
    );
}

function RoleBadge({ role }: { role: number }) {
    const cfg = ROLE_LABELS[role] ?? { label: String(role), color: "bg-white/10 text-white/60" };
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
    );
}

function AdminPanel() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [myRole, setMyRole] = useState<number | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [promoteId, setPromoteId] = useState("");
    const [promoteRole, setPromoteRole] = useState("");

    useEffect(() => {
        const checkRole = async () => {
            const id = localStorage.getItem("id");
            if (!id) { toast.error("Ошибка авторизации"); navigate("/"); return; }
            try {
                const user = await getUser(id);
                if (user.role < 2) { toast.error("Недостаточно прав"); navigate("/"); return; }
                setMyRole(user.role);
            } catch {
                toast.error("Ошибка авторизации");
                navigate("/");
            }
        };
        checkRole();
    }, [navigate]);

    useEffect(() => {
        if (myRole === null) return;
        getAdminStats(token).then(setStats).catch(() => {});
    }, [myRole, token]);

    const fetchUsers = useCallback(async () => {
        if (myRole === null) return;
        setLoadingUsers(true);
        try {
            const data = await getAdminUsers(token, page, 15, search);
            setUsers(data.users);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Ошибка загрузки пользователей");
        } finally {
            setLoadingUsers(false);
        }
    }, [myRole, token, page, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handlePromote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await promoteUser(Number(promoteRole), token, promoteId);
            if (res?.message) toast.success(res.message);
            setPromoteId("");
            setPromoteRole("");
            fetchUsers();
            getAdminStats(token).then(setStats).catch(() => {});
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    const BASE_URL = process.env.REACT_APP_API_URL || "";

    return (
        <div className="flex flex-col pt-[50px] nav:pt-[65px] pb-[110px] w-full pl-0 xs:pl-[200px] min-h-screen adminPage">
            <LoginNavbarHeader />

            <div className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-6 flex flex-col gap-6">
                <h1 className="text-white text-2xl sm:text-3xl font-bold">Панель администратора</h1>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Пользователей" value={stats.totalUsers} sub={`+${stats.newUsersThisWeek} за неделю`} />
                        <StatCard label="Постов" value={stats.totalPosts} sub={`+${stats.newPostsThisWeek} за неделю`} />
                        <StatCard label="Модераторов" value={stats.byRole[1] ?? 0} />
                        <StatCard label="Админов" value={stats.byRole[2] ?? 0} />
                    </div>
                )}

                {/* Promote form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
                    <h2 className="text-white text-base sm:text-lg font-semibold mb-4">Изменить роль</h2>
                    <form onSubmit={handlePromote} className="flex flex-col sm:flex-row gap-3">
                        <input
                            placeholder="ID пользователя"
                            className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 py-3 px-4 rounded-xl outline-none text-white text-sm placeholder:text-white/40"
                            value={promoteId}
                            onChange={(e) => setPromoteId(e.target.value)}
                        />
                        <input
                            placeholder="Роль (-1, 0, 1, 2)"
                            className="w-full sm:w-36 bg-white/10 hover:bg-white/15 focus:bg-white/20 py-3 px-4 rounded-xl outline-none text-white text-sm placeholder:text-white/40"
                            value={promoteRole}
                            onChange={(e) => setPromoteRole(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-[linear-gradient(135deg,#6e5bff,#a08eff)] py-3 px-6 rounded-xl text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform cursor-pointer"
                        >
                            Применить
                        </button>
                    </form>
                </div>

                {/* User table */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/10">
                        <span className="text-white font-semibold text-sm sm:text-base">
                            Пользователи <span className="text-white/40">({total})</span>
                        </span>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                placeholder="Поиск..."
                                className="bg-white/10 hover:bg-white/15 focus:bg-white/20 py-2 px-3 rounded-xl outline-none text-white text-sm placeholder:text-white/40 w-40 sm:w-52"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl text-white text-sm cursor-pointer transition-colors"
                            >
                                Найти
                            </button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-white/80">
                            <thead>
                                <tr className="text-white/40 text-xs border-b border-white/10">
                                    <th className="text-left py-3 px-4 font-medium">Пользователь</th>
                                    <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Email</th>
                                    <th className="text-left py-3 px-4 font-medium">Роль</th>
                                    <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Дата</th>
                                    <th className="text-right py-3 px-4 font-medium">ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingUsers ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="border-b border-white/5">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse shrink-0" />
                                                    <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 hidden md:table-cell">
                                                <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="h-5 w-20 bg-white/10 rounded-full animate-pulse" />
                                            </td>
                                            <td className="py-3 px-4 hidden sm:table-cell">
                                                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="h-3 w-20 bg-white/10 rounded animate-pulse ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-white/40">
                                            Пользователи не найдены
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    {u.avatar ? (
                                                        <img
                                                            src={u.avatar.startsWith("http") ? u.avatar : `${BASE_URL}${u.avatar}`}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover shrink-0 bg-white/10"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-white/40 text-xs">
                                                            {u.username[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-white text-xs sm:text-sm font-medium truncate">{u.visualName}</span>
                                                        <span className="text-white/40 text-xs truncate">@{u.username}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-white/50 text-xs hidden md:table-cell">
                                                {u.email}
                                            </td>
                                            <td className="py-3 px-4">
                                                <RoleBadge role={u.role} />
                                            </td>
                                            <td className="py-3 px-4 text-white/40 text-xs hidden sm:table-cell">
                                                {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    className="text-white/30 hover:text-purple-400 text-xs font-mono transition-colors cursor-pointer"
                                                    onClick={() => { setPromoteId(u._id); toast("ID скопирован в форму"); }}
                                                    title="Использовать ID"
                                                >
                                                    {u._id.slice(-6)}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                            <span className="text-white/40 text-xs">
                                Стр. {page} из {totalPages}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="px-3 py-1.5 rounded-lg text-xs text-white/60 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    ←
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                                    const p = start + i;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${p === page ? "bg-purple-600 text-white" : "text-white/60 bg-white/10 hover:bg-white/20"}`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="px-3 py-1.5 rounded-lg text-xs text-white/60 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;

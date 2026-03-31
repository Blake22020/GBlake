import MainPage from "./pages/main";
import Register from "./pages/register";
import Register2 from "./pages/register2";
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";
import CreatePost from "./pages/createPost";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Likes from "./pages/Likes";
import Edit from "./pages/Edit";
import AdminPanel from "./pages/AdminPanel";
import Followings from "./pages/Followings";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register2" element={<Register2 />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/search" element={<Search />} />
                <Route path="/likes" element={<Likes />} />
                <Route path="/edit" element={<Edit />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/followings" element={<Followings />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1b1e26",
                        color: "#fff",
                        fontFamily: '"Montserrat", sans-serif',
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        fontSize: "14px",
                        padding: "12px 20px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#6E5BFF",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ff4b4b",
                            secondary: "#fff",
                        },
                    },
                }}
            />
        </>
    );
}

export default App;

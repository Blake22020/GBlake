import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export async function loadPosts(token: string, page = 1) {
    try {
        const res = await axios.get(`${BASE_URL}/api/feed/`, {
            params: { page, limit: 10 },
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function likePost(postId: string, token: string | null) {
    try {
        const res = await axios.post(
            `${BASE_URL}/api/posts/${postId}/like`,
            {},
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function registerRequest1({
    email,
    password,
    username,
}: {
    email: string;
    password: string;
    username: string;
}) {
    try {
        const res = await axios.post(`${BASE_URL}/api/register1`, {
            email,
            password,
            username,
        });

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function registerRequest2(
    { visualName, bio }: { visualName: string; bio: string },
    token: string | null,
) {
    try {
        const res = await axios.patch(
            `${BASE_URL}/api/register2`,
            {
                visualName,
                bio,
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function loginRequest(
    credentials:
        | { email: string; password: string }
        | { username: string; password: string },
) {
    try {
        const res = await axios.post(`${BASE_URL}/api/login`, credentials);
        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function uploadAvatar(file: File, token: string) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
            `${BASE_URL}/api/users/me/avatar`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function createPost(title: string, text: string, token: string) {
    try {
        const res = await axios.post(
            `${BASE_URL}/api/posts`,
            {
                title,
                text,
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function getUser(userId: string) {
    try {
        const res = await axios.get(`${BASE_URL}/api/users/${userId}`);

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function followUser(userId: string, token: string) {
    try {
        const res = await axios.post(
            `${BASE_URL}/api/users/${userId}/follow`,
            {},
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );
        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function checkFollowStatus(userId: string, token: string) {
    try {
        const res = await axios.get(`${BASE_URL}/api/users/${userId}/follow`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function searchResponse(text: string) {
    try {
        const res = await axios.get(`${BASE_URL}/api/search/`, {
            params: {
                q: text,
            },
        });

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function likesPosts(token: string | null) {
    try {
        const res = await axios.get(`${BASE_URL}/api/posts/likes`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function followingsPosts(token: string | null) {
    try {
        const res = await axios.get(`${BASE_URL}/api/posts/followings`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function feedRequest(token: string | null) {
    try {
        const res = await axios.get(
            `${BASE_URL}/api/feed/`,
            token
                ? {
                      headers: {
                          Authorization: token ? `Bearer ${token}` : "",
                      },
                  }
                : {},
        );

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function getUserData(token: string) {
    try {
        const userId = localStorage.getItem("id");
        if (!userId) {
            throw new Error("User ID not found");
        }

        const res = await axios.get(`${BASE_URL}/api/users/${userId}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function updateUserProfile(
    {
        visualName,
        bio,
        username,
    }: { visualName?: string; bio?: string; username?: string },
    token: string,
) {
    try {
        const res = await axios.patch(
            `${BASE_URL}/api/users/me`,
            {
                visualName,
                bio,
                username,
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );

        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

export async function promoteUser(
    role: number,
    token: string | null,
    id: string,
) {
    try {
        const res = await axios.post(
            `${BASE_URL}/api/admin/promote/${id}`,
            {
                role,
            },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        );
        return res.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            const errorMessage =
                e.response.data?.message || "Неизвестная ошибка";
            throw new Error(errorMessage);
        } else {
            throw new Error("Ошибка сети");
        }
    }
}

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "";

const apiClient = axios.create({
    baseURL: BASE_URL,
});

export const setupInterceptors = (setIsLoading: (loading: boolean) => void) => {
    apiClient.interceptors.request.use((config) => {
        setIsLoading(true);
        return config;
    });

    apiClient.interceptors.response.use(
        (response) => {
            setIsLoading(false);
            return response;
        },
        (error) => {
            setIsLoading(false);
            return Promise.reject(error);
        },
    );
};

export async function loadPosts(token: string, page = 1) {
    const res = await apiClient.get(`${BASE_URL}/api/feed/`, {
        params: { page, limit: 10 },
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    return res.data;
}

export async function likePost(postId: string, token: string | null) {
    const res = await apiClient.post(
        `${BASE_URL}/api/posts/${postId}/like`,
        {},
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        },
    );

    return res.data;
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
    const res = await apiClient.post(`${BASE_URL}/api/register1`, {
        email,
        password,
        username,
    });

    return res.data;
}

export async function registerRequest2(
    { visualName, bio }: { visualName: string; bio: string },
    token: string | null,
) {
    const res = await apiClient.patch(
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
}

export async function loginRequest(
    credentials:
        | { email: string; password: string }
        | { username: string; password: string },
) {
    const res = await apiClient.post(`${BASE_URL}/api/login`, credentials);
    return res.data;
}

export async function uploadAvatar(file: File, token: string) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post(
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
}

export async function createPost(title: string, text: string, token: string) {
    const res = await apiClient.post(
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
}

export async function getUser(userId: string) {
    const res = await apiClient.get(`${BASE_URL}/api/users/${userId}`);

    return res.data;
}

export async function followUser(userId: string, token: string) {
    const res = await apiClient.post(
        `${BASE_URL}/api/users/${userId}/follow`,
        {},
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        },
    );
    return res.data;
}

export async function checkFollowStatus(userId: string, token: string) {
    const res = await apiClient.get(`${BASE_URL}/api/users/${userId}/follow`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });
    return res.data;
}

export async function searchResponse(text: string, page = 1, limit = 10) {
    const res = await apiClient.get(`${BASE_URL}/api/search/`, {
        params: {
            q: text,
            page,
            limit,
        },
    });

    return res.data;
}

export async function likesPosts(token: string | null, page = 1, limit = 10) {
    const res = await apiClient.get(`${BASE_URL}/api/posts/likes`, {
        params: { page, limit },
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    return res.data;
}

export async function followingsPosts(
    token: string | null,
    page = 1,
    limit = 10,
) {
    const res = await apiClient.get(`${BASE_URL}/api/posts/followings`, {
        params: { page, limit },
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    return res.data;
}

export async function feedRequest(token: string | null, page = 1, limit = 10) {
    const config: any = {
        params: { page, limit },
    };
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }
    const res = await apiClient.get(`${BASE_URL}/api/feed/`, config);

    return res.data;
}

export async function userPosts(userId: string, page = 1, limit = 10) {
    const res = await apiClient.get(`${BASE_URL}/api/users/${userId}/posts`, {
        params: { page, limit },
    });

    return res.data;
}

export async function getUserData(token: string) {
    const userId = localStorage.getItem("id");
    if (!userId) {
        throw new Error("User ID not found");
    }

    const res = await apiClient.get(`${BASE_URL}/api/users/${userId}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    return res.data;
}

export async function updateUserProfile(
    {
        visualName,
        bio,
        username,
    }: { visualName?: string; bio?: string; username?: string },
    token: string,
) {
    const res = await apiClient.patch(
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
}

export async function getAdminStats(token: string | null) {
    const res = await apiClient.get(`${BASE_URL}/api/admin/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
}

export async function getAdminUsers(
    token: string | null,
    page = 1,
    limit = 20,
    search = "",
) {
    const res = await apiClient.get(`${BASE_URL}/api/admin/users`, {
        params: { page, limit, search },
        headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
}

export async function promoteUser(
    role: number,
    token: string | null,
    id: string,
) {
    const res = await apiClient.post(
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
}

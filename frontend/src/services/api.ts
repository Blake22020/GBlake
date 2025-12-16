import axios from 'axios'

export async function loadPosts(token: string, page = 1) {
    try {
        const res = await axios.get("https://gblake.ru/api/feed/", {
            params: { page, limit: 10},
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            }
        })

        return res.data
    } catch (e) {
        console.error(e)
    }
}

export async function likePost(postId : string, token: string | null) {
    try {
        const res = await axios.post("https://gblake.ru/api/like/" + postId, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            }
        })

        return res.data;
    } catch (e) {
        console.error(e);
    }
}
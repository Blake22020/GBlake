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

export async function registerRequest1({email, password, username} : {email: string, password: string, username: string}, ) {
    try {
        const res = await axios.post('https://gblake.ru/api/register1', {
            email,
            password,
            username,
            
        }) 

        return res.data
    } catch(e) {
        console.error(e)
    } 
}

export async function registerRequest2({visualName, bio} : {visualName: string, bio: string}, token : string | null) {
    try {
        const res = await axios.post('https://gblake.ru/api/register2', {
            visualName,
            bio,
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            }
        }) 



        return res.data
    } catch(e) {
        console.error(e)
    } 
}

export async function loginRequest(
  credentials: 
    | { email: string; password: string }
    | { username: string; password: string }
) {
  try {
    const res = await axios.post('https://gblake.ru/api/login', credentials);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
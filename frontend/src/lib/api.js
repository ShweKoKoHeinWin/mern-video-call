import axios from 'axios'

export const AxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5001/api",
    withCredentials: true
})

const signup = async (signUpData) => {
    const res = await AxiosInstance.post("/auth/signup", signUpData);
    return res.data;
}

export default {signup}
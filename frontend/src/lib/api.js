import axios from 'axios'

export const AxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5001/api",
    withCredentials: true
})

const signup = async (signUpData) => {
    const res = await AxiosInstance.post("/auth/signup", signUpData);
    return res.data;
}

const login = async (loginData) => {
    const res = await AxiosInstance.post("/auth/login", loginData);
    return res.data;
}

const logout = async () => {
    try {
        const res = await AxiosInstance.post("/auth/logout");
        return res.data;
    } catch (error) {
        console.error("Error IN api.js logout");

    }
}

const getAuthUser = async () => {
    try {
        const res = await AxiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.error("error in api.js getAuthUser", error);
        return null;
    }

};

const completeOnBoarding = async (userData) => {
    const res = await AxiosInstance.post("/auth/onboarding", userData);
    return res.data;
}

const getRecommandedUsers = async () => {
    const res = await AxiosInstance.get('/users');
    return res.data
}

const getFriends = async () => {
    const res = await AxiosInstance.get('/users/friends');
    return res.data;
}

const getOutgoingRequests = async () => {
    const res = await AxiosInstance.get('/users/outgoing-friend-requests');
    console.log(res.data);
    return res.data.outgoingRequests;
}

const sendFriendRequest = async (userId) => {
    const res = await AxiosInstance.post(`/users/friend-requests/${userId}`);
    console.log(res)
    return res.data;
}

const getFriendRequests = async () => {
    const res = await AxiosInstance.get(`/users/friend-requests`);

    return res.data;
}

const actionFriendRequest = async ({userId, type}) => {
    console.log(userId, type);
    if(!type || !['accept', 'reject'].includes(type)) return null;
    const res = await AxiosInstance.put(`/users/friend-requests/${userId}/${type}`);
    return res.data
}

const getStreamToken = async () => {
    const res = await AxiosInstance.get('/chat/token');
    return res.data;
}

export default { signup, login, logout, getAuthUser, getFriends, getRecommandedUsers, getOutgoingRequests, getStreamToken, getFriendRequests, completeOnBoarding, sendFriendRequest, actionFriendRequest }
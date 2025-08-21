import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import Notifications from "./pages/Notifications";
import OnboardingPage from "./pages/OnboardingPage";
import { AxiosInstance } from "./lib/api";
import { useQuery } from "@tanstack/react-query";
import RoutIng from "./hooks/RoutIng";


function App() {
    const getUsers = async () => {
        const res = await AxiosInstance.get("/auth/me");
        return res.data;
    };
    const { data: authData, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: getUsers,
        retry: false,
    });
    const authUser = authData?.user;
    console.log(error)
    return (
        <div data-theme="coffee" className="h-screen">
            <Routes>
                <Route
                    path="/"
                    element={<RoutIng isAllow={authUser} redirect={'/signup'}><HomePage/></RoutIng>}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/call" element={<CallPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;

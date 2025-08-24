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
import RoutIng from "./hooks/RoutIng";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import useTheme from "./stores/useThemeStore";

function App() {
    const { authUser, isLoading } = useAuthUser();
    const isAuth = Boolean(authUser);
    const isOnBoarded = authUser?.isOnboarded;
    const {theme} = useTheme();
    if (isLoading) return <PageLoader />;

    return (
        <div data-theme={theme} className="min-h-screen">
            <Routes>
                <Route
                    path="/"
                    element={
                        <RoutIng
                            isAllow={isAuth && isOnBoarded}
                            redirect={isAuth ? "/onboarding" : "/login"}
                        >
                            <Layout showSidebar={true}>
                                <HomePage />
                            </Layout>
                        </RoutIng>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RoutIng isAllow={!isAuth} redirect="/">
                            <SignUpPage />{" "}
                        </RoutIng>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RoutIng isAllow={!isAuth} redirect="/">
                            <LoginPage />
                        </RoutIng>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <RoutIng isAllow={isAuth} redirect={"/login"}>
                            <Notifications />
                        </RoutIng>
                    }
                />
                <Route
                    path="/call"
                    element={
                        <RoutIng isAllow={isAuth} redirect={"/login"}>
                            <CallPage />
                        </RoutIng>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <RoutIng isAllow={isAuth} redirect={"/login"}>
                            <ChatPage />
                        </RoutIng>
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        <RoutIng
                            isAllow={isAuth && !isOnBoarded}
                            redirect={isAuth ? "/" : "/login"}
                        >
                            <OnboardingPage />
                        </RoutIng>
                    }
                />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
    CallControls,
    CallingState,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
    const { id: callId } = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const { authUser, isLoading } = useAuthUser();
    
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: api.getStreamToken,
        enabled: !!authUser,
    });

    useEffect(() => {
        const initCall = async () => {
            if (!tokenData.token || !authUser || !callId) return;

            try {
                console.log("initializing call page");

                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic,
                };

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                });

                const callInstance = videoClient.call("default", callId);
                await callInstance.join({ create: true });
                setCall(callInstance)
                setClient(videoClient)
                console.log("JOINED successfully.");
            } catch (error) {
                console.error("Err joing video call", error);
                toast.error("Could not join the call, try again later.");
            } finally {
                setIsConnecting(false);
            }
        };
        initCall();
    }, [tokenData, authUser, callId]);
    if (isLoading || isConnecting) return <PageLoader />;

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>
                            Could not initialize call. Please refresh or try
                            again later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const Navigate = useNavigate();

    if (callingState === CallingState.LEFT) return Navigate("/");

    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    );
};

export default CallPage;

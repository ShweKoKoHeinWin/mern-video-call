import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "./ChatLoader";
import CallButton from "../components/CallButton";

const ChatPage = () => {
    const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id: targetUserId } = useParams();
    const { authUser } = useAuthUser();
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: api.getStreamToken,
        enabled: !!authUser,
    });
    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser) return;

            try {
                const client = StreamChat.getInstance(STREAM_API_KEY);

                await client.connectUser(
                    {
                        id: authUser._id,
                        name: authUser.fullName,
                        image: authUser.profilePic,
                    },
                    tokenData.token
                );

                const channelId = [authUser._id, targetUserId].sort().join("-");
                const curChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId],
                });

                await curChannel.watch();

                setChatClient(client);
                setChannel(curChannel);
            } catch (error) {
                console.error("Error initializing chat: ", error);
                toast.error("Could Not connect to chat. PLease try again.");
            } finally {
                setLoading(false);
            }
        };

        initChat();
    }, [tokenData, authUser, targetUserId]);

    const handleVideoCall = () => {
        if(channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;

            channel.sendMessage({
                text: `I've started a video call. Join me here ${callUrl}`
            })
            toast.success("Video Call link sent successfully.")
        }
    }

    if (loading || !chatClient || !channel) return <ChatLoader />;

    return (
        <div className="h-[93vh]">
          {authUser.fullName}
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput focus />
                        </Window>
                    </div>
                    <Thread/>
                </Channel>
            </Chat>
        </div>
    );
};

export default ChatPage;

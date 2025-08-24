import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api, { AxiosInstance } from "../lib/api";
import { Link } from "react-router";
import {
    CheckCircleIcon,
    MapPinIcon,
    UserPlusIcon,
    UsersIcon,
} from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriends from "../components/NoFriends";
import Utils from "../lib/utils";

const HomePage = () => {
    const queryClient = useQueryClient();
    const [outGoingFriendRequestIds, setOutGoingFriendRequestIds] = useState(
        new Set([])
    );
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: api.getFriends,
    });

    const { data: recommandedUsers = [], isLoading: loadingRecommandedUsers } =
        useQuery({ queryKey: ["users"], queryFn: api.getRecommandedUsers });

    const { data: outGoingFriendRequests = [] } = useQuery({
        queryKey: ["outGoingFriendRequests"],
        queryFn: api.getOutgoingRequests,
    });

    const { mutate: mutateFriendRequest, isPending } = useMutation({
        mutationFn: api.sendFriendRequest,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["outGoingFriendRequests"],
            }),
    });

    useEffect(() => {
        const outGoingIds = new Set();
        if (outGoingFriendRequests && outGoingFriendRequests.length > 0) {
            outGoingFriendRequests.forEach((req) => {
                outGoingIds.add(req.recipent._id);
            });
            setOutGoingFriendRequestIds(outGoingIds);
            console.log(outGoingFriendRequestIds, outGoingIds);
        }
    }, [outGoingFriendRequests]);

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="container mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-light">
                        Your Friends
                    </h2>
                    <Link
                        to="/notifications"
                        className="btn btn-outline btn-sm"
                    >
                        <UsersIcon className="mr-2 size-4" /> Friend Requests
                    </Link>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loadgin-spiner loading-lg" />
                    </div>
                ) : friends.length === 0 ? (
                    <NoFriends />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-col-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} />
                        ))}
                    </div>
                )}

                <section>
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    Meet New Learners
                                </h2>
                                <p className="opacity-70">
                                    Discover perfect language exchange partners
                                    based on your profile.
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingRecommandedUsers ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : recommandedUsers.length === 0 ? (
                        <div className="card bg-base-200 p-6 text-center">
                            <h3 className="font-semibold text-lg mb-2">
                                No recommandations available
                            </h3>
                            <p className="text-base-content opacity-70">
                                Check back later for new language partners
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommandedUsers.map((user) => {
                                const hasRequestBeenSent = outGoingFriendRequestIds.has(String(user._id))
                                console.log(outGoingFriendRequestIds, user._id);
                                
                                return (
                                    <div
                                        key={user._id}
                                        className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="card-body p-5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar size-16 rounded-full">
                                                    <img
                                                        src={user.profilePic}
                                                        alt={user.fullName}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {user.fullName}
                                                    </h3>
                                                    {user.location && (
                                                        <div className="flex items-center text-xs opacity-70 mt-1">
                                                            <MapPinIcon className="size-3 mr-1" />{" "}
                                                            {user.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                <span className="badge badge-secondary text-xs">
                                                    <img
                                                        src={Utils.getLanguageFlag(
                                                            user.nativeLanguage
                                                        )}
                                                        alt=""
                                                        className="h-3 mr-1 inline-block"
                                                    />
                                                    Native:{" "}
                                                    {Utils.Str.capitalize(user.nativeLanguage)}
                                                </span>
                                                <span className="badge badge-outline text-xs">
                                                    <img
                                                        src={Utils.getLanguageFlag(
                                                            user.learningLanguage
                                                        )}
                                                        alt=""
                                                        className="h-3 mr-1 inline-block"
                                                    />
                                                    Learning:{" "}
                                                    {Utils.Str.capitalize(user.learningLanguage)}
                                                </span>
                                            </div>
                                            {user.bio && (
                                                <p className="text-sm opacity-70">
                                                    {user.bio}
                                                </p>
                                            )}

                                            <button
                                                className={`btn w-full mt-2 ${
                                                    hasRequestBeenSent
                                                        ? "btn-disabled"
                                                        : "btn-primary"
                                                }`}
                                                onClick={() =>
                                                    mutateFriendRequest(
                                                        user._id
                                                    )
                                                }
                                                disabled={
                                                    hasRequestBeenSent ||
                                                    isPending
                                                }
                                            >
                                                {hasRequestBeenSent ? (
                                                    <>
                                                        <CheckCircleIcon className="size-4 mr-2" />
                                                        Request Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlusIcon className="size-4 mr-2" />
                                                        Send Friend Request
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;

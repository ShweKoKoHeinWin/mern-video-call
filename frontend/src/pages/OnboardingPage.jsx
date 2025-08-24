import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import {
    CameraIcon,
    EarthIcon,
    LoaderIcon,
    MapPinIcon,
    ShipWheel,
    ShuffleIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
    const { isLoading, authUser } = useAuthUser();
    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
    });

    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: api.completeOnBoarding,
        onSuccess: () => {
            toast.success("Profile Created Successfully.");
            queryClient.invalidateQueries({queryKey: ['authUser']})
        },
        onError: (err) => {
            toast.error(err.response.data.message)
        }
    });

    const handleOnSubmit = (e) => {
        e.preventDefault();
        mutate(formState);
    };
    const generateRandamAvatar = () => {
      const idx = Math.floor(Math.random() * 100) + 1
      setFormState(prev => ({...prev, profilePic: `https://avatar.iran.liara.run/public/${idx}.png`})) ;
      toast.success("Avatar generated successfully.")
    };
    return (
        <div
            className="min-h-screen bg-base-100 flex items-center justify-center p-4"
            data-theme="forest"
        >
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                        Complete Your Profile
                    </h1>

                    <form onSubmit={handleOnSubmit} className="space-y-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-full">
                                <div className="size-32 rounded-full bg-base-300 overflow-hidden mx-auto mb-2">
                                    {formState.profilePic ? (
                                        <img
                                            src={formState.profilePic}
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <CameraIcon className="size-12 text-base-content opacity-40" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={generateRandamAvatar}
                                        className="btn btn-accent"
                                    >
                                        <ShuffleIcon className="size-4 mr-2" />{" "}
                                        Generate Random Avatar
                                    </button>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="" className="label">
                                        <span className="label-text">
                                            Full Name
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={formState.fullName}
                                        onChange={(e) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                fullName: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="" className="label">
                                        <span className="label-text">Bio</span>
                                    </label>
                                    <textarea
                                        name="bio"
                                        id=""
                                        className="textarea textarea-bordered h-24"
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                bio: e.target.value,
                                            })
                                        }
                                        placeholder="Tell others about yourself and your language learning goals."
                                        value={formState.bio}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="form-control">
                                        <label htmlFor="" className="label">
                                            <span className="label-text">
                                                Native language
                                            </span>
                                        </label>
                                        <select
                                            name="nativeLanguage"
                                            id=""
                                            className="select select-bordered w-full"
                                            value={formState.nativeLanguage}
                                            onChange={(e) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    nativeLanguage:
                                                        e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">
                                                Select Your Native language
                                            </option>
                                            {LANGUAGES.map((l) => (
                                                <option
                                                    key={l}
                                                    value={l.toLowerCase()}
                                                >
                                                    {l}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                     <div className="form-control">
                                        <label htmlFor="" className="label">
                                            <span className="label-text">
                                                Learning language
                                            </span>
                                        </label>
                                        <select
                                            name="learningLanguage"
                                            id=""
                                            className="select select-bordered w-full"
                                            value={formState.learningLanguage}
                                            onChange={(e) =>
                                                setFormState((prev) => ({
                                                    ...prev,
                                                    learningLanguage:
                                                        e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">
                                                Select Your Learning language
                                            </option>
                                            {LANGUAGES.map((l) => (
                                                <option
                                                    key={l}
                                                    value={l.toLowerCase()}
                                                >
                                                    {l}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label htmlFor="" className="label">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                        <input
                                            type="text"
                                            className="input input-bordered w-full pl-10"
                                            placeholder="City, Country"
                                            value={formState.location}
                                            onChange={e => setFormState(prev => ({...prev, location: e.target.value}))}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-full mt-4"
                                    type="submit"
                                    disabled={isPending}
                                >
                                    {!isPending ? (
                                        <>
                                            <ShipWheel className="size-5 mr-2" />
                                            Complete Onboarding
                                        </>
                                    ) : (
                                        <>
                                            <LoaderIcon className="size-5 mr-2 animate-spin" />
                                            Onboarding ....
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;

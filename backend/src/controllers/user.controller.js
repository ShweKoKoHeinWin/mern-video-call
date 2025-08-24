import FriendRequest from "../models/FriendRequest.mode.js";
import User from "../models/User.model.js";

const getRecommendedUsers = async (request, response) => {
    try {
        const currentUserId = request.user.id;
        const currentUser = request.user;
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        });

        response.status(200).json(recommendedUsers)
    } catch (error) {
        console.error("Error in getRecommendedUsers controller.", error.message);
        response.status(500).json({ message: "Internal Server Error." })
    }
}

const getMyFriends = async (request, response) => {
    try {
        const user = await User.findById(request.user.id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        response.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in getMyFriends controller.", error.message);
        response.status(500).json({ message: "Internal Server Error." })
    }
}

const sendFriendRequest = async (request, response) => {
    try {
        const myId = request.user.id;
        const { id: recipentId } = request.params;
        if (myId === recipentId) return response.status(400).json({ message: "You can't send friend request to yourself." });
        

        const recipent = await User.findById(recipentId);
        if (!recipent) return response.status(400).json({ message: "User not found." });
        if (recipent.friends.includes(myId)) return response.status(400).json({ message: "You are already friends with this user." });


        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipent: recipentId },
                { sender: recipentId, recipent: myId }
            ]
        })
        
        if (existingRequest) return response.status(400).json({ message: "A friend request already exists between you and this user." })

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipent: recipentId
        })

        response.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in user.controller sendFriendRequest.", error);
        response.status(500).json({ message: "Internal server error." })
    }
}

const acceptFriendRequest = async (request, response) => {
    try {
        const myId = request.user.id;
        const { id: requestId } = request.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) return response.status(400).json({ message: "Friend request not found" });

        if (friendRequest.recipent.toString() !== myId) return response.status(400).json({ message: "You have unauthorized to accept the request." })

        if (friendRequest.status !== 'pending') return response.status(400).json({ message: "This request is over." })

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.recipent, {
            $addToSet: { friends: friendRequest.sender }
        })

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipent }
        })

        response.status(200).json({ message: "Friend request accept." })
    } catch (error) {
        console.error("Error in user.controller acceptFriendRequest.");
        response.status(500).json({ message: "Internal server error." });
    }
}

const rejectFriendRequest = async (request, response) => {

}

const getFriendRequests = async (request, response) => {
    try {

        const imcomingRequests = await FriendRequest.find({ recipent: request.user.id, status: "pending" }).populate('sender', "fullName profilePic nativeLanguage learningLanguage");
        const acceptedRequests = await FriendRequest.find({ sender: request.user.id, status: "accepted" }).populate('recipent', "fullName profilePic");

        response.status(200).json({ imcomingRequests, acceptedRequests });
    } catch (error) {
        console.error("Error in user.controller getFriendRequests.");
        response.status(500).json({ message: "Internal server error." });
    }
}

const getOutgoingRequests = async (request, response) => {
    try {

        const outgoingRequests = await FriendRequest.find({ sender: request.user.id, status: "pending" }).populate('recipent', "fullName profilePic nativeLanguage learningLanguage");

        response.status(200).json({ outgoingRequests });
    } catch (error) {
        console.error("Error in user.controller getOutgoingRequests.");
        response.status(500).json({ message: "Internal server error." });
    }
}

export default { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, getOutgoingRequests }
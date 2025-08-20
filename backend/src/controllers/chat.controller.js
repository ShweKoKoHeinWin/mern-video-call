import { generateStreamToken } from "../lib/stream.js"

const getStreamToken = async (request, response) => {
    try {
        const token = generateStreamToken(request.user.id);

        response.status(200).json({token});
    } catch (error) {
        console.error("Error in chat.controller getStreamToken");
        response.status(500).json({message: "Internal server error."});
    }
}

export default {getStreamToken}
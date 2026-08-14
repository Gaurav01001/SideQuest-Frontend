import { useEffect } from "react";
import { getSocket } from "../api/socket";
import useAuthStore from "../store/auth.store";

const useSocket = () => {
    const socket = getSocket();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!socket || !user) return;

        const handleReceiveMessage = (data) => {
            console.log("New realtime message:", data);
        };

        // Example: listen to incoming messages
        socket.on("receive_message", handleReceiveMessage);

        // Cleanup event listeners on unmount
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket, user]);

    // Function to send messages
    const sendMessage = (receiverId, content) => {
        if (socket && user) {
            socket.emit("send_message", {
                senderId: user.id,
                receiverId,
                content
            });
        }
    };

    return { socket, sendMessage };
};

export default useSocket;
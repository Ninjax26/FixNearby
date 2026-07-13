import { io } from "socket.io-client";

let socketSingleton = null;

const getServerUrl = () => {
  // Match backend websocket URL used in server/server.js and CSP.
  // Allows overriding in deployments.
  return import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
};

export const getSocket = () => {
  if (socketSingleton) return socketSingleton;

  socketSingleton = io(getServerUrl(), {
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: true,
  });

  return socketSingleton;
};

export const disconnectSocket = () => {
  if (socketSingleton) {
    socketSingleton.disconnect();
    socketSingleton = null;
  }
};


import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_SOCKET_URL } from "../Url/Url";

type TContext = {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  dark:string;
  light:string;
};

const getSocket = () => {
  return io(BASE_SOCKET_URL);
};

const socketContext = createContext<TContext | null>(null);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<TContext['socket']>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  let dark = 'bg-[#0f1c2e]';
  let light = 'bg-[#eceff8]';


  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, setSocket, isChecked, setIsChecked ,dark,light}}>
      {children}
    </socketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };

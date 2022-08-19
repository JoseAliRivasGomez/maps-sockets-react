import { useEffect, useState } from "react"
import { getEnvVariables } from "../helpers/getEnvVariables";
import { useSocket } from "../hooks/useSocket";
import { SocketContext } from "./SocketContext"

const {VITE_API_URL} = getEnvVariables();

export const SocketProvider = ({children}) => {

    const {socket, online} = useSocket(VITE_API_URL);

    

    const newMarker = (marcador) => {
        socket.emit('marcador-nuevo', marcador);
    }

    const updateMarker = (marcador) => {
        socket.emit('marcador-actualizado', marcador);
    }

    return (
        <SocketContext.Provider value={{
            socket, 
            online,
            newMarker,
            updateMarker,
        }}>
            {children}
        </SocketContext.Provider>
    )
}

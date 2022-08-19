import { useMemo } from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react'


export const useSocket = (serverPath) => {
  
    const socket = useMemo(() => io.connect(serverPath, {
        transports: ['websocket']
    }), [serverPath]);

    const [online, setOnline] = useState(false);

    useEffect(() => {

        return () => {
          socket.disconnect();
        }
    }, [])
  
    useEffect(() => {
        setOnline(socket.connected);
    }, [socket]);

    useEffect(() => {
        socket.on('connect', () => {
            setOnline(true);
        });
        //return socket.disconnect();
    }, [socket])

    useEffect(() => {
        socket.on('disconnect', () => {
            setOnline(false);
        })
    }, [socket])

    return {
        socket,
        online
    }

}

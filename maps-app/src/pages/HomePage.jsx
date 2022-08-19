
import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -84.4310,
    lat: 10.3231,
    zoom: 13.5
}

export const HomePage = () => {

    const {socket, newMarker, updateMarker} = useContext(SocketContext);

    const {coords, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarMarcador} = useMapbox(puntoInicial);

    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
          for (const key of Object.keys(marcadores)) {
            agregarMarcador(marcadores[key], key);
          }
        })
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        })
        socket.on('marcador-actualizado', (marcador) => {
            actualizarMarcador(marcador);
        })
        return () => {
            socket.off('marcadores-activos');
            socket.off('marcador-nuevo');
            socket.off('marcador-actualizado');
        }
    }, [socket])
    
    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
            newMarker(marcador);
        })
        return () => {
            nuevoMarcador$.unsubscribe();
        }
    }, [nuevoMarcador$])

    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            updateMarker(marcador);
        })
        return () => {
            movimientoMarcador$.unsubscribe();
        }
    }, [movimientoMarcador$])
    
  return (
    <>
        <div className='info'>Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}</div>
        <div ref={setRef} className='mapContainer'>

        </div>
    </>
  )
}

import mapboxgl, { Marker } from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getEnvVariables } from '../helpers/getEnvVariables';
import {v4} from 'uuid';
import {Subject} from 'rxjs';

const {VITE_MAPS_TOKEN} = getEnvVariables();
mapboxgl.accessToken = VITE_MAPS_TOKEN;

export const useMapbox = (puntoInicial) => {
  
    const mapaDiv = useRef();
    const setRef = useCallback( (node) => {
        mapaDiv.current = node;
    },[]);

    const marcadores = useRef({});

    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());
    
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    const agregarMarcador = useCallback((ev, id) => {
        const {lng, lat} = ev.lngLat ?? ev;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();
        marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
        marcadores.current[marker.id] = marker;

        if(!id){
            nuevoMarcador.current.next({
                id: marker.id,
                lng, 
                lat
            });
        }

        marker.on('drag', (ev) => {
            const {id} = ev.target;
            const {lng, lat} = ev.target.getLngLat();

            movimientoMarcador.current.next({
                id,
                lng, 
                lat,
            });
        })
    },[])

    const actualizarMarcador = useCallback(({id, lng, lat}) => {
        marcadores.current[id].setLngLat([lng,lat]);
    },[])

    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapaDiv.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
            zoom: puntoInicial.zoom, // starting zoom
            //projection: 'globe' // display the map as a 3D globe
        });
        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
        });
        mapa.current = map;

    }, [puntoInicial]);

    useEffect(() => {

        mapa.current?.on('move', () => {
            const {lng, lat} = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2),
            })
        })

        return () => {
            mapa.current?.off('move');
        }
      
    }, []);

    useEffect(() => {

        mapa.current?.on('click', (ev) => {
            agregarMarcador(ev);
        });
    
      return () => {
          mapa.current?.off('click');
      }
    }, [agregarMarcador]);
    

    return {
        coords,
        setRef,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        agregarMarcador,
        actualizarMarcador
    }

}

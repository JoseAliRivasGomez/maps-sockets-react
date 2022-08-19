const Markers = require("./markers");


class Sockets {

    constructor(io){
        this.io = io;

        this.markers = new Markers();

        this.socketEvents();
    }

    socketEvents(){

        this.io.on('connection', (socket) => { 

            console.log('Cliente conectado');

            

            socket.emit('marcadores-activos', this.markers.activos);

            socket.on('marcador-nuevo', (marcador) => {
                //console.log(marcador);
        
                this.markers.addMarker(marcador);
                socket.broadcast.emit('marcador-nuevo', marcador); //se lo manda a los demas
            });

            socket.on('marcador-actualizado', (marcador) => {
                //console.log(marcador);
        
                this.markers.updateMarker(marcador);
                socket.broadcast.emit('marcador-actualizado', marcador); //se lo manda a los demas
            });

            // socket.on('mensaje-a-server', (data) => {
            //     console.log(data);
        
            //     this.io.emit('mensaje-de-server', data);
            // });
        
            //console.log('Dispositivo cliente conectado');
            //console.log(socket.id);
        
            // socket.emit('mensaje-bienvenida', {
            //     msg: 'Bienvenido al servidor',
            //     fecha: new Date(),
            // });
        
            // socket.on('mensaje-cliente', (data) => {
            //     console.log(data);
            // });
        
        
        
        });

    }

}

module.exports = Sockets;
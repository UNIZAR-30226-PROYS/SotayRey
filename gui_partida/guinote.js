//var ejeX = 800;
//var ejeY = 600;
var ejeX = window.innerWidth * window.devicePixelRatio;
//var ejeY = window.innerHeigth * window.devicePixelRatio;
var ejeY = window.innerHeight * window.devicePixelRatio;
var escalaCartas = 0.5;
var scaleRatio = 0.5;
var ejeXCarta = 80; // esto en una apartado de game options
var ejeYCarta = 123;
var escalaCarta = 1;
console.log(ejeX);
console.log(window.innerHeight);
console.log(window.devicePixelRatio);
console.log(ejeY);
//var scaleRatio = window.devicePixelRatio / 3;

// para que sea responsive:  https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
// en vez de Phaser.AUTO -> Phaser.CANVAS
var game = new Phaser.Game(ejeX, ejeY, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.spritesheet("cartas", "assets/naipes.png", ejeXCarta, ejeYCarta);
    game.load.image('naipe', 'assets/naipe.png');
    game.load.image('cuadroCarta', 'assets/cuadroCarta.png');

}

/* VARIABLES GLOBALES */

var tipoPartida = 1; // 0 = 1vs1, 1 = 2vs2

var misCartas;

// Variables de los jugadores

var jRef;
jRef = {};
jRef.nombre = "ref";
jRef.XPosMedia = ejeX / 2;
jRef.YPosMedia = ejeY * 0.80;
jRef.sumX = ejeXCarta;
jRef.sumY = 0;
jRef.XLanzar = jRef.XPosMedia;
jRef.YLanzar = jRef.YPosMedia - ejeYCarta * 2;
//jRef.YLanzar = 300;
jRef.cartaLanzada;
//jRef.numCartas;
jRef.dorso;
jRef.rotacion = 0;

var jIzq;
jIzq = {};
jIzq.XPosMedia = ejeX * 0.2;
jIzq.YPosMedia = ejeY / 2;
jIzq.sumX = 0;
jIzq.sumY = ejeXCarta; // es ejeX porque esta tumbada
jIzq.XLanzar = jIzq.XPosMedia + ejeYCarta * 1.10;
jIzq.YLanzar = jIzq.YPosMedia;
jIzq.cartaLanzada;
//jIzq.numCartas;
jIzq.dorso;
jIzq.rotacion = 90;


var jArriba;
jArriba = {};
jArriba.XPosMedia = ejeX / 2;
jArriba.YPosMedia = ejeY * 0.02;
jArriba.sumX = ejeXCarta;
jArriba.sumY = 0;
jArriba.XLanzar = jArriba.XPosMedia;
jArriba.YLanzar = jArriba.YPosMedia + ejeYCarta * 1.10;
jArriba.cartaLanzada;
//jArriba.numCartas;
jArriba.dorso;
jArriba.rotacion = 0;

var jDer;

var arrayJugadoresDefecto = [jRef, jIzq, jArriba, jDer];
var arrayJugadores;

function inicializarRef(){ // TODO esto al final creo que no debería estar
    for (i = 0; i < 6; i++){
        var carta = jRef.cartasEnMano.create(0, 0, 'cartas');
        carta.frame = i;
    }
    dibujarJugador(jRef);
    dibujarCuadroCarta(jRef);
}

function inicializarJugadores(){
    crearCartas(jArriba);
    dibujarCuadroCarta(jArriba);
    if (tipoPartida == 1){
        crearCartas(jIzq);
        dibujarCuadroCarta(jIzq);
   }
}

function dibujarCuadroCarta(jugador){
    var cuadro = game.add.sprite(jugador.XLanzar, jugador.YLanzar, 'cuadroCarta');
    cuadro.width = ejeXCarta;
    cuadro.height = ejeYCarta;
    cuadro.angle = jugador.rotacion;
    //cuadro.scale.setTo(escalaCarta, escalaCarta);
}

function crearCartas(jugador){
    for (i = 0; i < 6; i++){
        jugador.cartasEnMano.create(0, 0, 'cartas');
    }
}

function dibujarJugador(identificador){
    var jugador = identificador;

    var i = - jugador.cartasEnMano.length/2; // Para que al final la posición sea centrada


    jugador.cartasEnMano.forEach(function(item) {
        item.x = jugador.XPosMedia + i*jugador.sumX;
        item.y = jugador.YPosMedia + i*jugador.sumY;
        //item.loadTexture(jugador.dorso, 0);
        if (jugador.nombre != "ref") {
            item.frame = 12; // TODO modificar esto para que sea el dorso
        }
        item.angle = jugador.rotacion;
        //item.scale.setTo(escalaCarta, escalaCarta);
        console.log("pongo carta en mesa");
        console.log(item.x);
        console.log(item.y);
        i = i + 1;
    }, this);

}


function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#009933";
    //misCartas = game.add.group();
    //anyadirCarta(misCartas,0);
    //anyadirCarta(misCartas,1);
    //actualizarCartas(misCartas);

    // Botones de acción
    cantarVeinte = game.add.text(ejeX - 300, ejeY - 200, '', { fill: '#ffffff' });
    cantarCuarenta = game.add.text(ejeX - 300, ejeY - 150, '', { fill: '#ffffff' });
    cambiarTriunfo = game.add.text(ejeX - 300, ejeY - 100, '', { fill: '#ffffff' });

    cantarVeinte.text = "CANTAR 20";
    cantarCuarenta.text = "CANTAR 40";
    cambiarTriunfo.text = "CAMBIAR TRIUNFO";

    // Los huecos para tirar las cartas de los jugadores
    //yo = game.add.sprite(game.world.centerX-50, game.world.centerY-50, 'cuadroCarta');
    //yo.scale.setTo(0.1, 0.1);


    // Pruebas
    jArriba.cartasEnMano = game.add.group();
    jIzq.cartasEnMano = game.add.group();
    jRef.cartasEnMano = game.add.group();
    inicializarJugadores();
    dibujarJugador(jArriba);
    dibujarJugador(jIzq);
    inicializarRef();
}

function onDragStop(sprite) {

    sprite.x = sprite.origenX;
    sprite.y = sprite.origenY;


}

function listener (item) {
    console.log("pulsaron la cartita");
    console.log(item.nombre);
}


function render() {

    // Input debug info
    game.debug.inputInfo(32, 32);
    //game.debug.spriteInputInfo(sprite, 32, 130);
    game.debug.pointer( game.input.activePointer );

}

function update() {

    // Nada por el momento
}

/* Funciones de Cartas */




function anyadirCarta(conjuntoCartas, numCarta){
    var carta = conjuntoCartas.create(0, 0, 'cartas');
    carta.frame = numCarta; // TODO indexar la correspondiente

    /* OPCIONES */
    carta.nombre = "carta bonita";
    carta.events.onInputDown.add(lanzarCarta, this);
    carta.inputEnabled = true;
}

function actualizarCartas(grupoCartas){
    //cartas.inputEnabled = true;
    //cartas.input.enableDrag();
    //cartas.input.enableDrag();
    //cartas.input.enableDrag(false, true);
    var i = 0;

    grupoCartas.forEach(function(item) {
        item.x = ejeXCarta * escalaCarta * i;
        item.y = ejeY - 200;
        item.scale.setTo(escalaCarta, escalaCarta);
        i = i + 1;
    }, this);

}

function lanzarCartaConfirmar(numCarta){
    misCartas.forEach(function(item) {
        if (item.frame == numCarta){
            item.x = game.world.centerX-50;
            item.y = game.world.centerY-50;
            //item.scale.setTo(escalaCarta, escalaCarta);
            game.world.bringToTop(item);
        }
    }, this);
}

function lanzarCarta (item) {
    console.log("pulsaron la carta " + item.frame +", enviando mensaje");
    console.log(item.nombre);
    enviarMensaje("-----");
    lanzarCartaConfirmar(item.frame);
}


/* PROXY */

function enviarMensaje(mensaje){
    // TODO se envia el mensaje al backend
}

function recibirMensaje(){

}
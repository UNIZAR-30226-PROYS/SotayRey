//var ejeX = 800;
//var ejeY = 600;
//var ejeX = window.innerWidth * window.devicePixelRatio;
//var ejeY = window.innerHeigth * window.devicePixelRatio;
//var ejeY = window.innerHeight * window.devicePixelRatio;

/* PORCENTAJES RESPONSIVE */
var numBotones = 2;
var zonaJugableY = 0.9; // Porcentaje


var ejeXBotones = window.innerWidth;
var ejeYBotones = window.innerHeight * zonaJugableY + ( window.innerHeight *(1-zonaJugableY)*0.20);

/* VARIABLES PANTALLA */


var ejeX = window.innerWidth;
var ejeY = window.innerHeight * zonaJugableY;


//var ejeX = window.innerWidth; // Zona jugable
//var ejeY = window.innerHeight * zonaJugableY;
var escalaCartas = 0.5;
var scaleRatio = 0.5;
var ejeXCartaOriginal = 80; // esto en una apartado de game options
var ejeYCartaOriginal = 123;
var ejeXCarta = (ejeX * 0.8) / 6;
var ejeYCarta = ejeXCarta*(ejeYCartaOriginal/ejeXCartaOriginal);

var avatarEjeX = ejeXCarta * 0.5;
var avatarEjeY = avatarEjeX;

var escalaCarta = 1;
//var escalaCarta = ejeX / 5/ ejeXCarta;
console.log(ejeX);
console.log(window.innerHeight);
console.log(window.devicePixelRatio);
console.log(ejeY);
//var scaleRatio = window.devicePixelRatio / 3;

var partidaAcabada = false;

// para que sea responsive:  https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
// en vez de Phaser.AUTO -> Phaser.CANVAS
//var game = new Phaser.Game(ejeX, ejeY / zonaJugableY, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(ejeX, ejeY / zonaJugableY, Phaser.CANVAS, '', { preload: preload, create: create, update: update});

/**
 * Precarga las imagenes y sonidos que se utilizaran en el juego
 */
function preload() {
    game.load.spritesheet("cartas", "assets/naipes.png", ejeXCartaOriginal, ejeYCartaOriginal);
    game.load.image('naipe', 'assets/naipe.png');
    game.load.image('cuadroCarta', 'assets/dragHere.png');
    game.load.image('turno', 'assets/turno.png');
    game.load.image('tapete', tapete);
    game.load.image('avatar', 'assets/avatar.png');
    game.load.image('victoria', 'assets/victoria.png');
    game.load.image('derrota', 'assets/derrota.png');
    game.load.image('dorsoBase', 'assets/dorsoBase.jpg');
    game.load.image('botonSonido', 'assets/botonSonido.png');
    game.load.image('botonSalir', 'assets/botonSalir.png');
    game.load.image('bordeHUD', 'assets/bordeHUD.png');
    game.load.audio('musica', ['assets/musica.mp3']);

    // SFX
    game.load.audio('20', 'assets/sfx/20.mp3');
    game.load.audio('40', 'assets/sfx/40.mp3');
    game.load.audio('40ReyAs', 'assets/sfx/40ReyAs.mp3');
    game.load.audio('arrastro', 'assets/sfx/arrastro.mp3');
    game.load.audio('arrastroZarzal', 'assets/sfx/arrastroZarzal.mp3');
    game.load.audio('deVueltas', 'assets/sfx/deVueltas.mp3');
    game.load.audio('vueltas', 'assets/sfx/vueltas.mp3');
}

/* VARIABLES GLOBALES */

//var numJugadores = 4; // Define el tipo de partida en función del número de jugadores

var misCartas;

// Variables de los jugadores
//var miID = 0;
//var idPartida = 0;


/* se inicializan con la funcion inicializarDispositivo */
var jRef;
var jIzq;
var jArriba;
var jDer;

var turno; // punto rojo que indica el turno
var idContador = 0;

var partida_pausa = false; // si se desconecta algun jugador
var textoDesconectado;

var triunfo;
triunfo = {};
triunfo.carta = {}
triunfo.x = ejeX / 2;
triunfo.y = (ejeY / 2) * 0.85;

var estanCantando = false;

var arrayJugadoresDefecto = [];
var arrayJugadores = [];

// SFX
var veSFX;
var cuaSFX;
var cuaRASFX;
var arrSFX;
var arrZarSFX;
var vueltasSFX;
var deVueltasSFX;

/**
 *  Inicializa las variables que dependen de la resolucion del dispositivo
 */
function inicializarDispositivo(){
    var anchura = window.innerWidth / window.devicePixelRatio;
    console.log("EL EJE X ES: " + anchura);
    if (anchura > 800){
        console.log("dispositivo grande");
        console.log(ejeX);
        ejeXCarta = ejeXCartaOriginal;
        ejeYCarta = ejeYCartaOriginal;
        avatarEjeX = ejeXCarta * 0.7;
        avatarEjeY = avatarEjeX;

    }
    else if (anchura > 420){
        console.log("dispositivo movil");
        console.log(ejeX);
        ejeXCarta = (ejeX * 0.75) / 6;
        ejeYCarta = ejeXCarta*(ejeYCartaOriginal/ejeXCartaOriginal);
        avatarEjeX = ejeXCarta * 0.45;
        avatarEjeY = avatarEjeX;
    }
    else if (anchura > 350){
        /*
        console.log("dispositivo movil");
        ejeXCarta = ejeX / 6;
        ejeYCarta = ejeXCarta*(ejeYCartaOriginal/ejeXCartaOriginal);
        avatarEjeX = ejeXCarta * 0.5;
        avatarEjeY = avatarEjeX;
/*
        var ejeXCartaOriginal = 80; // esto en una apartado de game options
        var ejeYCartaOriginal = 123;
        var ejeXCarta = (ejeX * 0.8) / 6;
        var ejeYCarta = ejeXCarta*(ejeYCartaOriginal/ejeXCartaOriginal);
        var avatarEjeX = ejeXCarta * 0.5;
        */
    }

    else{
        // El valor que esta por defecto
    }

    // Para los nombres de los usuarios
    var color = "#ffffff";
    var fuente =  "17pt impact";
    var colorBorde = 'black';
    var gordura = 4;

    jRef = {};
    jRef.nombre = "ref";
    jRef.XPosMedia = ejeX / 2;
    jRef.YPosMedia = ejeY * 0.80;
    jRef.sumX = ejeXCarta;
    jRef.sumY = 0;
    jRef.XLanzar = jRef.XPosMedia;
    jRef.YLanzar = jRef.YPosMedia - ejeYCarta * 1.20;
//jRef.YLanzar = 300;
    jRef.cartaLanzada;
    jRef.numCartas;
    jRef.cartasEnMano = game.add.group();
    jRef.rotacion = 0;
    jRef.nombreUsuario = game.add.text(jRef.XLanzar + ejeXCarta * 1.10, jRef.YLanzar + ejeYCarta * 0.8, 'usuarioRef', {font: fuente, fill: color, stroke: colorBorde, strokeThickness: gordura});

    jRef.avatar = game.add.sprite(jRef.XLanzar + ejeXCarta*1.10, jRef.YLanzar + avatarEjeY/2, 'avatar');
    //game.physics.arcade.enable([jRef.avatar]);
    //jRef.avatar.body.setCircle(45);
    jRef.avatar.height = avatarEjeY;
    jRef.avatar.width = avatarEjeX;
    jRef.dorso = 'dorsoBase';


    jIzq = {};
    jIzq.XPosMedia = ejeX * 0.15;
    jIzq.YPosMedia = ejeY / 2;
    jIzq.sumX = 0;
    jIzq.sumY = ejeXCarta; // es ejeX porque esta tumbada
    jIzq.XLanzar = jIzq.XPosMedia + ejeYCarta * 1.10;
    jIzq.YLanzar = jIzq.YPosMedia;
    jIzq.cartaLanzada;
    jIzq.numCartas;
    jIzq.cartasEnMano = game.add.group();
    jIzq.rotacion = 90;
    if (numJugadores == 4){
        jIzq.nombreUsuario = game.add.text(jIzq.XLanzar - ejeYCarta, jIzq.YLanzar - 30, 'usuarioIzq', {font: fuente, fill: color, stroke: colorBorde, strokeThickness: gordura});
        jIzq.avatar = game.add.sprite(jIzq.XLanzar - ejeXCarta*1.10, jIzq.YLanzar - 90, 'avatar');
        jIzq.avatar.height = avatarEjeY;
        jIzq.avatar.width = avatarEjeX;
    }
    jIzq.dorso = 'dorsoBase';

    jArriba = {};
    jArriba.XPosMedia = ejeX / 2;
    jArriba.YPosMedia = ejeY * 0.02;
    jArriba.sumX = ejeXCarta;
    jArriba.sumY = 0;
    jArriba.XLanzar = jArriba.XPosMedia;
    jArriba.YLanzar = jArriba.YPosMedia + ejeYCarta * 1.10;
    jArriba.cartaLanzada;
    jArriba.numCartas;
    jArriba.cartasEnMano = game.add.group();
    jArriba.rotacion = 0;
    jArriba.nombreUsuario = game.add.text(jArriba.XLanzar + ejeXCarta + 10, jArriba.YLanzar + ejeYCarta/2, 'usuarioArriba', {font: fuente, fill: color, stroke: colorBorde, strokeThickness: gordura});
    jArriba.avatar = game.add.sprite(jArriba.XLanzar + ejeXCarta + 30, jArriba.YLanzar, 'avatar');
    //game.physics.arcade.enable([jRef.avatar]);
    //jRef.avatar.body.setCircle(45);
    jArriba.avatar.height = avatarEjeY;
    jArriba.avatar.width = avatarEjeX;
    jArriba.dorso = 'dorsoBase';


    jDer = {};
    jDer.XPosMedia = ejeX * 0.85;
    jDer.YPosMedia = (ejeY / 2) * 1.15;
    jDer.sumX = 0;
    jDer.sumY = ejeXCarta;
    jDer.XLanzar = jDer.XPosMedia - ejeYCarta * 1.10;
    jDer.YLanzar = jDer.YPosMedia;
    jDer.cartaLanzada;
    jDer.numCartas;
    jDer.cartasEnMano = game.add.group();
    jDer.rotacion = 270;
    jDer.dorso = 'dorsoBase';

    if (numJugadores == 4){
        jDer.nombreUsuario = game.add.text(jDer.XLanzar + ejeXCarta/2, jDer.YLanzar - ejeXCarta - 30, 'usuarioIzq', {font: fuente, fill: color, stroke: colorBorde, strokeThickness: gordura});
        jDer.avatar = game.add.sprite(jDer.XLanzar + ejeXCarta/2, jDer.YLanzar - ejeYCarta - avatarEjeY, 'avatar');
        jDer.avatar.height = avatarEjeY;
        jDer.avatar.width = avatarEjeX;
    }


    turno = game.add.sprite(0, 0, 'turno');
    turno.height = ejeYCarta * 0.30;
    turno.width = ejeXCarta * 0.30;

    // Marco HUD
    var marco = game.add.sprite(0, 0, 'bordeHUD');
    marco.height = 110;
    marco.width = 250;

    //arrayJugadoresDefecto = [jRef, jArriba, jIzq, jDer];
    arrayJugadoresDefecto = [jRef, jIzq, jArriba, jDer];
    arrayJugadoresDefecto2 = [jRef, jArriba];

}

/**
 *  Mapeo de los jugadores para saber la posicion que ocupan
 *  en funcion  del tipo de partida y mi identificador
 */
function mapearJugadores(){
    if (numJugadores == 4){
        for (i = 0; i < numJugadores; i++) {
            arrayJugadores[(miID + i)%numJugadores] = arrayJugadoresDefecto[i];
        }
    }
    else{
        for (i = 0; i < numJugadores; i++) {
            arrayJugadores[(miID + i)%numJugadores] = arrayJugadoresDefecto2[i];
        }
    }
}

/**
 * Cambia y dibuja el triunfo sobre la mesa
 * @param numero Numero de la carta de triunfo
 * @param palo Palo de la carta de triunfo
 */
function modificarTriunfo(numero, palo){
    try{
        triunfo.carta.destroy();
    }
    catch (e) {

    }
    triunfo.carta = crearCarta(numero, palo);
    triunfo.carta.x = triunfo.x;
    triunfo.carta.y = triunfo.y;
    triunfo.carta.height = ejeYCarta;
    triunfo.carta.width = ejeXCarta;
    triunfo.carta.alpha = 1;

}


function inicializarRef(){ // TODO esto al final creo que no debería estar
    for (i = 0; i < 6; i++){
        var carta = jRef.cartasEnMano.create(0, 0, 'cartas');
        carta.frame = i;
        carta.numero = i+1;
        carta.palo = "oros";
    }
    dibujarJugador(jRef);
    inicializarCuadroCarta(jRef);
    //dibujarCuadroCarta(jRef);
}

/* Inicializa los jugadores dependiendo del numero que haya, excepto el de referencia */
function inicializarJugadores(){
    crearCartas(jArriba);
    //dibujarCuadroCarta(jArriba);
    inicializarCuadroCarta(jArriba);
    if (numJugadores == 4){
        crearCartas(jIzq);
        //dibujarCuadroCarta(jIzq);
        inicializarCuadroCarta(jIzq);
        crearCartas(jDer);
        inicializarCuadroCarta(jDer);
   }
}

/**
 * Dibuja el cuadro para lanzar la carta
 * @param jugador Jugador a dibujar el cuadro
 */
function inicializarCuadroCarta(jugador){
    crearCuadroCarta(jugador);
    dibujarCuadroCarta(jugador);
}

/**
 * Crea el cuadro punteado donde el jugador tiene que lanzar la carta
 * @param jugador Jugador a dibujar el cuadro
 */
function crearCuadroCarta(jugador){
    try{
        jugador.cartaLanzada.destroy();
    }catch(e){}
    jugador.cartaLanzada = game.add.sprite(jugador.XLanzar, jugador.YLanzar, 'cuadroCarta');
}

/**
 * Dibuja el cuadro punteado en la posición donde el jugador lanza la carta
 * @param jugador Jugador a dibujar el cuadro
 */
function dibujarCuadroCarta(jugador){
    //var cuadro = game.add.sprite(jugador.XLanzar, jugador.YLanzar, 'cuadroCarta');
    try{
        jugador.cartaLanzada.destroy();
    }
    catch(e) {}

    jugador.cartaLanzada = crearCarta(0, 0);
    dibujarCartaLanzada(jugador);
    /*
    jugador.cartaLanzada.loadTexture('cuadroCarta');
    jugador.cartaLanzada.numero = 0;
    jugador.cartaLanzada.palo = 0;
    jugador.cartaLanzada.width = ejeXCarta;
    jugador.cartaLanzada.height = ejeYCarta;
    jugador.cartaLanzada.angle = jugador.rotacion;
    */
    //cuadro.scale.setTo(escalaCarta, escalaCarta);
}

/**
 * Dibuja la carta lanzada
 * @param jugador Jugador a dibujar la carta lanzada
 */
function dibujarCartaLanzada(jugador){
    //var cuadro = game.add.sprite(jugador.XLanzar, jugador.YLanzar, 'cuadroCarta');
    console.log("dibujo la carta en el medio");
    jugador.cartaLanzada.width = ejeXCarta;
    jugador.cartaLanzada.height = ejeYCarta;
    jugador.cartaLanzada.x = jugador.XLanzar;
    jugador.cartaLanzada.y = jugador.YLanzar;
    jugador.cartaLanzada.angle = jugador.rotacion;
    //cuadro.scale.setTo(escalaCarta, escalaCarta);
}

/**
 * Crea las cartas para un jugador. Se utiliza para los jugadores
 * que no son el de referencia ya que no se puede saber qué cartas son,
 * por lo que se dibuja el dorso correspondiente
 * @param jugador Jugador a crear las cartas
 */
function crearCartas(jugador){
    for (i = 0; i < jugador.numCartas; i++){
        console.log("CRANDO CARTAS PARA " + jugador.XPosMedia);
        jugador.cartasEnMano.create(0, 0, jugador.dorso);
    }

}

function destruirCartas(jugador){
    for (i = 0; i < jugador.cartasEnMano.length; i++){
        console.log("DESTRUYENDO CARTAS PARA " + jugador.XPosMedia);
        jugador.cartasEnMano.destroy();
    }

}

/**
 * Dibuja las cartas que tiene en la mano un jugador
 * @param identificador identificador del jugador a dibujar las cartas
 */
function dibujarJugador(identificador){
    var jugador = identificador;
    console.log("DIBUJANDO PARA " + jugador.XPosMedia);
    var i = - jugador.cartasEnMano.length/2; // Para que al final la posición sea centrada


    jugador.cartasEnMano.forEach(function(item) {
        console.log("NUMERO:  " + item.numero + "  PALO: " + item.palo)
        item.x = jugador.XPosMedia + i*jugador.sumX;
        item.y = jugador.YPosMedia + i*jugador.sumY;
        //item.loadTexture(jugador.dorso, 0);
        if (jugador.nombre != "ref") {
            item.frame = 12; // TODO modificar esto para que sea el dorso
        }
        item.angle = jugador.rotacion;
        item.height = ejeYCarta;
        item.width = ejeXCarta;
        //item.scale.setTo(escalaCarta, escalaCarta);
        console.log("pongo carta en mesa");
        console.log(item.height);
        console.log(item.x);
        console.log(item.y);
        i = i + 1;
    }, this);

}


/**
 * Inicializa el juego
 */
function create() {

    // https://stackoverflow.com/questions/37780496/phaser-loading-images-dynamically-after-preload?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
  //  game.load.image('dorsoBase', 'assets/dorsoBase.jpg');
  //  game.load.start();


    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.stage.sprite(0,0, "tapete");

    game.add.tileSprite(0, 0, ejeX, ejeY, 'tapete');
    //game.stage.backgroundColor = "#009933";
    //misCartas = game.add.group();
    //anyadirCarta(misCartas,0);
    //anyadirCarta(misCartas,1);
    //actualizarCartas(misCartas);


    inicializarDispositivo();

    // Botones de acción
    dibujarBotones();

    // Los huecos para tirar las cartas de los jugadores
    //yo = game.add.sprite(game.world.centerX-50, game.world.centerY-50, 'cuadroCarta');
    //yo.scale.setTo(0.1, 0.1);



    controlMusica();
    addSFX();

    actualizarHUD("");

    listo_jugador(); // Confirma que el jugador ya esta listo para jugar

    dibujarCuadroCarta(jRef); // TODO va un poco mal

}

function addSFX() {
    veSFX = game.add.audio('20');
    cuaSFX = game.add.audio('40');
    cuaRASFX = game.add.audio('40ReyAs');
    arrSFX = game.add.audio('arrastro');
    arrZarSFX = game.add.audio('arrastroZarzal');
    vueltasSFX = game.add.audio('vueltas');
    deVueltasSFX = game.add.audio('deVueltas');

    /*game.sound.setDecodedCallback([veSFX, cuaSFX, cuaRASFX, arrSFX, arrZarSFX, vueltasSFX, deVueltasSFX], function() {
        console.log("SFX listos");
    }, this)*/
}

/**
 * No se utiliza
 * @param milliseconds
 */
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function onDragStop(sprite) {

    sprite.x = sprite.origenX;
    sprite.y = sprite.origenY;


}

function listener (item) {
    console.log("pulsaron la cartita");
    console.log(item.nombre);
}

/**
 * Para depurar el juego
 */
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

/**
 * Envía el mensaje de confirmación de que el jugador está listo para comenzar la partida
 */
function listo_jugador(){
    var obj = {
        "tipo_mensaje" : "listo_jugador",
        "nombre_participante": nombre,
        "total_jugadores": numJugadores,
        "tipo_participante": "jugador",
        "con_ia": conIA,
        "remitente" : {
            "id_partida" : idPartida,
            "id_jugador" : miID
        }
    }

    //var myJSON = JSON.stringify(obj);
    enviarMensaje(obj);
}

function accion(tipo, numero, palo){
    var queAccion;
    switch(tipo) {
        case "lanzar_carta":
            queAccion = "lanzar_carta";
            break;
        case  "robar_carta":
            queAccion = "robar_carta";
            break;
        case "cantar":
            queAccion = "cantar";
            break;
        case "cambiar_triunfo":
            queAccion = "cambiar_triunfo";
            break;
    }

    var obj = {
        "tipo_mensaje": "accion",
        "remitente": {
            "id_partida": idPartida,
            "id_jugador": miID
        },
        "tipo_accion": queAccion,
        "carta": {
            "numero": 0,
            "palo": 0
        }
    }
}


function enviarMensaje(obj){
    // TODO se envia el mensaje al backend
    var msg = JSON.stringify(obj);
    console.log(msg);
  //  var enviado = false;
  //  while(!enviado){
  //      try{
            socket.send(msg);
  //          enviado = true
   //     } catch(e){
   //         console.log("El socket no estaba abierto");
   //     }
   // }

}

/**
 * Inicializa las variables y dibuja el estado
 * @param estado Estado que se desea representar
 */

var estadoInicializado = false;

function representarEstado(estado){
    console.log("DIBUJO EL ESTADO COMPLETO");
    if(partida_pausa){
        textoDesconectado.destroy();
    }

    partida_pausa = false;
    // Se dibuja el triunfo
    modificarTriunfo(estado.triunfo.numero, estado.triunfo.palo);
    // Se dibujan las cartas de los jugadores
    // TODO hay que mapear antes

    if (!estadoInicializado){
        mapearJugadores();
    }
    if (estadoInicializado){
        rondaAcabada();
    }
    estado.jugadores.forEach(function(item) {
        var jugador = arrayJugadores[item.id];
        if ([item.id] != miID){

            // personalizacion
            game.load.image(item.id.toString()+'avatar', item.avatar);
            game.load.image(item.id.toString()+'dorso', item.dorso);
            game.load.start();

            game.load.onLoadComplete.add(function(){

                jugador.avatar.loadTexture(item.id.toString()+'avatar');
                jugador.dorso = item.id.toString()+'dorso';
                var numeroCartas = item.num_cartas;
                try{
                    console.log("LA CARTA LANZADA ES: " + jugador.cartaLanzada.numero);
                    if (jugador.cartaLanzada.numero != 0){
                        numeroCartas = numeroCartas - 1;
                    }
                }
                catch(e) {}
              //  destruirCartas(jugador);
                if(!conIA){
                    jugador.cartaLanzada = crearCarta(item.carta_mesa.numero, item.carta_mesa.palo);
                    dibujarCartaLanzada(jugador);
                }
                console.log("DIBUJO: " + numeroCartas);
                jugador.numCartas = numeroCartas;
                jugador.nombreUsuario.text = item.nombre;
                crearCartas(jugador);
                dibujarJugador(jugador);

                arrayJugadores[item.id] = jugador;

            }, this);


        }
        else{
            jugador.nombreUsuario.text = item.nombre;

            game.load.image(miID.toString()+'avatar', item.avatar);
            game.load.start();

            game.load.onLoadComplete.add(function(){
                var jugador = arrayJugadores[miID];
                jugador.avatar.loadTexture(miID.toString()+'avatar');
            }, this);

            try{
                jugador.cartaLanzada.destroy();
            }catch(e){}
            jugador.cartaLanzada = crearCarta(item.carta_mesa.numero, item.carta_mesa.palo);
            dibujarCartaLanzada(jugador);

        }
    }, this);

    // Se pone la mano del jugador
    // TODO si soy espectador esto no se hace
    if (!espectador){
        var jugador = arrayJugadores[miID];
        var carta = {};


        //destruirCartas(jugador);
        estado.mano.forEach(function(item) {
            console.log("CREANDO CARTA: " + item.numero + "  " +item.palo);
            carta = crearCarta(item.numero, item.palo);
            console.log(carta.numero + carta.palo);
            //carta.numero = item.numero;
            carta.inputEnabled = true;
            carta.atributo = "HELLOW DA";
            carta.events.onInputDown.add(pulsaCarta, this);
            jugador.cartasEnMano.add(carta);

            dibujarJugador(jugador);


        }, this);




    }
    // Se dibujan las cartas en la mesa
    /*
    estado.jugadores.forEach(function(item) {
        var jugador = arrayJugadores[item.id];
        if (!estadoInicializado){
            crearCuadroCarta(jugador);
        }
        dibujarCuadroCarta(jugador);
    }, this);
    */

    // HUD
/*
    tipo_ronda.tipo = datos.tipo_nueva_ronda;
    numRonda.numero = datos.nueva_ronda;
    puntuacionMia.puntuacion = datos.puntuaciones[miID].puntuacion; // TODO, siempre ids en orden?
    puntuacionRival.puntuacion = datos.puntuaciones[(miID+1)%numJugadores].puntuacion;
    restantes_mazo.restantes = datos.restantes_mazo;
*/
    // Al principio lo envia bien, por lo que hay que hacer la inversa:
    var restantes = estado.partida.restantes_mazo;
    if(numJugadores==2){
        restantes + 1;
    }
    else{
        restantes + 3;
    }

    datosHUD = {"restantes_mazo": restantes,
        "nueva_ronda": estado.partida.ronda,
        "tipo_nueva_ronda" : estado.partida.tipo_ronda,
        "puntuaciones":[{"id_jugador":0,"puntuacion":0},
            {"id_jugador":1,"puntuacion":0},
            {"id_jugador":2,"puntuacion":0},
            {"id_jugador":3,"puntuacion":0}],
        "nueva_ronda":2};

    actualizarHUD(datosHUD);

    estadoInicializado = true;

}

function prueba(){
    estadito = {"triunfo":{"palo":"B","numero":10},"mano":[{"palo":"E","numero":5},{"palo":"B","numero":6},{"palo":"B","numero":2},{"palo":"E","numero":7},{"palo":"E","numero":2},{"palo":"C","numero":11}],"tipo_mensaje":"estado_inicial","jugadores":[{"tipo":"jugador","carta_mesa":{"palo":"X","numero":0},"num_cartas":6,"id":0,"avatar":"cms","puntos":0,"nombre":"cms"},{"tipo":"jugador","carta_mesa":{"palo":"X","numero":0},"num_cartas":6,"id":1,"avatar":"abadgabriel","puntos":0,"nombre":"abadgabriel"},{"tipo":"jugador","carta_mesa":{"palo":"X","numero":0},"num_cartas":6,"id":2,"avatar":"acasares","puntos":0,"nombre":"acasares"},{"tipo":"jugador","carta_mesa":{"palo":"X","numero":0},"num_cartas":6,"id":3,"avatar":"acastellanos","puntos":0,"nombre":"acastellanos"}],"partida":{"restantes_mazo":15,"ronda":0,"tipo_ronda":"idas"}};
    var msg = JSON.stringify(estadito);
    recibirMensaje(msg);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

var mensajito = 0;
function recibirMensaje(msg){
    console.log("RECIBO UN MENSAJEEEEEE");
    console.log(msg);
    var mensaje = JSON.parse(msg);
    switch (mensaje.tipo_mensaje){
        case "broadcast_accion":
            switch (mensaje.tipo_accion){
                case "lanzar_carta":
                    if(mensaje.id_jugador==0 && conIA){
                        console.log("LA IA SE DUERME");
                        //sleep(1000);
                        console.log("LA IA SE DESPIERTA");
                        if(arrayJugadores[mensaje.id_jugador].nombreUsuario.text=="usuarioRef"){
                            game.onLoadComplete.add(function(){
                                console.log("EJECUTO LA DE CARGA");
                                jugadorLanzaCarta(mensaje.id_jugador, mensaje.carta.numero, mensaje.carta.palo);
                            }, this)
                        }
                        else{
                            console.log("EJECUTO LA NORMAL");
                            jugadorLanzaCarta(mensaje.id_jugador, mensaje.carta.numero, mensaje.carta.palo);
                        }
                        var ia = arrayJugadores[mensaje.id_jugador];
                        if(ia.cartasEnMano.length == 6){
                            var cartita = ia.cartasEnMano.getFirstAlive();
                            ia.cartasEnMano.removeChild(cartita);
                            ia.num_cartas = ia.num_cartas - 1;
                            dibujarJugador(ia);
                        }
                    }
                    else{
                        console.log("LANZO YOOOOOOOOOOOOOOOOOOO");
                        jugadorLanzaCarta(mensaje.id_jugador, mensaje.carta.numero, mensaje.carta.palo);
                    }
                    break;
                case "robar_carta":
                    game.load.onLoadComplete.removeAll(); // Cuando un jugador robe una carta es que se han cargado las texturas
                    if (mensaje.id_jugador != miID){
                        jugadorRobaCarta(mensaje.id_jugador, "nada", "nada");
                    }
                    else {
                        jugadorRobaCarta(mensaje.id_jugador, mensaje.carta.numero, mensaje.carta.palo);
                    }
                    break;
                case "cantar":
                    if(estanCantando){
                        setTimeout(function() { jugadorCanta(mensaje.id_jugador, mensaje.palo, mensaje.cantidad);}, 4000);
                    }
                    else {
                        jugadorCanta(mensaje.id_jugador, mensaje.palo, mensaje.cantidad);
                    }
                    break;
                case "cambiar_triunfo":
                    jugadorCambiaTriunfo(mensaje.id_jugador, mensaje.nuevo_triunfo.numero, mensaje.nuevo_triunfo.palo);
                    break;
                case "turno" :
                    dibujarTurno(mensaje.id_jugador);
                    break;
            }
            break;
        case "gana_ronda":
            //sleep(60000);
            //rondaAcabada();
            //setTimeout(function(){ rondaAcabada(); actualizarHUD(mensaje); }, 1500);
            sleep(1500);
            rondaAcabada();
            actualizarHUD(mensaje);
            sleep(500);
            break;
        case "estado_inicial" :
            representarEstado(mensaje);
            break;
        case "broadcast_desconectado":
            var id = mensaje.id_jugador;
            var timeout = mensaje.timeout;
            partida_pausa = true;
            jugadorDesconectado(id);
            setTimeout(function(){ mandarTimeout();}, timeout);
            break;
        case "jugador_reconectado":
            textoDesconectado.destroy();
    }
}

function mandarTimeout(){
    if (partida_pausa){
        var obj = {
            "tipo_mensaje" : "timeout",
            "remitente" : {
                "id_partida" : idPartida,
                "id_jugador" : miID
            }
        };
        enviarMensaje(obj);
    }
}

function jugadorDesconectado(id){
    if(!partidaAcabada){
      console.log("Jugador desconectado");
      var style = { font: "45px Arial", fill: "#ff0044", align: "center" };
      try{
        textoDesconectado.destroy();
      } catch(e){ }
      textoDesconectado = game.add.text(game.world.centerX, game.world.centerY, "PARTIDA EN PAUSA\n"+arrayJugadores[id].nombreUsuario.text +" se ha desconectado", style);
      textoDesconectado.x = textoDesconectado.x - textoDesconectado.width/2;
    }
}


function crearCarta(numero, palo){
    console.log("ME PIDEN CARTA CON NUMERO: " +numero+" PALO: "+palo);
    var carta;
    var indice = buscarCarta(numero, palo);
    if (numero == 0){
        carta = game.add.sprite(0, 0, 'cuadroCarta');
    }
    else{
        carta = crearDorso(numero, palo);
        carta.frame = indice;
    }
    carta.numero = numero; // Si no se pone despues el game.add lo machaca
    carta.palo = palo;
    console.log("DEVUELVO CARTA CON NUMERO: " +carta.numero+" PALO: "+carta.palo);
    return carta;
}

function crearDorso(numero, palo){
    var carta = game.add.sprite(0, 0, 'cartas');
    carta.frame = 13;
    return carta;
}

function crearDorsoPersonalizado(idJugador){
    console.log("CREO EL DORSO PERSONALIZADO");
    dorso = arrayJugadores[idJugador].dorso
    var carta = game.add.sprite(0, 0, dorso);
    return carta;
}

/**
 * Elimina la carta del mazo (cualquiera si no es referencia) y la pone en el centro en la variable cartaLanzada
 * @param idJugador Id del jugador que lanza la carta
 * @param numero Numero de la carta que lanza
 * @param palo Palo de la carta que lanza
 */
function jugadorLanzaCarta(idJugador, numero, palo){
    // indexar jugador
    // coger la primera carta de la mano y eliminarla
    // cambiar el sprite al de la carta correspondiente en el cuadro de lanzar
    var jugador = arrayJugadores[idJugador];
    console.log("ELll parametros es: " + numero);
    if (idJugador!= miID){
        var cartita = jugador.cartasEnMano.getFirstAlive();
        jugador.cartasEnMano.removeChild(cartita);
        dibujarJugador(jugador);
        try{
            jugador.cartaLanzada.destroy();
        }catch(e){}
        jugador.cartaLanzada = crearCarta(numero, palo);
        dibujarCartaLanzada(jugador);

    }
    else {
        var salir = false;
        jugador.cartasEnMano.forEach(function(item) {
           // console.log("entro a buscar en el referencia" + item.numero + " " + item.palo);
            if (salir == false && item.numero == numero && item.palo == palo){ // Porque se elimina la carta entonces la funcion no encuentra la carta, por eso el salir
                console.log("EJECUTO ESTO");
                jugador.cartasEnMano.removeChild(item);
                dibujarJugador(jugador);
                try{
                    jugador.cartaLanzada.destroy();
                }catch(e){}
                jugador.cartaLanzada = crearCarta(numero, palo);
                console.log("DIBUJO MI CARTA DE REFEREEENCIA");
                dibujarCartaLanzada(jugador);
                salir = true;
            }
        }, this);
    }
}

/**
 * Permuta la carta indicada con la de triunfo
 * @param id Jugador que cambia
 * @param numero numero de la carta a cambiar
 * @param palo palo de la carta a cambiar
 */
function jugadorCambiaTriunfo(id, numero, palo){
    console.log("SE CAMBIA EL TRIUNFO");
    var jugador = arrayJugadores[id];
    if (id == miID){ // Soy el de referencia
        var salir = false;
        jugador.cartasEnMano.forEach(function(item) {
            // console.log("entro a buscar en el referencia" + item.numero + " " + item.palo);
            if (salir == false && item.numero == numero && item.palo == palo){ // Porque se elimina la carta entonces la funcion no encuentra la carta, por eso el salir
                var numeroTriunfo = triunfo.carta.numero;
                var paloTriunfo = triunfo.carta.palo;
                modificarTriunfo(item.numero, item.palo);
                jugador.cartasEnMano.removeChild(item);
                var carta = crearCarta(numeroTriunfo, paloTriunfo);
                carta.inputEnabled = true;
                carta.events.onInputDown.add(pulsaCarta, this);
                jugador.cartasEnMano.add(carta);
                dibujarJugador(jugador);
                salir = true;
            }
        }, this);
    }
    else{
        modificarTriunfo(numero, palo);
    }
}





function jugadorCanta(id, palo, cantidad){
    estanCantando = true;
    console.log("Jugador canta");
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    //arrayJugadores[id].nombreUsuario
    //var textoCantar = game.add.text(game.world.centerX, game.world.centerY, 0, + 'pepito HA CANTADO ' + cantidad);
    var textoCantar = game.add.text(game.world.centerX, game.world.centerY, arrayJugadores[id].nombreUsuario.text + ' HA CANTADO ' + cantidad + ' EN ' + palo, style);
    textoCantar.anchor.setTo(0.5,0.5);
    if (cantidad == 20) {
        veSFX.play();
    } else {
        cuaRASFX.play();
    }
    //textoCantar.alpha = 0;

    //game.add.tween(textoCantar).to( { alpha: 0 }, 3500, 'Linear', true, 0, 1000, true);
    //game.add.tween(textoCantar).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true)
    setTimeout(function(){ textoCantar.destroy(); estanCantando = false;}, 3500);
}

/**
 * Accion del jugador cuando se pulsa una carta. Asociado a la acción de lanzar_carta
 * @param item Carta que se ha pulsado
 */
function pulsaCarta(item){
    console.log("HA PUSLADO CARTA" + "   " + item.numero + "  " + item.atributo + "  " + item.palo);
    var obj = {
        "tipo_mensaje": "accion",
        "remitente": {
            "id_partida": idPartida,
            "id_jugador": miID
        },
        "tipo_accion": "lanzar_carta",
        "carta": {
            "numero": item.numero,
            "palo": item.palo
        }
    }
    enviarMensaje(obj);
}

/**
 * Un jugador roba una carta, si no es el referencia da igual el numero y palo
 * @param idJugador Id del jugador que roba
 * @param numero
 * @param palo
 */
function jugadorRobaCarta(idJugador, numero, palo){
    var jugador = arrayJugadores[idJugador];
    if (idJugador!= miID){
        var carta = crearDorsoPersonalizado(idJugador);
        jugador.cartasEnMano.add(carta);
        dibujarJugador(jugador);
        dibujarCartaLanzada(jugador);

    }
    else {
        var carta = crearCarta(numero, palo);
        carta.inputEnabled = true;
        carta.events.onInputDown.add(pulsaCarta, this);
        jugador.cartasEnMano.add(carta);
        dibujarJugador(jugador);
        dibujarCartaLanzada(jugador);
    }
}

/**
 * Limpia la mesa de las cartas que han lanzado los jugadores
 */
function rondaAcabada(){
    // cambiar todos los cuadros de lanzar por el sprite del cuadro de lanzar
    for (i = 0; i < numJugadores; i++){
        console.log(i);
        var jugador = arrayJugadores[i];
        dibujarCuadroCarta(jugador);
    }
}

/**
 * Devuelve el numero a indexar en el sprite de cartas
 * @param numero Numero de la carta
 * @param palo Palo de la carta
 * @returns {number}
 */
function buscarCarta(numero, palo){
    var indice = numero - 1;
    console.log("EL indice es: " + numero);
    var numCartas = 13;
    if (palo == 0){
        indice = 0; // el marco
    }
    else if (palo == "O"){

    }
    else if (palo == "C"){
        indice = indice + numCartas;
    }
    else if (palo == "E"){
        indice = indice + numCartas*2;
    }
    else { // palo == "bastos"
        indice = indice + numCartas*3;
    }
    console.log("EL indice es: " + indice);
    return indice;
}

/* HUD */
var tiempoTurno;
var tiempoRestante;


/*
function crearTiempo(idJugador){
    tiempoRestante = 30;
    tiempoTurno.text = "TURNO " + arrayJugadores[idJugador].nombreUsuario.text + " " + tiempoRestante + " s";
    var idNuevoContador = idContador;
    setTimeout(function(){ updateCounter(idJugador, idNuevoContador);}, 1000);
}
function updateCounter(idJugador, idEsteContador){
    //console.log("ACTUALIZO CONTADOR " + idContador);
    if (tiempoRestante > 0 && idContador == idEsteContador){
        tiempoRestante--;
        tiempoTurno.text = "TURNO " + arrayJugadores[idJugador].nombreUsuario.text + " " + tiempoRestante + " s";
        setTimeout(function(){ updateCounter(idJugador, idEsteContador);}, 1000);
    }
}
function actualizarTiempo(idJugador){
    tiempoTurno.text = "TURNO " + arrayJugadores[idJugador].nombreUsuario + " 15";
}
*/
/**
 * Dibuja los botones de accion y asocia la funcion para enviar el mensaje: cantar20, cantar40 y cambiarTriunfo
 */
function dibujarBotones(){
    var espacioBoton = ejeX / numBotones;
    //var style = {font: "20px", fill: "#000000", align:"center"};

    if (espectador){
        game.add.text(30, ejeYBotones, 'ESPECTANDO', { fill: '#ffffff'});
    }
    else{

        var cantar = game.add.text(30, ejeYBotones, '', { fill: '#ffffff'});
        var cambiarTriunfo = game.add.text(espacioBoton, ejeYBotones, '', {fill: '#ffffff'});
        cantar.text = "CANTAR";
        cambiarTriunfo.text = "CAMBIAR TRIUNFO";
        cantar.inputEnabled = true;
        cantar.events.onInputDown.add(pulsaBoton, this);
        cambiarTriunfo.inputEnabled = true;
        cambiarTriunfo.events.onInputDown.add(pulsaBoton, this);
    }


    //tiempoTurno = game.add.text(espacioBoton + espacioBoton/2, ejeYBotones, '', {fill: '#ffffff'});


    //tiempoTurno.text = "TURNO pepito 15"


}


/**
 * Accion del jugador cuando se pulsa una carta. Asociado a la acción de lanzar_carta
 * @param item Carta que se ha pulsado
 */
function pulsaBoton(item){
    var accion = "";
    switch (item.text){
        case "CANTAR":
            accion = "cantar";
            break;
        case "CAMBIAR TRIUNFO":
            accion = "cambiar_triunfo";
            break;
    }
    console.log("HA PUSLADO BOTON" + "   " + item.text);
    var obj = {
        "tipo_mensaje": "accion",
        "remitente": {
            "id_partida": idPartida,
            "id_jugador": miID
        },
        "tipo_accion": accion,
        "nuevo_triunfo" : {
            "numero" : 7,
            "palo" : triunfo.carta.palo
        }
    }
    enviarMensaje(obj);
}

/**
 * Dibuja el punto rojo que indica el turno del jugador
 * @param id_jugador Id del jugador al que hay que poner el turno
 */
function dibujarTurno(id_jugador){
    var jugador = arrayJugadores[id_jugador];
    turno.x = jugador.XLanzar;
    turno.y = jugador.YLanzar;
    turno.width = ejeXCarta;
    turno.height = ejeYCarta;
    turno.angle = jugador.rotacion;
    turno.alpha = 0.5;
    //idContador++;
    //crearTiempo(id_jugador);

}

/* ANIMACIONES */

var HUDInicializado = false;
var puntuacionMia = 0;
var puntuacionRival = 0;
var numRonda = 0;
var restantes_mazo = "NaN";
var tipo_ronda = "IDAS";
var color = "#ffffff";
var fuente =  "12pt impact";
var inicioTexto = 10;

/**
 * Actualiza el HUD del jugador
 * @param datos Datos nuevos a actualizar
 */
function actualizarHUD(datos){
    console.log("ACTUALIZO EL HUD");




    if (HUDInicializado == false){
        console.log("NO ESTABA ININICIALIZADO");
        tipo_ronda = game.add.text(inicioTexto, 0, '', { font: fuente, fill: color});
        tipo_ronda.tipo = "IDAS";
        tipo_ronda.text = "TIPO RONDA: " + tipo_ronda.tipo;

        numRonda = game.add.text(inicioTexto, 20, '', { font: fuente, fill: color});
        numRonda.numero = 0;
        numRonda.text = "NUMERO RONDA: " + numRonda.numero;

        puntuacionRival = game.add.text(inicioTexto, 40, '', { font: fuente, fill: color});
        puntuacionRival.puntuacion = 0;
        puntuacionRival.text = "PUNTUACION RIVAL: " + puntuacionRival.puntuacion;

        puntuacionMia = game.add.text(inicioTexto, 60, '', { font: fuente, fill: color});
        puntuacionMia.puntuacion = 0;
        puntuacionMia.text = "MI PUNTUACION : " + puntuacionMia.puntuacion;

        restantes_mazo = game.add.text(inicioTexto, 80, '', { font: fuente, fill: color});
        restantes_mazo.restantes = 99999999;
        restantes_mazo.text = "CARTAS RESTANTES : " + restantes_mazo.restantes;

        HUDInicializado = true;
    }
    else{
        tipo_ronda.tipo = datos.tipo_nueva_ronda;
        numRonda.numero = datos.nueva_ronda;
        if(espectador){
            puntuacionMia.puntuacion = datos.puntuaciones[0].puntuacion; // TODO, siempre ids en orden?
            puntuacionRival.puntuacion = datos.puntuaciones[1].puntuacion;
            puntuacionRival.text = "PUNTUACION A: " + puntuacionRival.puntuacion;
            puntuacionMia.text = "PUNTUACION B: " + puntuacionMia.puntuacion;
        }
        else{ // Es un jugador
            puntuacionMia.puntuacion = datos.puntuaciones[miID].puntuacion; // TODO, siempre ids en orden?
            puntuacionRival.puntuacion = datos.puntuaciones[(miID+1)%numJugadores].puntuacion;
            puntuacionRival.text = "PUNTUACION RIVAL: " + puntuacionRival.puntuacion;
            puntuacionMia.text = "MI PUNTUACION: " + puntuacionMia.puntuacion;
        }
        restantes_mazo.restantes = datos.restantes_mazo;

        numRonda.text = "NUMERO RONDA: " + numRonda.numero;

        var restantes = restantes_mazo.restantes;
        if(numJugadores==2){
            if( (restantes-1) >= 0){
                restantes = restantes - 1;
            }
            else{
                restantes = 0;
            }
        }
        else{
            if ((restantes-3) >= 0){
                restantes = restantes - 3;
            }
            else{
                retantes = 0;
            }
        }
        restantes_mazo.restantes = restantes;
        restantes_mazo.text = "CARTAS RESTANTES : " + restantes;
    }
    if(datos.hasOwnProperty('tipo_nueva_ronda')){
        tipo_ronda.text = "TIPO RONDA: " + datos.tipo_nueva_ronda;
    }
    if(restantes_mazo.restantes <= 1) {
        triunfo.carta.alpha = 0.5;
        tipo_ronda.text = "TIPO RONDA: ARRASTRE";
    }

    if(puntuacionMia.puntuacion > 100 || puntuacionRival.puntuacion > 100){
        finPartida();
    }
}

function finPartida(){
    console.log("ACABA LA PARTIDA");
    var logo;
    var tipo;

    if (puntuacionMia.puntuacion > 100){
        tipo = 'victoria';
    }
    else{
        tipo = 'derrota';
    }

    if(!espectador){
        logo = game.add.sprite(game.world.centerX, ejeY * 0.1, tipo);
        logo.alpha = 0;
        logo.x = logo.x - logo.width/2;

        game.add.tween(logo).to( { alpha: 1 }, 1500, 'Linear', true, 0);
    }
//    puntuacionMia.x = logo.x + logo.width/2 - 80;
 //   puntuacionMia.y = logo.y + logo.height * 1.2;

    // Logo para volver al menu principal
    if(torneo){
        setTimeout(function() {
            if(tipo == 'derrota'){
                window.location.replace("../jsp/matchmaking.jsp");
            }
            else {
                window.location.replace("../jsp/torneos.jsp?sigueTorneo=true&id_torneo="+id_torneo);
            }
        } , 2000);
    }
    else{ // Boton de salir a la pagina principal
        //socket.close(); // Para evitar que salgan los mensajes de desconexion de los jugadores
        sleep(3000);
        var botonSalir = game.add.sprite(0, 0, 'botonSalir');
        botonSalir.width = 150;
        botonSalir.height = 50;
        botonSalir.x = game.world.centerX - botonSalir.width/2;
        botonSalir.y =  logo.y + logo.height - 20;
        console.log("DIBUJO EL BOTON DE SALIR");
        botonSalir.inputEnabled = true;
        botonSalir.events.onInputDown.add(
            function salir(){
                window.location.replace("../jsp/matchmaking.jsp");
            }
            , this);
    }
}

var arrastre;

function animacionArrastre(){ /* TODO solo se puede mover con imagenes */
    arrastre = game.add.text(ejeX - 500, ejeY - 300, '', { fill: '#ff000e' });
    //arrastre.body.velocity.x=150;
    arrastre.text = "VAMOS DE ARRASTRE :D";
    game.time.events.add(Phaser.Timer.SECOND*4, borrarArrastre, this);

}

function borrarArrastre(){
    arrastre.destroy();
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

/* MÚSICA */

var music;
var playPause;
function controlMusica(){

    music = game.add.audio('musica');
    game.world.centerX-50
    playPause = game.add.sprite(ejeX - 50, 20, 'botonSonido');
    playPause.width = 30;
    playPause.height= 30;
    //playPause = game.add.text(0, ejeY/2, '', { fill: '#ffffff'});
    //playPause.text = "MUSIKOTE";
    playPause.inputEnabled = true;
    playPause.events.onInputDown.add(botonMusica, this);
    //music.play();
    playPause.estado = "pause";
}

function botonMusica(item){
    console.log("SE PULSA EL BOTON " + item.estado);
    if (item.estado == "playing"){
        console.log("LA PAUSO");
        music.pause();
        playPause.estado = "pause";
    }
    else{
        playPause.estado = "playing";
        music.resume();
    }
}

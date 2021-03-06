-- Create tables de la base de datos sotayrey_db

USE sotayrey_db;

SET time_zone = "+02:00"; -- Pone en hora peninsular la BD

DROP TABLE IF EXISTS sesion_abierta;
DROP TABLE IF EXISTS participa_fase;
DROP TABLE IF EXISTS juega;
DROP TABLE IF EXISTS pertenece_liga;
DROP TABLE IF EXISTS posee;
DROP TABLE IF EXISTS articulo;
DROP TABLE IF EXISTS liga;
DROP TABLE IF EXISTS partida;
DROP TABLE IF EXISTS fase;
DROP TABLE IF EXISTS torneo;
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
    username VARCHAR(20) PRIMARY KEY, -- IA es un usuario especial con username = IA y tratado de forma especial
    pw_hash CHAR(60),
    correo VARCHAR(320) NOT NULL, 
    fb_auth VARCHAR(20),
    timeCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    nombre VARCHAR(25) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    fechaNac DATE,
    admin BOOL NOT NULL, -- true si administrador, false si usuario normal
    puntuacion INT UNSIGNED NOT NULL DEFAULT 0, -- No se contemplan puntuaciones negativas
    divisa INT UNSIGNED NOT NULL DEFAULT 10, -- No se contempla perder dinero una vez tienes 0 (dinero negativo), al registrarse por primera vez se conceden 10 monedas
    CONSTRAINT correo_unique UNIQUE(correo) -- no se permite más de un usuario con el mismo correo electrónico
);
-- Usuario borrado: pw_hash = null && token = null (los datos de ese usuario no se borran)

CREATE TABLE torneo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    timeInicio DATETIME NOT NULL,
    timeCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    individual BOOL NOT NULL -- true si uno contra uno, false si parejas
);

CREATE TABLE fase (
    num INT UNSIGNED,
    torneo BIGINT UNSIGNED,
    premioPunt INT UNSIGNED NOT NULL,    -- La cantidad de puntuación que recibe el equipo ganador en esa fase
    premioDiv INT UNSIGNED NOT NULL,     -- La cantidad de divisa que recibe el equipo ganador en esta fase
    FOREIGN KEY (torneo) REFERENCES torneo(id) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    CONSTRAINT fase_pk PRIMARY KEY (num, torneo)
);

CREATE TABLE partida (
    id SERIAL PRIMARY KEY,
    timeInicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    timeFin DATETIME,   -- será null cuando una partida esté en curso
    publica BOOL NOT NULL,    -- true si publica, false si privada
    ganador CHAR(1),  -- TODO: solo puede ser A:abandonada, 1:equipo1 ganador, 2:equipo2 ganador o NULL:partida en curso
    fase_num INT UNSIGNED, -- null si la partida no pertenece a un torneo
    fase_torneo BIGINT UNSIGNED,
    FOREIGN KEY (fase_num, fase_torneo) REFERENCES fase(num, torneo) ON DELETE RESTRICT ON UPDATE CASCADE
    -- No se permite el borrado de fases de torneos si hay partidas registradas en ellas
);

CREATE TABLE liga (
    nombre VARCHAR(50) PRIMARY KEY,
    descripcion TEXT,
    porcentaje_min TINYINT UNSIGNED NOT NULL, -- La liga más alta contendrá los porcentajes más bajos (p.ej. 0%-10%)
    porcentaje_max TINYINT UNSIGNED NOT NULL, -- TODO solo valores entre 0 y 100 y max mayor que min y que no se crucen
    CONSTRAINT porcentajemin_unique UNIQUE(porcentaje_min),
    CONSTRAINT porcentajemax_unique UNIQUE(porcentaje_max)
);

CREATE TABLE articulo (
    nombre VARCHAR(50) PRIMARY KEY,
    precio INT UNSIGNED NOT NULL,   -- Es posible que sea 0
    descripcion TEXT,
    rutaImagen VARCHAR(320) NOT NULL,
    tipo CHAR(1) NOT NULL, -- TODO: solo puede ser A:avatar, B:baraja, T:tapete
    requiere_liga VARCHAR(50),
    FOREIGN KEY (requiere_liga) REFERENCES liga(nombre) ON DELETE SET NULL ON UPDATE CASCADE -- cuidado! Cascades de foreign key no activan triggers
);

CREATE TABLE juega (
    usuario VARCHAR(20),
    partida BIGINT UNSIGNED,
    equipo CHAR(1), -- TODO: solo puede ser 1:equipo1, 2:equipo2
    puntos TINYINT UNSIGNED, -- puntos conseguidos por ese equipo en esa partida (distinto de la puntuación conseguida por ganar o perder)
    veintes TINYINT UNSIGNED,  -- numero de veintes cantados por ese equipo (TODO: podría ser máximo 6 si es partida de ida y vuelta)
    cuarentas TINYINT UNSIGNED, -- numero de cuarentas cantados por ese equipo (TODO: podría ser máximo 2 si es partida de ida y vuelta)
    abandonador BOOL, -- true: este jugador ha abandonado la partida, false en caso contrario
    FOREIGN KEY (usuario) REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- Si se borra un usuario, se borran todas sus relaciones 'juega' (se borra por tanto parte de la información de esa partida)
    FOREIGN KEY (partida) REFERENCES partida(id) ON DELETE RESTRICT ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- No se permite el borrado de partidas si hay jugadores registrados en ellas. Realmente, no se van a borrar nunca usuarios ni partidas
    CONSTRAINT juega_pk PRIMARY KEY (usuario, partida, equipo)
);

CREATE TABLE pertenece_liga (
    usuario VARCHAR(20),
    liga VARCHAR(50),
    timeEntrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de entrada del usuario en esa liga
    FOREIGN KEY (usuario) REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    FOREIGN KEY (liga) REFERENCES liga(nombre) ON DELETE RESTRICT ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- No se permite el borrado de ligas si hay jugadores registrados en ellas. No se van a borrar nunca usuarios
    CONSTRAINT pertenece_liga_pk PRIMARY KEY (usuario, liga, timeEntrada)
);

CREATE TABLE posee (
    usuario VARCHAR(20),
    articulo VARCHAR(50),
    preferido BOOL, -- true: es el articulo preferido del usuario, false en caso contrario. TODO: solo puede haber un preferido por usuario y tipo de articulo
    FOREIGN KEY (usuario) REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    FOREIGN KEY (articulo) REFERENCES articulo(nombre) ON DELETE RESTRICT ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- Si se borra un articulo, no se podrá si algún usuario lo posee
    CONSTRAINT pertenece_liga_pk PRIMARY KEY (usuario, articulo)
);

CREATE TABLE participa_fase (
    usuario VARCHAR(20),
    fase_num INT UNSIGNED, -- null si la partida no pertenece a un torneo
    fase_torneo BIGINT UNSIGNED,
	multip INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (fase_num, fase_torneo) REFERENCES fase(num, torneo) ON DELETE RESTRICT ON UPDATE CASCADE,    
    FOREIGN KEY (usuario) REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE,
	-- No se pueden borrar torneos si algún usuario ya está apuntado en él
    CONSTRAINT participa_fase_pk PRIMARY KEY (usuario, fase_num, fase_torneo, multip)
);

CREATE TABLE sesion_abierta (
	usuario VARCHAR(20),
	url	VARCHAR(300),
	timeCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (usuario),
	FOREIGN KEY (usuario) REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE
);

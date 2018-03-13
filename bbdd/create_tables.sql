-- Create tables de la base de datos sotayrey_db

USE DATABASE sotayrey_db;

DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS partida;
DROP TABLE IF EXISTS torneo;
DROP TABLE IF EXISTS fase;
DROP TABLE IF EXISTS liga;
DROP TABLE IF EXISTS articulo;
DROP TABLE IF EXISTS juega;
DROP TABLE IF EXISTS pertenece_liga;
DROP TABLE IF EXISTS posee;

CREATE TABLE usuario (
    username VARCHAR(15) PRIMARY KEY,
    pw_hash CHAR(60),
    correo VARCHAR(320) NOT NULL, 
    --fb_token VARCHAR(100), -- TODO: aprender a usar tokens de Facebook
    timeCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del usuario
    nombre VARCHAR(25) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    fechaNac DATE,
    admin BOOL NOT NULL, -- true si administrador, false si usuario normal
    puntuacion UNSIGNED INT NOT NULL, -- No se contemplan puntuaciones negativas
    divisa UNSIGNED INT NOT NULL, -- No se contempla perder dinero una vez tienes 0 (dinero negativo)
    timeEspera DATETIME, -- Momento de inicio de la espera, si está esperando a encontrar participante, null en caso contrario
    puesto UNSIGNED INT, -- TODO: no puede ser 0
    CONSTRAINT correo_unique UNIQUE(correo) -- no se permite más de un usuario con el mismo correo electrónico
);
-- Usuario borrado: pw_hash = null && token = null (los datos de ese usuario no se borran)

CREATE TABLE partida (
    id SERIAL PRIMARY KEY,
    timeInicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    timeFin DATETIME,   -- será null cuando una partida esté en curso
    publica BOOL NOT NULL,    -- true si publica, false si privada
    ganador CHAR(1),  -- TODO: solo puede ser A:abandonada, 1:equipo1 ganador, 2:equipo2 ganador o NULL:partida en curso
    fase_num UNSIGNED INT, -- null si la partida no pertenece a un torneo
    fase_torneo SERIAL,
    FOREIGN KEY fase_num REFERENCES fase(num) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY fase_torneo REFERENCES fase(torneo) ON DELETE RESTRICT ON UPDATE CASCADE
    -- No se permite el borrado de fases de torneos si hay partidas registradas en ellas
);

CREATE TABLE torneo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    timeInicio DATETIME NOT NULL,
    timeCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    individual BOOL NOT NULL -- true si uno contra uno, false si parejas
);

CREATE TABLE fase (
    num UNSIGNED INT,
    torneo SERIAL,
    premioPunt UNSIGNED INT NOT NULL,    -- La cantidad de puntuación que recibe el equipo ganador en esa fase
    premioDiv UNSIGNED INT NOT NULL,     -- La cantidad de divisa que recibe el equipo ganador en esta fase
    FOREIGN KEY torneo REFERENCES torneo(id) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    CONSTRAINT fase_pk PRIMARY KEY (num, torneo)
);

CREATE TABLE liga (
    nombre VARCHAR(50) PRIMARY KEY,
    descripcion TEXT,
    porcentaje UNSIGNED TINYINT NOT NULL
);

CREATE TABLE articulo (
    nombre VARCHAR(50) PRIMARY KEY,
    precio UNSIGNED INT NOT NULL,   -- Es posible que sea 0
    descripcion TEXT,
    ruta_Imagen VARCHAR(320) NOT NULL, 
    tipo CHAR(1) NOT NULL -- TODO: solo puede ser A:avatar, B:baraja, T:tapete
);

CREATE TABLE juega (
    usuario VARCHAR(15),
    partida SERIAL,
    equipo CHAR(1), -- TODO: solo puede ser 1:equipo1, 2:equipo2
    puntos UNSIGNED TINYINT, -- puntos conseguidos por ese equipo en esa partida (distinto de la puntuación conseguida por ganar o perder)
    veintes UNSIGNED TINYINT,
    cuarentas UNSIGNED TINYINT,
    abandonador BOOL, -- true: este jugador ha abandonado la partida, false en caso contrario
    FOREIGN KEY usuario REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- Si se borra un usuario, se borran todas sus relaciones 'juega' (se borra por tanto parte de la información de esa partida)
    FOREIGN KEY partida REFERENCES partida(id) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- Realmente, no se van a borrar nunca usuarios ni partidas
    CONSTRAINT juega_pk PRIMARY KEY (usuario, jugador)
);

CREATE TABLE pertenece_liga (
    usuario VARCHAR(15),
    liga VARCHAR(50),
    timeEntrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de entrada del usuario en esa liga
    FOREIGN KEY usuario REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    FOREIGN KEY liga REFERENCES liga(nombre) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- Realmente, no se van a borrar nunca usuarios ni ligas
    CONSTRAINT pertenece_liga_pk PRIMARY KEY (usuario, liga)
);

CREATE TABLE posee (
    usuario VARCHAR(15),
    articulo VARCHAR(50),
    preferido BOOL, -- true: es el articulo preferido del usuario, false en caso contrario. TODO: solo puede haber un preferido por usuario y tipo de articulo
    FOREIGN KEY usuario REFERENCES usuario(username) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    FOREIGN KEY articulo REFERENCES articulo(nombre) ON DELETE CASCADE ON UPDATE CASCADE, -- cuidado! Cascades de foreign key no activan triggers
    -- Si se borra un articulo, dejan de poseerlo todos los usuarios que lo tenían
    CONSTRAINT pertenece_liga_pk PRIMARY KEY (usuario, articulo)
);

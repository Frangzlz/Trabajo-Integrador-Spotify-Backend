DROP DATABASE IF EXISTS spotify;
CREATE DATABASE IF NOT EXISTS spotify DEFAULT CHARACTER SET utf8mb4;
USE spotify;

CREATE TABLE paises (
  id_pais INT AUTO_INCREMENT PRIMARY KEY,
  nombre_pais VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE artistas (
	id_artista INT PRIMARY KEY AUTO_INCREMENT,
	nombre_artista VARCHAR(200) UNIQUE NOT NULL,
    imagen_url VARCHAR(255)
);

CREATE TABLE discograficas (
	id_discografica INT PRIMARY KEY AUTO_INCREMENT,
    nombre_discografica VARCHAR(200) NOT NULL,
    id_pais INT,
	UNIQUE (nombre_discografica, id_pais),
	FOREIGN KEY (id_pais) REFERENCES paises(id_pais)
);

CREATE TABLE albums (
	id_album INT PRIMARY KEY AUTO_INCREMENT,
    nombre_album VARCHAR(255) NOT NULL,
    id_artista INT,
    id_discografica INT,
    imagen_portada VARCHAR(255),
    anio_publicacion YEAR NOT NULL,
	duracion_total_seg INT DEFAULT 0,
	UNIQUE (id_artista, nombre_album),
    FOREIGN KEY (id_artista) REFERENCES artistas(id_artista),
    FOREIGN KEY (id_discografica) REFERENCES discograficas(id_discografica)
);

CREATE TABLE tipo_usuario (
  id_tipo_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre ENUM('free', 'standard', 'premium') UNIQUE NOT NULL
);

CREATE TABLE usuarios (
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_pais INT,
    tipo_usuario_actual INT,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    nom_y_ape VARCHAR(200),
	email VARCHAR(200) UNIQUE NOT NULL,
    fecha_nac DATE,
    sexo CHAR(1),
    cp VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    cambio_de_password DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais),
	FOREIGN KEY (tipo_usuario_actual) REFERENCES tipo_usuario(id_tipo_usuario)
);

CREATE TABLE canciones (
  id_cancion INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  duracion_seg INT NOT NULL,
  id_album INT,
  reproducciones BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  fecha_agregada DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_album) REFERENCES albums(id_album)
);

CREATE TABLE genero (
  id_genero INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE cancion_genero (
  id_cancion INT,
  id_genero INT,
  PRIMARY KEY (id_cancion, id_genero),
  FOREIGN KEY (id_cancion) REFERENCES canciones(id_cancion),
  FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
);

CREATE TABLE playlists (
  id_playlist INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  id_usuario INT NOT NULL,
  cant_canciones INT DEFAULT 0,
  estado ENUM('activa', 'eliminada') DEFAULT 'activa',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_eliminada DATETIME NULL,
  CHECK (
    (estado = 'eliminada' AND fecha_eliminada IS NOT NULL)
    OR (estado = 'activa' AND fecha_eliminada IS NULL)
  ),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE playlist_cancion (
  id_playlist INT,
  id_cancion INT,
  orden INT,
  fecha_agregada DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_playlist, id_cancion),
  FOREIGN KEY (id_playlist) REFERENCES playlists(id_playlist),
  FOREIGN KEY (id_cancion) REFERENCES canciones(id_cancion)
);

CREATE TABLE suscripciones (
  id_suscripcion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_tipo_usuario INT NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_renovacion DATETIME NOT NULL,
  UNIQUE (id_usuario, fecha_inicio),
  CHECK (fecha_renovacion > fecha_inicio),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuario(id_tipo_usuario)
);

CREATE TABLE metodo_pago (
  id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  tipo_forma_pago ENUM('Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Débito automático x banco') NOT NULL,
  cbu VARCHAR(50),
  banco_codigo INT,
  nro_tarjeta_masc VARCHAR(22),
  mes_caduca INT,
  anio_caduca INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_suscripcion INT,
  id_metodo_pago INT,
  importe INT DEFAULT 0,
  fecha_pago DATETIME,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_suscripcion) REFERENCES suscripciones(id_suscripcion),
  FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago)
);

-- INSERTS
-- Paises
INSERT INTO paises (nombre_pais) VALUES
	('Estados Unidos'),
	('Inglaterra'),
	('España'),
	('Chile'),
	('Brasil'),
	('Canadá'),
	('Alemania'),
	('Holanda'),
	('Colombia'),
	('Argentina'),
	('Mexico'),
	('Francia'),
	('Uruguay'),
	('Suecia');

-- Tipos de usuario
INSERT INTO tipo_usuario (nombre) 
VALUES
	('free'),
	('standard'),
	('premium');

-- Artistas
INSERT INTO artistas (nombre_artista, imagen_url) VALUES
	('Pink Floyd', 'Pink Floyd.jpg'),
	('AC/DC', ''),
	('The Rolling Stones', 'The Rolling Stones.jpg'),
	('The Beatles', ''),
	('Guns\'n Roses', 'Guns\'n Roses.jpg'),
	('Linkin Park', ''),
	('Madonna', 'Madonna.jpg'),
	('Fito Paez', ''),
	('Diego Torres', 'Diego Torres.jpg'),
	('Shakira', ''),
	('Maluma', 'Maluma.jpg'),
	('Carlos Vives', ''),
	('Karol G', 'Karol G.jpg'),
	('Yo-Yo Ma', ''),
	('Michael Finnissy', 'Michael Finnissy.jpg'),
	('John Adams', ''),
	('John Corigliano', 'John Corigliano.jpg'),
	('Terry Riley', ''),
	('Brian John Peter Ferneyhough', 'Brian John Peter Ferneyhough.jpg'),
	('Charlie Parker', ''),
	('Miles Davis', 'Miles Davis.jpg'),
	('Dizzy Gillespie', ''),
	('Coleman Hawkins', 'Coleman Hawkins.jpg'),
	('Billie Holiday', ''),
	('Ray Charles', 'Ray Charles.jpg'),
	('Chet Baker', ''),
	('Celia Cruz', 'Celia Cruz.jpg'),
	('Ruben Blades', ''),
	('Willie Colon', 'Willie Colon.jpg'),
	('Hector Lavoe', ''),
	('Tito Rodriguez', 'Tito Rodriguez.jpg'),
	('Luis Enrique', ''),
	('Astor Piazzolla', 'Astor Piazzolla.jpg'),
	('Carlos Gardel', ''),
	('Adriana Varela', 'Adriana Varela.jpg'),
	('Alberto Podestá', ''),
	('Bajofondo Tango Club', 'Bajofondo Tango Club.jpg'),
	('Susana Rinaldi', ''),
	('Dr. Dre', 'Dr. Dre.jpg'),
	('Eminem', ''),
	('Snoop Dogg', 'Snoop Dogg.jpg'),
	('Jay-Z', ''),
	('Beastie Boys', 'Beastie Boys.jpg'),
	('Kanye West', ''),
	('Carl Cox', 'Carl Cox.jpg'),
	('Marco Carola', ''),
	('Oscar Mulero', 'Oscar Mulero.jpg'),
	('Nina Kraviz', ''),
	('Adam Beyer', 'Adam Beyer.jpg'),
	('Solomun', '');

-- Discograficas
INSERT INTO discograficas (nombre_discografica, id_pais) VALUES
	('Sony Music Entertainment', 1),
	('Universal Music Group', 1),
	('Warner Music Group', 1),
	('EMI', 2),
	('Apple Records', 2),
	('Geffen Records', 1),
	('Sire Warner Bros', 1),
	('UMG Recordings', 3),
	('Elektra Records LLC', 2),
	('Atlantic Recording Corporation', 4),
	('Atlantic Recording Corporation', 1),
	('Rimas Entertainment LLC', 5),
	('RCA Records', 3),
	('Universal International Music BV', 2),
	('Columbia Records', 5),
	('BigHit Entertainment', 6),
	('Interscope Records', 3),
	('Ministry of Sound Recordings Limited', 5),
	('WK Records', 1),
	('White World Music', 3),
	('Epic Records.', 4),
	('Internet Money Records', 5),
	('Aftermath Entertainment', 1),
	('Atlantic', 1),
	('Capitol Records', 6),
	('CBS', 3),
	('CBS Masterworks', 7),
	('Commodore', 1),
	('Death Row Records', 5),
	('Decca', 1),
	('Detroit Underground', 1),
	('Dial Records', 1),
	('Diynamic Music', 7),
	('Etcetera Records B.V.', 8),
	('Fania Records', 1),
	('Inca Records', 9),
	('M nus', 6),
	('Music Hall', 10),
	('Musicraft', 1),
	('Naxos Records', 1),
	('ND Nueva Direccion En La Cultura', 10),
	('NMC', 2),
	('Octave', 2),
	('Odeon', 10),
	('Prestige', 1),
	('RCA Victor Red Seal', 7),
	('REKIDS', 7),
	('Riverside Records', 1),
	('Roc-A-Fella Records', 6),
	('Roc-A-Fella Records, Universal Music', 5),
	('Sony Music', 11),
	('Stip Record', 12),
	('Tico Records', 1),
	('Trova', 13),
	('Truesoul', 14),
	('UA Latino', 3);
    
-- Usuarios
INSERT INTO usuarios (usuario, nom_y_ape, email, password_hash, fecha_nac, sexo, cp, id_pais, tipo_usuario_actual, cambio_de_password)
VALUES
	('MORTIZ', 'MARIA ORTIZ', 'mortiz@example.com', '', '1975-09-27', 'F', '1001', 1, 3, '2025-10-01 00:00:00'),
	('LGOMEZ', 'LUISA GOMEZ', 'lgomez@example.com', '', '1971-12-12', 'F', '118942', 2, 2, '2025-09-20 00:00:00'),
	('JWATSON', 'JHON WATSON', 'jwatson@example.com', '', '2003-10-22', 'M', '10029', 3, 1, '2025-10-05 00:00:00');
    
-- Albums
INSERT INTO albums (nombre_album, id_artista, id_discografica, imagen_portada, anio_publicacion) VALUES
	('Is There Anybody Out There', 1, 4, 'imagenalbum.jpg', 1980),
	('Radio Sampler 2xCD', 1, 4, '', 1988),
	('Delicate Sound Of Thunder', 1, 4, 'imagenalbum.jpg', 1988),
	('Abbey Road', 4, 5, '', 1969),
	('Use Your Illusion II', 5, 6, '', 1991),
	('Appetite for Destruction', 5, 6, 'imagenalbum.jpg', 1987),
	('True Blue', 7, 7, '', 1986),
	('Like A Virgin', 7, 7, 'imagenalbum.jpg', 1984),
	('Fito Paez', 8, 4, '', 1985),
	('Antología', 8, 3, 'imagenalbum.jpg', 1993),
	('Diego Torres', 9, 4, '', 1992),
	('Loba', 10, 1, 'imagenalbum.jpg', 2009),
	('Pies Descalzos', 10, 3, '', 1995),
	('Papi Juancho', 11, 1, 'imagenalbum.jpg', 2020),
	('Vives', 12, 1, '', 2017),
	('OCEAN', 13, 3, 'imagenalbum.jpg', 2019),
	('Cello Concertos', 14, 27, '', 1983),
	('Plays Weir, Finnissy, Newman And Skempton', 15, 42, 'imagenalbum.jpg', 1990),
	('My Father Knew Charles Ives and Harmonielehre', 16, 40, '', 2014),
	('Pied Piper Fantasy', 17, 45, 'imagenalbum.jpg', 1985),
	('Le Secret De La Vie', 18, 52, '', 1976),
	('Solo Works', 19, 33, 'imagenalbum.jpg', 1991),
	('Charlie Parker Sextet', 20, 31, '', 1947),
	('Relaxin With The Miles Davis Quintet', 21, 44, 'imagenalbum.jpg', 1958),
	('Dizzy Gillespie And His All-Stars', 22, 39, '', 1947),
	('King Of The Tenor Sax', 23, 28, 'imagenalbum.jpg', 1957),
	('Distinctive Song Styling', 24, 30, '', 1949),
	('Yes Indeed!', 25, 24, 'imagenalbum.jpg', 1958),
	('Chet Baker In New York', 26, 47, '', 1958),
	('Son Con Guaguancó', 27, 53, 'imagenalbum.jpg', 1959),
	('Maestra Vida', 28, 34, '', 1980),
	('El Malo', 29, 34, 'imagenalbum.jpg', 1967),
	('La Voz', 30, 36, '', 1975),
	('Tito Rodriguez At The Palladium', 31, 55, 'imagenalbum.jpg', 1960),
	('Amor Y Alegria', 32, 26, '', 1987),
	('Adios Nonino', 33, 54, 'imagenalbum.jpg', 1984),
	('Así Cantaba Carlitos', 34, 43, '', 1930),
	('Cuando El Río Suena', 35, 41, 'imagenalbum.jpg', 1995),
	('Alma De Bohemio', 36, 38, '', 1983),
	('Aura', 37, 50, 'imagenalbum.jpg', 2007),
	('Monton De Vida', 38, 32, '', 1985),
	('Let Me Ride', 39, 36, 'imagenalbum.jpg', 1992),
	('Kamikaze', 40, 23, '', 2018),
	('Doggystyle', 41, 29, 'imagenalbum.jpg', 1993),
	('The Black Album', 42, 49, '', 2003),
	('Check Your Head', 43, 25, 'imagenalbum.jpg', 1992),
	('Late Registration', 44, 50, '', 2005),
	('Back To Mine', 45, 42, 'imagenalbum.jpg', 2001),
	('Play It Loud!', 46, 37, '', 2011),
	('Biosfera', 47, 31, 'imagenalbum.jpg', 2018),
	('The Remixes', 48, 46, '', 2014),
	('Ignition Key', 49, 55, 'imagenalbum.jpg', 2010),
	('Dance Baby', 50, 32, '', 2011);

-- Canciones
INSERT INTO canciones (titulo, duracion_seg, id_album, reproducciones, likes)
VALUES
	('In The Flesh', 195, 1, 1000050, 7500),
	('The Thin Ice', 149, 1, 850050, 7600),
	('Gone For Bad', 215, 2, 1200400, 6500),
	('Fink Is The King', 189, 2, 218500, 8600),
	('Shine On You Crazy Diamond', 692, 3, 210000, 4500),
	('Yet Another Movie', 246, 3, 4500668, 1500),
	('Oh! Darling', 196, 4, 1598634, 256986),
	('Come Together', 252, 4, 3568946, 103569),
	('Something', 182, 4, 628634, 5698),
	('The End', 123, 4, 68946, 3569),
	('Open Your Heart', 248, 7, 2500245, 1785444),
	('Material Girl', 242, 7, 457788, 68555),
	('Open Your Heart', 214, 7, 7500277, 985444),
	('Cancion Sobre Cancion', 209, 9, 988100, 578101),
	('11 Y 6', 177, 9, 1122554, 245778),
	('Y Dale Alegría A Mi Corazón', 309, 10, 1985663, 658874),
	('El Amor Después Del Amor', 306, 10, 2100358, 35456),
	('Estamos Juntos', 263, 11, 389555, 12488),
	('No Tengas Miedo', 255, 11, 258456, 5247);

-- Generos
INSERT INTO genero (nombre) VALUES
	('Rock'),
	('Soul'),
	('Pop');

INSERT INTO cancion_genero (id_cancion, id_genero) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(3, 2),
	(4, 1),
	(5, 1),
	(6, 3),
	(6, 1),
	(7, 3),
	(7, 1),
	(8, 3),
	(8, 1),
	(9, 3),
	(9, 1),
	(10, 1),
	(11, 3),
	(12, 3),
	(13, 3),
	(14, 3),
	(15, 1),
	(16, 1),
	(17, 3),
	(18, 3),
	(19, 3);

-- Playlists
-- Activa 1
INSERT INTO playlists (titulo, id_usuario, cant_canciones, estado, fecha_creacion)
VALUES
('Correr', 1, 3, 'activa', '2020-02-27 00:00:00');

-- Eliminada 2
INSERT INTO playlists (titulo, id_usuario, cant_canciones, estado, fecha_creacion, fecha_eliminada)
VALUES
('Gym', 2, 3, 'eliminada', '2020-03-07 00:00:00', '2020-04-10 00:00:00');

-- 3
INSERT INTO playlists (titulo, id_usuario, cant_canciones, estado, fecha_creacion)
VALUES
('Estudiar', 2, 3, 'activa', '2020-03-25 00:00:00');

-- 4
INSERT INTO playlists (titulo, id_usuario, cant_canciones, estado, fecha_creacion)
VALUES
('Pista', 3, 3, 'activa', '2020-03-30 00:00:00');

-- Playlist 1 (activa)
INSERT INTO playlist_cancion (id_playlist, id_cancion, orden)
VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4),
(1, 5, 5),
(1, 9, 6);

-- Playlist 2 (eliminada)
INSERT INTO playlist_cancion (id_playlist, id_cancion, orden)
VALUES
(2, 2, 1),
(2, 1, 2),
(2, 3, 3);

-- Playlist 3
INSERT INTO playlist_cancion (id_playlist, id_cancion, orden)
VALUES
(3, 9, 1),
(3, 10, 2),
(3, 11, 3);

-- Playlist 4
INSERT INTO playlist_cancion (id_playlist, id_cancion, orden)
VALUES
(4, 16, 1),
(4, 17, 2),
(4, 18, 3);

-- Suscripciones
INSERT INTO suscripciones (id_usuario, id_tipo_usuario, fecha_inicio, fecha_renovacion)
VALUES
	(1, 3, '2025-01-01 00:00:00', '2025-02-01 00:00:00'),
    (1, 3, '2025-02-01 00:00:00', '2025-03-01 00:00:00'),
    (2, 2, '2025-02-01 00:00:00', '2025-03-01 00:00:00'),
    (1, 3, '2025-03-01 00:00:00', '2025-12-01 00:00:00'),
    (2, 2, '2025-03-01 00:00:00', '2025-12-01 00:00:00'),
    (3, 1, '2025-07-01 00:00:00', '2025-10-01 00:00:00'),
	(3, 1, '2021-01-01 00:00:00', '2025-11-01 00:00:00'),
    (3, 1, '2025-11-01 00:00:00', '2026-01-01 00:00:00');
    
-- Metodos de pago
INSERT INTO metodo_pago (id_usuario, tipo_forma_pago, cbu, banco_codigo, nro_tarjeta_masc, mes_caduca, anio_caduca)
VALUES
	(1, 'Efectivo', null, 0, null, null, null),
    (1, 'Tarjeta de débito', null, 1, '**** **** **** 1881', 1, 2021),
    (2, 'Débito automático x banco', '******************2854', 0, null, null, null),
    (3, 'Débito automático x banco', '******************4096', 0, null, null, null),
    (2, 'Tarjeta de crédito', null, 7, '**** **** **** 6545', 10, 2022),
    (3, 'Débito automático x banco', '******************4096', 0, null, null, null);
    
-- Pagos
INSERT INTO pagos (id_usuario, id_suscripcion, id_metodo_pago, importe, fecha_pago)
VALUES
	(1, 1, 1, 0, '2020-01-01 00:00:00'),
    (1, 2, 2, 0, '2020-02-01 00:00:00'),
    (2, 3, 3, 500, '2020-02-01 00:00:00'),
    (2, 5, 5, 100, '2020-03-01 00:00:00'),
    (3, 6, 4, 500, '2020-07-01 00:00:00'),
    (3, 8, 6, 700, '2021-01-01 00:00:00');

package basedatos;

import basedatos.dao.*;
import basedatos.exceptions.ExceptionCampoInexistente;
import basedatos.exceptions.ExceptionCampoInvalido;
import basedatos.modelo.*;
import com.mchange.v2.c3p0.ComboPooledDataSource;

import java.beans.PropertyVetoException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URL;
import java.sql.SQLException;
import java.util.*;

public class InterfazDatos {

    private static InterfazDatos ifd;
    private ComboPooledDataSource cpds;

    private InterfazDatos() throws IOException, PropertyVetoException {
        //Fichero properties
        Properties dbProps = new Properties();
        URL resource = this.getClass().getResource("./db.properties");
        File file = null;
        try {
            file = new File(resource.toURI());
        } catch(Exception e){
            System.out.println(resource.toString());
        }
        FileInputStream input = new FileInputStream(file);
        dbProps.load(input);
        cpds = new ComboPooledDataSource();

        cpds.setDriverClass(dbProps.getProperty("driver")); //loads the jdbc driver
        cpds.setJdbcUrl(dbProps.getProperty("url"));
        cpds.setUser(dbProps.getProperty("user"));
        cpds.setPassword(dbProps.getProperty("password"));

        // the settings below are optional -- c3p0 can work with defaults
        cpds.setMinPoolSize(3);
        cpds.setAcquireIncrement(5);
        cpds.setMaxPoolSize(200);
        cpds.setMaxStatements(180);

    }

    /*
     * Devuelve la instancia singleton de la clase InterfazDatos
     * Es necesario llamar a esta función primero para poder llamar al resto de métodos de esta interfaz:
     *      ejemplo de uso: InterfazDatos.instancia().crearUsuario(u);
     */
    public static InterfazDatos instancia() throws IOException, PropertyVetoException {
        if (ifd == null) {
            ifd = new InterfazDatos();
            return ifd;
        } else {
            return ifd;
        }
    }

    /*
     * Crea un usuario nuevo en el sistema. U debe contener (not null) como mínimo: username, correo, nombre, apellidos y admin
     */
    public void crearUsuario(UsuarioVO u) throws ExceptionCampoInexistente, SQLException {
        UsuarioDAO.crearUsuario(u, this.cpds);
        ArticuloUsuarioDAO.crearArticuloUsuario(new ArticuloUsuarioVO("Tapete Verde",'T',true, u.getUsername()), this.cpds);
        ArticuloUsuarioDAO.crearArticuloUsuario(new ArticuloUsuarioVO("Una cara",'A',true, u.getUsername()), this.cpds);
        ArticuloUsuarioDAO.crearArticuloUsuario(new ArticuloUsuarioVO("Heracleto Furnier",'B', true, u.getUsername()), this.cpds);
    }

    /*
     * Devuelve cierto si y sólo si el usuario username posee la contraseña plaintextPassword. Si el usuario no posee
     * ninguna contraseña lanzará la excepción ExceptionCampoInexistente
     */
    public boolean autentificarUsuario(String username, String plaintextPassword) throws  SQLException, ExceptionCampoInexistente {
        return UsuarioDAO.autentificarUsuario(username,plaintextPassword,this.cpds);
    }

	/* Devuelve el usuario que corresponde al token de Facebook fbToken.
	 * Devuelve null si no existe ningún usuario identificado con ese token.
	 */
	public UsuarioVO autentificarUsuarioFacebook(String fbToken) throws SQLException {
		return UsuarioDAO.autentificarUsuarioFacebook(fbToken, this.cpds);
	}

    /*
     * Devuelve un usuario con todos sus datos (datos de perfil de usuario), a partir de su username
     */
    public UsuarioVO obtenerDatosUsuario(String username) throws SQLException, ExceptionCampoInexistente{
        return UsuarioDAO.obtenerDatosUsuario(username, this.cpds);
    }

    /*
     * Elimina un usuario del sistema a partir de su username (no lo elimina por completo, solo le impide el acceso)
     */
    public void eliminarUsuario(String username) throws SQLException, ExceptionCampoInexistente {
        UsuarioDAO.eliminarUsuario(username, this.cpds);
    }

    /*
     * Modifica los datos de perfil del usuario u (solamente los atributos que no son null)
     */
    public void modificarDatosUsuario(UsuarioVO u) throws ExceptionCampoInexistente, SQLException{
        UsuarioDAO.modificarDatosUsuario(u, this.cpds);
    }

    /*
     * Devuelve true si el usuario identificado por username es un administrador, false en caso contrario
     */
    public boolean esAdministrador(String username) throws ExceptionCampoInexistente, SQLException {
        return UsuarioDAO.esAdministrador(username, this.cpds);
    }

    /*
     * Devuelve las stats principales (puntuacion y divisa) del usuario username
     */
    public StatsUsuarioVO obtenerStatsUsuario(String username) throws ExceptionCampoInexistente, ExceptionCampoInvalido, SQLException {
        return StatsUsuarioDAO.obtenerStatsUsuario(username, this.cpds);
    }

    /*
     * Devuelve TODAS las Stats del usuario username:
     *      puntuacion, divisa, ligaActual, puesto, ligaMaxima, número de
     *      partidas ganadas, perdidas, abandonadas y en las que fue abandonado
     */
    public StatsUsuarioVO obtenerTodasStatsUsuario(String username) throws ExceptionCampoInexistente, ExceptionCampoInvalido, SQLException {
        return StatsUsuarioDAO.obtenerTodasStatsUsuario(username, this.cpds);
    }

    /* Inserta una nueva partida empezada en la base de datos y modifica el objeto PartidaVO
     * de forma que contiene el id de la partida.
     */
    public void crearNuevaPartida(PartidaVO p) throws SQLException {
        PartidaDAO.insertarNuevaPartida(p, this.cpds);
    }

	/* Se crea un nuevo torneo con todas sus fases, se devuelve en t el id del torneo por si se necesita
	 * El tiempo de inicio del torneo debe ser posterior al momento actual (en caso contrario, ExceptionCampoInvalido)
	 */
	public void crearTorneo(TorneoVO t) throws ExceptionCampoInvalido, SQLException {
		TorneoDAO.crearTorneo(t, this.cpds);
	}

	/* Modifica los datos del torneo (solamente aquellos atributos de t que no son null).
	 * t debe contener su id correspondiente de la base de datos (consultarlo con crearTorneo, o obtenerTorneosProgramados)
	 * Solo es posible realizar esta operación si el torneo no ha comenzado todavía (timeInicio > timeActual) y
	 * por tanto, no hay usuarios apuntados.
	 */
	public void modificarTorneo(TorneoVO t) throws ExceptionCampoInvalido, ExceptionCampoInexistente, SQLException {
		TorneoDAO.modificarTorneo(t, this.cpds);
	}

	/* Elimina el torneo identificado por "id" y todas sus fases.
	 * Solo es posible realizar esta operación si el torneo no ha comenzado todavía (timeInicio > timeActual) y
	 * por tanto, no hay usuarios apuntados.
	 */
	public void eliminarTorneo(BigInteger id) throws ExceptionCampoInvalido, ExceptionCampoInexistente, SQLException {
		TorneoDAO.eliminarTorneo(id, this.cpds);
	}

	/* Devuelve todos los datos del torneo identificado por "id"
	 */
	public TorneoVO obtenerDatosTorneo(BigInteger id) throws ExceptionCampoInexistente, SQLException {
		return TorneoDAO.obtenerDatosTorneo(id, this.cpds);
	}

	/* Devuelve todos los torneos programados (no finalizados ni llenos) a los que el usuario puede o podrá en un futuro apuntarse
	 * Para poder saber si es posible apuntarse en un torneo comprobar que timeInicio < timeActual
	 */
	public ArrayList<TorneoVO> obtenerTorneosProgramados() throws SQLException {
		return TorneoDAO.obtenerTorneosProgramados(this.cpds);
	}

    /* Inserta al Usuario u al Torneo t en su fase inicial.  Si u llena el numero de participantes de la fase
     * se produce el emparejamiento: utilizar obtenerPartidasFaseTorneo para saber el resultado de ese emparejamiento
     * Devuelve cierto si y solo si cuando se apunta al nuevo usuario se realiza el emparejamiento
     */
    public boolean apuntarTorneo(UsuarioVO u, TorneoVO t) throws  ExceptionCampoInvalido, SQLException {
        return TorneoDAO.apuntarTorneo(u,t,this.cpds);
    }

    /* Rellena los campos de FaseVO f. f debe de poseer la id del torneo y el número de fase
     * Se le rellenan los datos con las partidas (no empezadas, pero ya incluidas en la base de datos) y la lista
     * de participantes.
	 * Utilizar siempre esa función para comenzar todas las partidas de cada fase
     */
    public void obtenerPartidasFaseTorneo(FaseVO f) throws SQLException {
        PartidaDAO.obtenerPartidasFaseTorneo(f,this.cpds);
    }

	/* Elimina al jugador del torneo en el que estaba apuntado porque este lo abandona fuera de una partida, y por tanto,
	 * sin penalización sobre su puntuación ni divisa.
	 * Si el jugador se encontraba en la primera fase (aún no ha comenzado el torneo), simplemente lo elimina del torneo.
	 * Si el jugador se encontraba en fases posteriores, es eliminado del torneo y sustituido por la IA que jugará en su lugar.
	 * Cuidado! Esta función sólo debe utilizarse si un jugador abandona el torneo FUERA de una partida (esperando a
	 * que terminen el resto de partidas de la fase), ya que si es dentro de ella simplemente se debe rellenar el campo
	 * abandonador de la PartidaVO y llamar a finalizarPartida.
	 */
	public void abandonarTorneo(UsuarioVO u, TorneoVO t) throws ExceptionCampoInexistente, SQLException {
		TorneoDAO.abandonarTorneo(u,t,this.cpds);
	}

    /* Se modifican la partida p en la base de datos con los datos de finalización, p debe incluir
     * el id que se modificó en la función crearNuevaPartida(p).
     * Actualiza las puntuaciones y divisas de los usuarios implicados 
     *      (Ganada:3puntos / 5monedas, Perdida:0puntos / 1moneda, Abandonada:-1puntos/ 0monedas, Teabandonan:0puntos / 1moneda)
     * Si la partida era de Torneo, incluye al ganador en la siguiente fase y la recompensa depende de la fase del torneo
     *
     * La partida devuelve cierto si y solo si al incluir al ganador de esta partida de torneo en la siguiente fase del torneo
     * la fase se llena
     */
    public boolean finalizarPartida(PartidaVO p) throws ExceptionCampoInvalido, SQLException {
        // Finalizar partida
        return PartidaDAO.finalizarPartida(p, this.cpds);
    }

    /* Devuelve el id de la última partida que se ha introducido */
    public BigInteger obtenerIdUltimaPartida() throws SQLException {
        return PartidaDAO.obtenerIdUltimaPartida(this.cpds);
    }

    /* Devuelve un array con todas las partidas jugadas por el usuario identificado por username
     */
    public ArrayList<PartidaVO> obtenerHistorialPartidas(String username) throws SQLException {
        ArrayList<PartidaVO> res = PartidaDAO.obtenerHistorialPartidas(username, this.cpds);
        Collections.sort(res);
        return res;
    }

    /* Devuelve un array con todas las partidas públicas que todavía no han finalizado
     */
    public  ArrayList<PartidaVO> obtenerPartidasPublicasCurso() throws SQLException {
        return PartidaDAO.obtenerPartidasPublicasCurso(this.cpds); 
    }

    /* Crea una nueva liga en el sistema. Necesita un nombre y los porcentajes min y max que la definen
     */
    public void crearLiga(LigaVO l) throws SQLException, ExceptionCampoInvalido {
        LigaDAO.crearLiga(l, this.cpds);
    }
    
    /* Devuelve los datos básicos de la liga denominada nombre
     */
    public LigaVO obtenerDatosLiga(String nombre) throws SQLException, ExceptionCampoInexistente {
        return LigaDAO.obtenerDatosLiga(nombre, this.cpds);
    }

    /* Elimina la liga denominada nombre del sistema. Cuidado! Está operación no se permitirá si hay usuarios
     * que pertenezcan a esta liga
     */   
    public void eliminarLiga(String nombre) throws SQLException {
        LigaDAO.eliminarLiga(nombre, this.cpds);
    }

    /*
     * Modifica los datos de la liga l (solamente los atributos que no son null)
     */
    public void modificarDatosLiga(LigaVO l) throws SQLException, ExceptionCampoInexistente {
        LigaDAO.modificarDatosLiga(l,this.cpds);    
    }

    /*
     * Devuelve todas las ligas del sistema
     */
    public ArrayList<LigaVO> obtenerLigas() throws SQLException, ExceptionCampoInvalido {
        return LigaDAO.obtenerLigas(this.cpds);
    }
    
    /* Devuelve la clasificación actual completa de la liga denominada nombre ordenada de mayor a menor puntuacion, 
	 * formada por los nombres de los usuarios, sus puntuaciones y su puesto 
	 * (el resto de atributos de de los StatsUsuario tienen valor null o -1 si son int)
     */
    public ArrayList<StatsUsuarioVO> obtenerClasificacionLiga(String nombre) throws SQLException, ExceptionCampoInvalido {
        return LigaDAO.obtenerClasificacionLiga(nombre, this.cpds);
    }

    /* Añade un nuevo artículo al sistema. El atributo requiere de a puede ser nulo si no se requiere ninguna
     * liga para desbloquear el artículo
     */
    public void crearArticulo(ArticuloVO a) throws SQLException, ExceptionCampoInvalido {
        ArticuloDAO.crearArticulo(a, this.cpds); 
    }

    /* Elimina un artículo del sistema basándose en el nombre del artículo a
     */
    public void eliminarArticulo(ArticuloVO a) throws SQLException {
        ArticuloDAO.eliminarArticulo(a, this.cpds); 
    }

    /* Modifica el articulo del sistema con el nombre de a, deja todos sus atributos como los atributos de a
     */
    public void modificarArticulo(ArticuloVO a) throws SQLException, ExceptionCampoInexistente{
        ArticuloDAO.modificarArticulo(a, this.cpds); 
    }

    /* Devuelve el articulo con el nombre art
     */
    public ArticuloVO obtenerArticulo(String art) throws SQLException, ExceptionCampoInexistente {
        return ArticuloDAO.obtenerArticulo(art, this.cpds); 
    }

    /* Devuelve todos los articulos comprados por el usuario username
     */
    public ArrayList<ArticuloUsuarioVO> obtenerArticulosUsuario(String username) throws SQLException {
        return ArticuloUsuarioDAO.obtenerArticulosUsuario(username, this.cpds);
    }

    /* Marca el articulo de a como comprado para el usuario especificado en a.
     * a debe contener el tipo, favorito, nombre de usuario y nombre de artículo
     */
    public void comprarArticuloUsuario(ArticuloUsuarioVO a) throws SQLException, ExceptionCampoInvalido, ExceptionCampoInexistente {
        StatsUsuarioVO stats = StatsUsuarioDAO.obtenerStatsUsuario(a.getUsername(), this.cpds);
        System.out.println("Dinero: " + stats.getDivisa());
        boolean encontrado = false;
        for (ArticuloUsuarioVO art: ArticuloUsuarioDAO.obtenerArticulosTienda(a.getUsername(),this.cpds)) {
            if (art.getNombre().equals(a.getNombre())) {
                encontrado = true;
                System.out.println("Cuesta: " + art.getPrecio());
                if (art.isComprado()) { ArticuloUsuarioDAO.crearArticuloUsuario(a,this.cpds);}
                else if (!art.isDisponible()) { throw new ExceptionCampoInvalido("El Usuario: "+a.getUsername()+" no tiene la liga necesaria para el Articulo:"+a.getNombre());}
                else if (stats.getDivisa()<art.getPrecio()) { throw new ExceptionCampoInvalido("El Usuario: "+a.getUsername()+" no tiene el dinero necesario para el Articulo: "+a.getNombre());}
                else {
                    stats.setDivisa(stats.getDivisa()-art.getPrecio());
                    StatsUsuarioDAO.modificarStatsUsuario(stats, this.cpds);
                    ArticuloUsuarioDAO.crearArticuloUsuario(a, this.cpds);
                }
            }
        }
        if (!encontrado) { throw new ExceptionCampoInexistente("Error de acceso a la base de datos: Articulo: " + a.getNombre() + " no existente");}
    }

    /* Devuelve todos los artículos de la tienda para un usuario
     */
    public ArrayList<ArticuloUsuarioVO> obtenerArticulosTienda(String username) throws SQLException, ExceptionCampoInexistente {
        return ArticuloUsuarioDAO.obtenerArticulosTienda(username, this.cpds);
    }

    /*
        Devuelve el dorso favorito de un usuario
     */
    public ArticuloUsuarioVO obtenerDorsoFavorito(String username) throws SQLException, ExceptionCampoInexistente {
        ArrayList<ArticuloUsuarioVO> articulos = obtenerArticulosTienda(username);
        ArticuloUsuarioVO dorsoFavorito = null;
        for(ArticuloUsuarioVO art : articulos){
            if (art.isFavorito() && art.getTipo()=='B'){
                dorsoFavorito = art;
            }
        }
        return dorsoFavorito;
    }

    /*
        Devuelve el avatar favorito de un usuario
     */
    public ArticuloUsuarioVO obtenerAvatarFavorito(String username) throws SQLException, ExceptionCampoInexistente {
        ArrayList<ArticuloUsuarioVO> articulos = obtenerArticulosTienda(username);
        ArticuloUsuarioVO dorsoFavorito = null;
        for(ArticuloUsuarioVO art : articulos){
            if (art.isFavorito() && art.getTipo()=='A'){
                dorsoFavorito = art;
            }
        }
        if (username.equals("SophIA")) {
            return new ArticuloUsuarioVO("SophIA la chula",99999,"Marcando estilo en el hood","/img/sophia.png",'A',true,true,true,"SophIA");
        }
        return dorsoFavorito;
    }

    /*
        Devuelve el tapete favorito de un usuario
     */
    public ArticuloUsuarioVO obtenerTapeteFavorito(String username) throws SQLException, ExceptionCampoInexistente {
        ArrayList<ArticuloUsuarioVO> articulos = obtenerArticulosTienda(username);
        ArticuloUsuarioVO dorsoFavorito = null;
        for(ArticuloUsuarioVO art : articulos){
            if (art.isFavorito() && art.getTipo()=='T'){
                dorsoFavorito = art;
            }
        }
        return dorsoFavorito;
    }

	/* Crea una sesión abierta del usuario en la base de datos.
	 * Se utiliza cuando un usuario se desconecta en mitad de una partida.
	 */
	public void crearSesionAbierta(SesionVO s) throws SQLException {
		SesionDAO.crearSesionAbierta(s, this.cpds);
	}

	/* Devuelve la url del lugar donde se desconectó el usuario en la sesión abierta anterior.
	 * Devuelve null si el usuario username no tiene ninguna sesión abierta.
	 * Además, si existía borra la sesión abierta de la base de datos.
	 * Se utiliza para gestionar el cambio de dispositivo.
	 */
	public String obtenerUrlSesion(String username) throws SQLException {
		return SesionDAO.obtenerUrlSesion(username, this.cpds);
	}

	/* Crea un evento para crear torneos que se crearán periódicamente
	 */
	public void crearTorneoPeriodico(TorneoPeriodicoVO t) throws SQLException {
	    TorneoPeriodicoDAO.crearTorneoPeriodico(t,this.cpds);
    }

    /* Elimina un evento de creación de torneos periódicos. No elimina los torneos ya
     * jugados o en juego relacionados con él, simplemente dejará de crear nuevos.
     */
    public void eliminarTorneoPeriodico(String nombre) throws SQLException {
	    TorneoPeriodicoDAO.eliminarTorneoPeriodico(nombre,this.cpds);
    }

    /* Devuelve la información de todos los torneos periódicos que hay programados.
     * Si el evento se ha creado, pero todavía no se ha creado ningún torneo en concreto
     * devuelve solo la información asociada al evento (nombre, timePrimero y periodicidad en días)
     * y el resto de campos a null.
     * Si existen ya torneos creados por ese evento devuelve toda la información.
     */
	public ArrayList<TorneoPeriodicoVO> obtenerTorneosPeriodicos() throws  SQLException {
	    return TorneoPeriodicoDAO.obtenerTorneosPeriodicos(this.cpds);
    }

    /* Devuelve la partida todavía no acabada con el id pedido.
     */
    public PartidaVO obtenerPartida(BigInteger id) throws  SQLException {
	    return PartidaDAO.obtenerPartida(this.cpds,id);
    }

	public void cerrarPoolConexiones() {
		this.cpds.close();
	}
 }

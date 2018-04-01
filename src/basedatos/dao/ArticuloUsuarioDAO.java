
/*
 * Autor: Sergio Izquierdo Barranco
 * Fecha: 22-03-18
 * Fichero: Acceso a Datos de ArtículoUsuario
 */

package basedatos.dao;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import basedatos.modelo.*;


public class ArticuloUsuarioDAO {
    public static ArticuloVO obtenerArticulo(String artic, ComboPooledDataSource pool) {
        Connection connection = null;
        Statement statement = null;
        ResultSet res;
        ArticuloVO a = null;
        try {
            connection = pool.getConnection();
            statement = connection.createStatement();

            String obtener = "SELECT * FROM articulo WHERE nombre = '" + artic + "'";
            res = statement.executeQuery(obtener);

            res.next();

            a = new ArticuloVO(artic,res.getInt("precio"), res.getString("descripcion"), res.getString("rutaImagen"),res.getString("tipo").charAt(0));
//            String liga = res.getString("requiere_liga");
//            if (!res.wasNull()) {
//                a.setLiga(new Liga(liga));
//            }

        } catch (SQLException e ) {
            e.printStackTrace();
        } finally {
            if (statement != null) try { statement.close(); } catch (SQLException e) {e.printStackTrace();}
            if (connection != null) try { connection.close();} catch (SQLException e) {e.printStackTrace();}
        }
        return a;
    }
}
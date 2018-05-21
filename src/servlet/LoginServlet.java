/**
 * @author Marius Sorin Crisan
 *
 * @version 1.0
 * @since 	1.0
 *
 * Servlet implementation class LoginUsuarioServlet
 */

package servlet;

import basedatos.InterfazDatos;
import basedatos.modelo.SesionVO;
import basedatos.modelo.TorneoVO;
import basedatos.modelo.UsuarioVO;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;


@WebServlet(name = "LoginServlet")
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String nick = request.getParameter("loginUser");
        String pass = request.getParameter("loginPass");
        String token = request.getParameter("token");

        String error;
        try {
            if (token != null){

            } else if (nick== null || nick.equals("")) {
                error = "emptyUser";
                request.setAttribute("error", error);
                RequestDispatcher dispatcher = request.getRequestDispatcher("jsp/login.jsp");
                dispatcher.forward(request, response);
            } else if (pass == null || pass.equals("")) {
                error = "emptyPass";
                request.setAttribute("error", error);
                RequestDispatcher dispatcher = request.getRequestDispatcher("jsp/login.jsp");
                dispatcher.forward(request, response);
            } else {

                InterfazDatos facade;
                try{
                    facade = InterfazDatos.instancia();
                }catch (Exception e){
                    System.err.println("ERROR: Creando instancia");
                    e.printStackTrace();
                    response.sendRedirect("jsp/login.jsp");
                    return;
                }

                boolean existUser;
                try{
                    existUser = facade.autentificarUsuario(nick, pass);
                    System.out.println("Usuario autentificado");
                }catch(Exception e){
                    error= "userNotFound";
                    request.setAttribute("error",error);
                    RequestDispatcher dispatcher=request.getRequestDispatcher("jsp/login.jsp");
                    dispatcher.forward(request,response);
                    System.err.println("ERROR: Login al autentificar usuario");
                    e.printStackTrace();
                    response.sendRedirect("jsp/login.jsp");
                    return;
                }

                if (existUser){
                    UsuarioVO user;
                    try{
                        user = facade.obtenerDatosUsuario(nick);
                    } catch (Exception e){
                        System.err.println("ERROR: autentificando usuario");
                        e.printStackTrace();
                        return;
                    }

                    HttpSession sesion= request.getSession();
                    ArrayList<TorneoVO> torneos = null;

                    try{
                        torneos = facade.obtenerTorneosProgramados();
                    }catch (Exception e){
                        e.printStackTrace();
                        response.sendRedirect("jsp/matchmaking.jsp");
                        return;
                    }

                    sesion.setAttribute("torneos", torneos);

                    sesion.setAttribute("userId", user);
                    sesion.setMaxInactiveInterval(24*60*60);
                    String urlAbierta = null;
                    try {
                        urlAbierta = facade.obtenerUrlSesion(nick);
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    if (urlAbierta != null) {
                        // Tiene una partida abierta
                        System.out.println("Jugador con partida abierta. Redirigiendo...");
                        response.sendRedirect("juego.html?"+urlAbierta);
                    } else {
                        response.sendRedirect("jsp/matchmaking.jsp");
                    }
                } else { // Usuario no existe
                    error= "userNotFound";
                    request.setAttribute("error",error);
                    RequestDispatcher dispatcher=request.getRequestDispatcher("jsp/login.jsp");
                    dispatcher.forward(request,response);
                }
            }
        } catch (NullPointerException e){
            System.err.println("ERROR: NUll Pointer a Facade");
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}

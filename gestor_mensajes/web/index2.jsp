<%--
  Created by IntelliJ IDEA.
  User: Javier
  Date: 01/04/2018
  Time: 14:52
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>$Title$</title>
    <script>
        var id_partida = 0;
        var id_jugador = 1;
        var nombre_jugador = "jugador1";
        var total_parts = 2;
        var socket = new WebSocket("ws://localhost:8080/endpoint");
        var listo = JSON.stringify({
            "tipo_mensaje": "listo_jugador",
            "nombre_participante": nombre_jugador,
            "total_jugadores": total_parts,
            "tipo_participante": "jugador",
            "remitente": {
                "id_partida": id_partida,
                "id_jugador": id_jugador
            }
        });
        socket.onopen = function() {
            socket.send(listo);
        };
        socket.onmessage = function (msg) {
            console.log(msg.data);
        };
        function send() {
            socket.send(string);
        }
    </script>
  </head>
  <body>
  <button onclick="send()">Hola1</button>
  </body>
</html>

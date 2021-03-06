/*
 * Autor: Guerrero Viu, Julia
 * Fecha: 25-04-2018
 * Fichero: TorneoVO.java
 * Descripción: Representa un torneo con todos sus datos 
 */


package basedatos.modelo;

import java.util.Date;
import java.sql.Timestamp;
import java.math.BigInteger;

import basedatos.exceptions.*;

public class TorneoVO {

	private BigInteger id; // id artificial para reconocer los torneos en la base de datos (se rellena automáticamente en crearTorneo y se puede obtener al llamar a obtenerTorneosProgramados)
    private String nombre;
    private String descripcion;
    // Los siguientes porcentajes representan qué grupo de usuarios pertenecen a la liga (entre un porcentajeMin% y un porcentajeMax%)
   	private Timestamp timeInicio;
	private Timestamp timeCreacion;
	private boolean individual;
	private int numFases;
	private int premioPuntuacionPrimera;
	private int premioDivisaPrimera;

    public TorneoVO() { this.numFases = -1; this.premioPuntuacionPrimera = -1; this.premioDivisaPrimera = -1; this.individual = true; }

	/* Constructor completo con descripcion del torneo */    
	public TorneoVO(String nombre, String descripcion, Timestamp timeInicio, boolean individual, int numFases, int premioPuntuacionPrimera, int premioDivisaPrimera) throws ExceptionCampoInvalido {
        // Comprobar que la longitud de los campos no sea mayor que los limites de la base de datos
        if (nombre.length()>50){
            // Lanzar excepción de campo no válido
            throw new ExceptionCampoInvalido("Campo invalido, longitud " + nombre.length() + " mayor que la máxima permitida");
        }
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.individual = individual;
		this.timeInicio = timeInicio;
		this.numFases = numFases;
		this.premioPuntuacionPrimera = premioPuntuacionPrimera;
		this.premioDivisaPrimera = premioDivisaPrimera;
    }

	/* Constructor completo pero sin descripcion del torneo */  
	public TorneoVO(String nombre, Timestamp timeInicio, boolean individual, int numFases, int premioPuntuacionPrimera, int premioDivisaPrimera) throws ExceptionCampoInvalido {
        // Comprobar que la longitud de los campos no sea mayor que los limites de la base de datos
        if (nombre.length()>50){
            // Lanzar excepción de campo no válido
            throw new ExceptionCampoInvalido("Campo invalido, longitud " + nombre.length() + " mayor que la máxima permitida");
        }
        this.nombre = nombre;
        this.individual = individual;
		this.timeInicio = timeInicio;
		this.numFases = numFases;
		this.premioPuntuacionPrimera = premioPuntuacionPrimera;
		this.premioDivisaPrimera = premioDivisaPrimera;
    }

    public String getNombre(){
        return nombre;    
    }

    public String getDescripcion(){
        return descripcion;    
    }

	public BigInteger getId(){
		return id;
	}

	public Timestamp getTimeCreacion(){
		return timeCreacion;
	}

	public Timestamp getTimeInicio(){
		return timeInicio;
	}

	public boolean esIndividual(){
		return individual;
	}

	public int getNumFases(){
		return numFases;
	}

    public int getPremioPuntuacionPrimera(){
        return premioPuntuacionPrimera;    
    }
    
    public int getPremioDivisaPrimera(){
        return premioDivisaPrimera;    
    }

    public void setNombre(String nombre){
        this.nombre = nombre;    
    }

    public void setDescripcion(String descripcion){
        this.descripcion = descripcion;    
    }

	public void setId(BigInteger id){
		this.id = id;
	}

	public void setTimeCreacion(Timestamp t){
		this.timeCreacion = t;
	}

	public void setTimeInicio(Timestamp t){
		this.timeInicio = t;
	}

	public void setIndividual(boolean individual){
		this.individual = individual;
	}

	public void setNumFases(int numFases){
		this.numFases = numFases;
	}

    public void setPremioPuntuacionPrimera(int p){
        this.premioPuntuacionPrimera = p;  
    }

    public void setPremioDivisaPrimera(int d){
        this.premioDivisaPrimera = d;   
    }

}

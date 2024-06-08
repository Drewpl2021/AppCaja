package com.example.msfyv.dto;

import lombok.Data;

import java.util.Date;

@Data
public class PersonalDto {

    private Integer id;
    private String nombre;
    private String apellidos;
    private String dni;
    private String telefono;
    private String email;
    private String contraseña;
    private String cargo;
    private Date fechaAñadido;

}

package com.example.msclientes.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clientes")
public class Clientes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre_razonSocial;
    private String direccion;
    private String dni_ruc;


    public Clientes() {
    }

}

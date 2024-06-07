package com.example.msfyv.dto;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class ProductoDto {

    private Integer id;
    private String nombre;
    private String descripcion;
    private String precio;
    private String stock;
    private Integer id_proveedor;

}

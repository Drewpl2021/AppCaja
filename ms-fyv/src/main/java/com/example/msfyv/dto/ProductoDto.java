package com.example.msfyv.dto;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class ProductoDto {

    private Integer id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String stock;

}

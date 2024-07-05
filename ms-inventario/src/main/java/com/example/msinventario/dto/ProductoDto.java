package com.example.msinventario.dto;

import lombok.Data;

@Data
public class ProductoDto {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Double stock;
}

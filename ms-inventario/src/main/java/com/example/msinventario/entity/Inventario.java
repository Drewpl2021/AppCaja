package com.example.msinventario.entity;

import com.example.msinventario.dto.ProductoDto;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Double costo;
    private Integer estado ;
    private Double precio_venta;
    private Double stock;
    private Double stock_minimo;
    private Double stock_maximo;
    private Integer productoId;
    @Transient
    private ProductoDto productoDto;
}

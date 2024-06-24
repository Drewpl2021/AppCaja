package com.example.msfyv.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productosvendidos")
public class ProductosVendidos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombreVen;
    private Double cantidad;
    private Integer precioUnitario;
    private Integer productoId;
}

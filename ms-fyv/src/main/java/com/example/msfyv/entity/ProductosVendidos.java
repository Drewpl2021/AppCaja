package com.example.msfyv.entity;

import com.example.msfyv.dto.ProductoDto;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productosvendidos")
public class ProductosVendidos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer nombreVen;
    private Double cantidad;
    private Integer precioUnitario;
    private Integer productoId;

    public ProductosVendidos() {

    }

    @Transient
    private ProductoDto productoDto;
}

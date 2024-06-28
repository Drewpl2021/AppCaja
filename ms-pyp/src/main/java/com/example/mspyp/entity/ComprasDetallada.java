package com.example.mspyp.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class ComprasDetallada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Double precio_subtotal;
    private Double cantidad;
    private Double total;
    private String descripcion;
    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;
    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;
}

package com.example.mspyp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String stock;
    @Enumerated(EnumType.STRING)
    private Unidades unidades_medida;
    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;





    public Producto() {
        this.precio = (double) 0;
    }

    public enum Unidades {
        GALON,
        UNID,
    }
}

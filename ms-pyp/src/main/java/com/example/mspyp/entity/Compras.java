package com.example.mspyp.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "compras")
public class Compras {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date fecha;
    private String descripcion;
    @ManyToOne
    @JoinColumn(name = "id_compra_detalle")
    private ComprasDetallada comprasDetallada;

}

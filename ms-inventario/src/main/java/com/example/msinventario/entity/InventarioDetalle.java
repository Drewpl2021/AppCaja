package com.example.msinventario.entity;

import com.example.msinventario.dto.ProductoDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity



public class InventarioDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String codigo_transaccion;
    private Date fecha;
    private Double entrada;
    private Double salida;
    private Double costo_total;
    private Double precio_de_compra;
    private Integer productoId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventario_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Inventario inventario;
    @Transient
    private ProductoDto productoDto;

    //public Double calcularCambioStock() {
        //return entrada - salida;
    //}
}

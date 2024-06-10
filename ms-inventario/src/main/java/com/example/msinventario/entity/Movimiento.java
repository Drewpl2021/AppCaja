package com.example.msinventario.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Movimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String codigo_transaccion;
    private Date fecha;
    private Double entrada;
    private Double salida;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventario_id")
    private Inventario inventario;
    public Double calcularCambioStock() {
        return entrada - salida;
    }
}

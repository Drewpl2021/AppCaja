package com.example.msfyv.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "factura")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date fecha_hora;

    public Factura() {
    }
    @PrePersist
    protected void onCreate() {
        fecha_hora = new Date();
    }
}

package com.example.msfyv.entity;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.feign.ProductoFeign;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "factura")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date fecha_hora;
    private Double cantidad;
    private Double precioUnitario;
    private Double igv;
    private Double total;
    private Integer productoId;
    private Integer clienteId;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "factura_id")
    private List<RegistroVentas> detalle;




    @PrePersist
    protected void onCreate() {
        fecha_hora = new Date();
    }

    public void calcularTotal() {
        if (this.precioUnitario != null && this.cantidad != null) {
            this.total = this.precioUnitario * this.cantidad;
        }
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
        calcularTotal();
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
        calcularTotal();
    }





        @Transient
    private ProductoDto productoDto;
    @Transient
    private ClientesDto clientesDto;
}

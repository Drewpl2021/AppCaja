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
    private Double igv;
    private Double subTotal;
    private String serie;
    private Double total;
    private Integer clienteId;
    private Integer nombreVen;







    public Factura() {

}





    @Transient
    private List<ProductosVendidos> productosVendidosList;
    @Transient
    private ClientesDto clientesDto;
}

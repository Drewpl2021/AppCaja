package com.example.msfyv.service.impl;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.entity.Factura;
import com.example.msfyv.entity.ProductosVendidos;
import com.example.msfyv.feign.ClientesFeign;
import com.example.msfyv.feign.ProductoFeign;
import com.example.msfyv.repository.FacturaRepository;
import com.example.msfyv.repository.ProductosVendidosRepository;
import com.example.msfyv.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FacturaServiceimpl implements FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private ProductoFeign productoFeign;

    @Autowired
    private ClientesFeign clientesFeign;
    @Autowired
    private ProductosVendidosRepository productosVendidosRepository;


    @Override
    public List<Factura> listar(){

        return facturaRepository.findAll();
    }


    @Override
    public Factura guardar(Factura factura) {
        factura.setSerie("CAJA1");
        // Obtener los detalles del cliente
        ClientesDto cliente = clientesFeign.listById(factura.getClienteId()).getBody();



        // Obtener los productos vendidos asociados al nombreVen de la factura
        List<ProductosVendidos> productosVendidosList = productosVendidosRepository.findByNombreVen(factura.getNombreVen());

        // Calcular el total sumando el precioUnitario * cantidad de cada producto vendido
        double total = 0.0;
        for (ProductosVendidos producto : productosVendidosList) {
            total += producto.getPrecioUnitario() * producto.getCantidad();
        }
        total = Math.round(total * 100.0) / 100.0;
        factura.setTotal(total);

        // Calcular el igv
        double igv = total * 0.18;
        igv = Math.round(igv * 100.0) / 100.0;
        factura.setIgv(igv);

        // Establecer la fecha y hora actuales
        factura.setFecha_hora(new Date());

        // Guardar la factura
        Factura savedFactura = facturaRepository.save(factura);

        // Establecer los detalles del cliente en la factura guardada
        savedFactura.setClientesDto(cliente);

        // Almacenar los productos vendidos en la respuesta
        savedFactura.setProductosVendidosList(productosVendidosList);

        return savedFactura;
    }

    @Override
    public Factura actualizar(Factura factura) {

        return facturaRepository.save(factura);
    }



    @Override
    public Optional<Factura> listarPorId(Double id) {
        Optional<Factura> facturaOpt = facturaRepository.findById(id);
        if (facturaOpt.isPresent()) {
            Factura factura = facturaOpt.get();

            // Obtener los detalles del cliente
            ClientesDto cliente = clientesFeign.listById(factura.getClienteId()).getBody();
            factura.setClientesDto(cliente);

            // Obtener los productos vendidos asociados al nombreVen de la factura
            List<ProductosVendidos> productosVendidosList = productosVendidosRepository.findByNombreVen(factura.getNombreVen());
            factura.setProductosVendidosList(productosVendidosList);

            return Optional.of(factura);
        }
        return facturaOpt;
    }


    @Override
    public void eliminarPorId(Double id) {

        facturaRepository.deleteById(id);
    }

    @Override
    public List<ClientesDto> listarClientesDto() {
    List<Factura> facturas = facturaRepository.findAll();
    List<ClientesDto> clientesDtos = new ArrayList<>();

    for (Factura factura : facturas) {
        ClientesDto clientesDto = clientesFeign.listById(factura.getClienteId()).getBody();
        if (clientesDto != null) {
            clientesDtos.add(clientesDto);
        }
    }

    return clientesDtos;
}


}

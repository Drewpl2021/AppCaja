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

        double subtotal = 0.0;
        for (ProductosVendidos producto : productosVendidosList) {
            if (producto.getPrecioUnitario() != null && producto.getCantidad() != null) {
                subtotal += producto.getPrecioUnitario() * producto.getCantidad();
            } else {
                // Manejar el caso cuando precioUnitario o cantidad es null
                throw new IllegalArgumentException("El precio unitario y la cantidad no pueden ser nulos");
            }
        }
        subtotal = Math.round(subtotal * 100.0) / 100.0;
        factura.setSubTotal(subtotal);

        // Calcular el igv
        double igv = subtotal * 0.18; // Suponiendo que el IGV es el 18% del subtotal
        igv = Math.round(igv * 100.0) / 100.0;
        factura.setIgv(igv);

        // Calcular el total
        double total = subtotal + igv;
        total = Math.round(total * 100.0) / 100.0;
        factura.setTotal(total);

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

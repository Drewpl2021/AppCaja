package com.example.msfyv.service.impl;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.entity.Factura;
import com.example.msfyv.feign.ClientesFeign;
import com.example.msfyv.feign.ProductoFeign;
import com.example.msfyv.repository.FacturaRepository;
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



    @Override
    public List<Factura> listar(){

        return facturaRepository.findAll();
    }


    @Override
    public Factura guardar(Factura factura) {
        // Obtener los detalles del cliente
        ClientesDto cliente = clientesFeign.listById(factura.getClienteId()).getBody();
        // Calcular el total
        double total = factura.getPrecioUnitario() * factura.getCantidad();
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
        return facturaRepository.save(factura);
    }

    @Override
    public Factura actualizar(Factura factura) {

        return facturaRepository.save(factura);
    }



    @Override
    public Optional<Factura> listarPorId(Double id){
    Optional<Factura> factura= facturaRepository.findById(id);
    ClientesDto clientesDto = clientesFeign.listById(factura.get().getClienteId()).getBody();
    //ProductoDto productoDto = productoFeign.listById(factura.get().getProductoId()).getBody();
    factura.get().setClientesDto(clientesDto);
    //factura.get().setProductoDto(productoDto);
    return facturaRepository.findById(id);
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

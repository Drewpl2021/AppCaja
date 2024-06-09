package com.example.msfyv.service.impl;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.entity.Factura;
import com.example.msfyv.entity.RegistroVentas;
import com.example.msfyv.feign.ClientesFeign;
import com.example.msfyv.feign.ProductoFeign;
import com.example.msfyv.repository.FacturaRepository;
import com.example.msfyv.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FacturaServiceimpl implements FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;
    @Autowired
    private ClientesFeign clientesFeign;

    @Autowired
    private ProductoFeign productoFeign;

    @Override
    public List<Factura> listar(){

        return facturaRepository.findAll();
    }

    @Override
    public Factura guardar(Factura factura) {

        return facturaRepository.save(factura );
    }

    @Override
    public Factura actualizar(Factura factura) {

        return facturaRepository.save(factura);
    }

    @Override
    public Optional<Factura> listarPorId(Integer id){

        Optional<Factura> factura= facturaRepository.findById(id);
        ClientesDto clientesDto = clientesFeign.listById(factura.get().getClienteId()).getBody();
        /*for (PedidoDetalle pedidoDetalle : pedido.get().getDetalle()){
            pedidoDetalle.setProductoDto(productoFeign.buscarlistarPorld(pedidoDetalle.getProductoId()).getBody());
        }*/
        List<RegistroVentas> facturasdetalles = factura.get().getDetalle().stream().map(facturadetalle -> {
            ResponseEntity<ProductoDto> response = productoFeign.listById(facturadetalle.getProductoId());
            if (response.getStatusCode().is2xxSuccessful()) {
                ProductoDto productoDto = response.getBody();
                if (productoDto != null) {
                    facturadetalle.setProductoDto(productoDto);
                } else {
                    // Manejar el caso en el que el cuerpo de la respuesta es null
                    System.out.println("El cuerpo de la respuesta es null para el productoId: " + facturadetalle.getProductoId());
                }
            } else {
                // Manejar el caso en el que el estado de la respuesta no es 2xx
                System.out.println("El estado de la respuesta no es 2xx para el productoId: " + facturadetalle.getProductoId());
            }
            return facturadetalle;
        }).collect(Collectors.toList());
        /*--Captura Cliente-*/
        factura.get().setClientesDto(clientesDto);
        factura.get().setDetalle(facturasdetalles);
        return facturaRepository.findById(id);

    }

    @Override
    public void eliminarPorId(Integer id) {

        facturaRepository.deleteById(id);
    }





}

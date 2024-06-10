package com.example.msfyv.service.impl;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.entity.Factura;
import com.example.msfyv.feign.ClientesFeign;
import com.example.msfyv.feign.ProductoFeign;
import com.example.msfyv.repository.FacturaRepository;
import com.example.msfyv.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacturaServiceimpl implements FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;
    private ProductoFeign productoFeign;

    @Autowired
    private ClientesFeign clientesFeign;

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
    public Optional<Factura> listarPorId(Double id){
        Optional<Factura> factura= facturaRepository.findById(id);
        ClientesDto clientesDto = clientesFeign.listById(factura.get().getClienteId()).getBody();
        /*for (PedidoDetalle pedidoDetalle : pedido.get().getDetalle()){
            pedidoDetalle.setProductoDto(productoFeign.buscarlistarPorld(pedidoDetalle.getProductoId()).getBody());
        }*/
        factura.get().setClientesDto(clientesDto);
        return facturaRepository.findById(id);
    }


    @Override
    public void eliminarPorId(Double id) {

        facturaRepository.deleteById(id);
    }







}

package com.example.msfyv.service.impl;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.dto.PersonalDto;
import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.entity.Factura;
import com.example.msfyv.entity.ProductosVendidos;
import com.example.msfyv.feign.ClientesFeign;
import com.example.msfyv.feign.PersonalFeign;
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
    @Autowired
    private PersonalFeign personalFeign;


    @Override
    public List<Factura> listar(){

        return facturaRepository.findAll();
    }


    @Override
    public Factura guardar(Factura factura) {
        // Obtener los detalles del cliente
        ClientesDto cliente = clientesFeign.listById(factura.getClienteId()).getBody();
        PersonalDto personal = personalFeign.listById(factura.getPersonalId()).getBody();




        // Obtener los productos vendidos asociados al nombreVen de la factura
        List<ProductosVendidos> productosVendidosList = productosVendidosRepository.findByNombreVen(factura.getNombreVen());

        double total = 0.0;
        for (ProductosVendidos producto : productosVendidosList) {
            if (producto.getPrecioUnitario() != null && producto.getCantidad() != null) {
                total += producto.getPrecioUnitario() * producto.getCantidad();
            } else {
                // Manejar el caso cuando precioUnitario o cantidad es null
                throw new IllegalArgumentException("El precio unitario y la cantidad no pueden ser nulos");
            }
        }
        total = Math.round(total * 100.0) / 100.0;
        factura.setTotal(total);
        // Calcular el subtotal dividiendo el total por 1.18
        double subtotal = total / 1.18;
        subtotal = Math.round(subtotal * 100.0) / 100.0;
        // Calcular el IGV como la diferencia entre el total y el subtotal
        double igv = total - subtotal;
        factura.setSubTotal(subtotal);
        igv = Math.round(igv * 100.0) / 100.0;
        factura.setIgv(igv);
        // Establecer la fecha y hora actuales
        factura.setFecha_hora(new Date());

        // Guardar la factura
        Factura savedFactura = facturaRepository.save(factura);

        // Establecer los detalles del cliente en la factura guardada
        savedFactura.setClientesDto(cliente);
        savedFactura.setPersonalDto(personal);


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

            PersonalDto personal = personalFeign.listById(factura.getPersonalId()).getBody();
            factura.setPersonalDto(personal);

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
    @Override
    public List<PersonalDto> listarPersonalDto() {
        List<Factura> facturas = facturaRepository.findAll();
        List<PersonalDto> personalDtos = new ArrayList<>();


        for (Factura factura : facturas) {
            PersonalDto personalDto = personalFeign.listById(factura.getPersonalId()).getBody();
            if (personalDto != null) {
                personalDtos.add(personalDto);
            }
        }

        return personalDtos;
    }


}

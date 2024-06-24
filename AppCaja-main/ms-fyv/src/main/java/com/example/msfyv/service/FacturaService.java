package com.example.msfyv.service;

import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.entity.Factura;

import java.util.List;
import java.util.Optional;

public interface FacturaService {

    public List<Factura> listar();

    public Factura guardar(Factura factura);

    public Factura actualizar(Factura factura);

    public Optional<Factura> listarPorId(Double id);

    public void eliminarPorId(Double id);

    List<ClientesDto> listarClientesDto();
}

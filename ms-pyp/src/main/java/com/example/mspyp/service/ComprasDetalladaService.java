package com.example.mspyp.service;

import com.example.mspyp.entity.Compras;
import com.example.mspyp.entity.ComprasDetallada;

import java.util.List;
import java.util.Optional;

public interface ComprasDetalladaService {
    public List<ComprasDetallada> listar();

    public ComprasDetallada guardar(ComprasDetallada comprasDetallada);

    public ComprasDetallada actualizar(ComprasDetallada comprasDetallada);

    public Optional<ComprasDetallada> listarPorId(Integer id);

    public void eliminarPorId(Integer id);

}

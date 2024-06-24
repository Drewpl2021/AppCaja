package com.example.msinventario.service.impl;

import com.example.msinventario.dto.ProductoDto;
import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.feing.ProductoFeing;
import com.example.msinventario.repository.InventarioDetalleRepository;
import com.example.msinventario.repository.InventarioRepository;
import com.example.msinventario.service.InventarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventarioServiceImpl implements InventarioService {
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private InventarioDetalleRepository inventarioDetalleRepository;
    @Autowired
    private ProductoFeing productoFeign;
    private static final Logger logger = LoggerFactory.getLogger(InventarioServiceImpl.class);


    @Override
    public List<Inventario> listar(){
        return inventarioRepository.findAll();
    }
    @Override
    public Inventario guardar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }
    @Override
    public Inventario actualizar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }
    @Override
public Optional<Inventario> listarPorId(Integer id){
    Optional<Inventario> inventarios = inventarioRepository.findById(id);
    if (inventarios.isPresent()) {
        Integer productoId = inventarios.get().getProductoId(); // Ahora puedes obtener el ID del producto directamente de la entidad Inventario
        ProductoDto productoDto = productoFeign.listById(productoId).getBody();
        inventarios.get().setProductoDto(productoDto);
    }
    return inventarios;
}
    @Override
    public void eliminarPorId(Integer id) {
        inventarioRepository.deleteById(id);
    }


}

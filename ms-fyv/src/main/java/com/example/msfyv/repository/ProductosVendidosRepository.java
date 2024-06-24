package com.example.msfyv.repository;

import com.example.msfyv.entity.ProductosVendidos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductosVendidosRepository extends JpaRepository<ProductosVendidos, Double> {
    List<ProductosVendidos> findByNombreVen(Integer nombreVen);
}

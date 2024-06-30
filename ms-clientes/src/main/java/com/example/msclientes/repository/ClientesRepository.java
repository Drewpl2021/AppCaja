package com.example.msclientes.repository;

import com.example.msclientes.entity.Clientes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientesRepository  extends JpaRepository<Clientes, Integer> {
    @Query("SELECT c FROM Clientes c WHERE c.nombreRazonSocial LIKE %:nombreRazonSocial%")
    Optional<Clientes> buscarPorNombreRazonSocialAproximado(@Param("nombreRazonSocial") String nombreRazonSocial);

    @Query("SELECT c FROM Clientes c WHERE c.dni_ruc LIKE %:dni_ruc%")
    Optional<Clientes> buscarPorDniRuc(@Param("dni_ruc") Integer dni_ruc);

}

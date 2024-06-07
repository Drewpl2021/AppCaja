package com.example.msclientes.repository;

import com.example.msclientes.entity.Clientes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientesRepository  extends JpaRepository<Clientes, Integer> {
}

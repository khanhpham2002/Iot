package com.example.Iot_spring.repository;

import com.example.Iot_spring.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISensor extends JpaRepository<Sensor,Integer> {
}

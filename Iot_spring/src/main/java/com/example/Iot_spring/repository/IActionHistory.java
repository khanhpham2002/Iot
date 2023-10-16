package com.example.Iot_spring.repository;

import com.example.Iot_spring.model.ActionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IActionHistory extends JpaRepository<ActionHistory,Integer> {
}

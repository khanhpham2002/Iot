package com.example.Iot_spring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "sensor")
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "temp")
    private int temp;

    @Column(name = "humidity")
    private int humidity;

    @Column(name = "light")
    private int light;

    @Column(name = "dust")
    private int dust;

    @Column(name = "ctime")
    private String ctime;
}


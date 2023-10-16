package com.example.Iot_spring.service;

import com.example.Iot_spring.model.Sensor;
import com.example.Iot_spring.repository.ISensor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorService {
    @Autowired
    private ISensor iSensor;

    public Sensor save(Sensor sensor){
        return iSensor.save(sensor);
    }

    public List<Sensor> getAllSensors() { return iSensor.findAll(); }


}

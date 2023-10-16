package com.example.Iot_spring.controller;

import com.example.Iot_spring.model.ActionHistory;
import com.example.Iot_spring.service.ActionHistoryService;
import com.example.Iot_spring.model.Sensor;
import com.example.Iot_spring.service.SensorService;
import com.fasterxml.jackson.databind.JsonNode;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/mqtt")
public class Controller {
    @Autowired
    SensorService sensorService;

    @Autowired
    ActionHistoryService actionHistoryService;
    @GetMapping("/allsensor")
    public ResponseEntity<?> getSensors(){
        return new ResponseEntity<>(sensorService.getAllSensors(), HttpStatus.OK);
    }

    @GetMapping("/newsensor")
    public ResponseEntity<?> getSensor() {
        List<Sensor> arr = sensorService.getAllSensors();

        return new ResponseEntity<>(arr.get(arr.size()-1),HttpStatus.OK);
    }
    @GetMapping("/allaction")
    public ResponseEntity<?> getActions() {
        List<ActionHistory> arr= actionHistoryService.getAllActions();
        return new ResponseEntity<>(arr,HttpStatus.OK);
    }
    @GetMapping("/lastaction")
    public ResponseEntity<?> getLastAction() {
        List<ActionHistory> arr= actionHistoryService.getAllActions();
        return new ResponseEntity<>(arr.get(arr.size()-1),HttpStatus.OK);
    }
    @PostMapping("/pub")
    public ResponseEntity<?> postData(@RequestBody JsonNode message) {
        try {
            String led1 = message.get("l1").asText();
            String led2 = message.get("l2").asText();

            String mess = led1+" "+led2;
            MqttClient client =new MqttClient("tcp://192.168.43.85:1883","MqttPublisher",new MemoryPersistence());
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            client.connect(connOpts);
            MqttMessage mqttMessage=new MqttMessage(mess.getBytes());
            client.publish("test",mqttMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return  new ResponseEntity<>(HttpStatus.OK);
    }



}

package com.example.Iot_spring.sub;

import com.example.Iot_spring.model.ActionHistory;
import com.example.Iot_spring.model.Sensor;
import com.example.Iot_spring.service.ActionHistoryService;
import com.example.Iot_spring.service.SensorService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.annotation.PostConstruct;
import netscape.javascript.JSObject;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class MqttSub {
    @Autowired
    SensorService sensorService;
    @Autowired
    ActionHistoryService actionHistoryService;
    @PostConstruct
    public void startMqttSub() {

        String brokerUrl = "tcp://192.168.43.85:1883";
        String clientId = "MqttSubscriber";
        String topic1 = "sensor/data";
        String topic2 = "led/control";
        try {
            MqttClient client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);

            System.out.println("Connecting to broker: " + brokerUrl);
            client.connect(connOpts);
            System.out.println("Connected");
            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    System.out.println("Connection lost: " + cause.getMessage());
                }
                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    String s = new String(message.getPayload());
                    if(topic.equals(topic1)){

                        Date currentTime1 = new Date();
                        SimpleDateFormat sdf1 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                        String formattedDate1 = sdf1.format(currentTime1);
                        Sensor sensor=new Sensor();
                        String[] res =s.trim().split(" ");

                        sensor.setCtime(formattedDate1);
                        sensor.setTemp(Integer.parseInt(res[0]));
                        sensor.setHumidity(Integer.parseInt(res[1]));
                        sensor.setLight(Integer.parseInt(res[2]));
                        sensor.setDust(Integer.parseInt(res[3]));


                        sensorService.save(sensor);
                        System.out.println("Message received on topic " + topic + ": " + s);
                    }
                    else if(topic.equals(topic2)) {
                        int l1 = Integer.parseInt(String.valueOf(s.charAt(0)));
                        int l2 = Integer.parseInt(String.valueOf(s.charAt(2)));


                        Date currentTime = new Date();
                        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                        String formattedDate = sdf.format(currentTime);
                        actionHistoryService.saveAction(new ActionHistory(1,l1,formattedDate));
                        actionHistoryService.saveAction(new ActionHistory(2,l2,formattedDate));

                    }
                }
                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                }
            });

            client.subscribe(topic1);
            client.subscribe(topic2);
            System.out.println("Subscribed to topic: " + topic1);
            System.out.println("Subscribed to topic: " + topic2);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}

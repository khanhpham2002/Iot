package com.example.Iot_spring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "actiohistory")
public class ActionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    public ActionHistory( int idled, int stateled, String tght) {
        this.idled = idled;
        this.stateled = stateled;
        this.tght = tght;
    }

    @Column(name = "idled")
    private int idled;


    @Column(name = "stateled")
    private int stateled;


    @Column(name = "tght")
    private String tght;
}

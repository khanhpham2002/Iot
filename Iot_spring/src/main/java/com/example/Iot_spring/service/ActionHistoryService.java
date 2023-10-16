package com.example.Iot_spring.service;

import com.example.Iot_spring.model.ActionHistory;
import com.example.Iot_spring.repository.IActionHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActionHistoryService {
    @Autowired
    private IActionHistory actionHistory;

    public List<ActionHistory> getAllActions() {
        return actionHistory.findAll();
    }
    public ActionHistory saveAction(ActionHistory res) {
        return actionHistory.save(res);
    }
}

package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;


import com.project.CTDT.entity.TrainingCycle;
import com.project.CTDT.service.TrainingCycleService;

@RestController
@RequestMapping("/api/training-cycles")
@CrossOrigin
public class TrainingCycleController {

    @Autowired
    private TrainingCycleService trainingCycleService;

    // Lấy danh sách tất cả training cycles
    @GetMapping
    public ResponseEntity<List<TrainingCycle>> getAllTrainingCycles() {
        List<TrainingCycle> trainingCycles = trainingCycleService.getAllTrainingCycles();
        if (trainingCycles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(trainingCycles);
    }

    // Lấy 1 training cycle theo id
    @GetMapping("/detail/{id}")
    public ResponseEntity<TrainingCycle> getTrainingCycleById(@PathVariable Integer id) {
        TrainingCycle trainingCycle = trainingCycleService.getTrainingCycleById(id);
        if (trainingCycle == null) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        return ResponseEntity.ok(trainingCycle);
    }

    // Tạo mới training cycle
	@PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TrainingCycle> createTrainingCycle(@RequestBody TrainingCycle trainingCycle) {
	    TrainingCycle created = trainingCycleService.saveTrainingCycle(trainingCycle);
	    return ResponseEntity.status(201).body(created);
	}

    // Cập nhật training cycle
    @PutMapping("/update/{id}")
    public ResponseEntity<TrainingCycle> updateTrainingCycle(@PathVariable Integer id, @RequestBody TrainingCycle trainingCycle) {
        TrainingCycle existingCycle = trainingCycleService.getTrainingCycleById(id);
        if (existingCycle == null) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        trainingCycle.setId(id); // Cập nhật id trước khi lưu
        TrainingCycle updated = trainingCycleService.saveTrainingCycle(trainingCycle);
        return ResponseEntity.ok(updated);
    }

    // Xoá training cycle
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTrainingCycle(@PathVariable Integer id) {
        TrainingCycle existingCycle = trainingCycleService.getTrainingCycleById(id);
        if (existingCycle == null) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy
        }
        trainingCycleService.deleteTrainingCycle(id);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content sau khi xoá
    }
}

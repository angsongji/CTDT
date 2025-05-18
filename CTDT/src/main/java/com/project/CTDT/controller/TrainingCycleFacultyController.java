package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;

import com.project.CTDT.entity.TrainingCycleFaculty;
import com.project.CTDT.service.TrainingCycleFacultyService;

@RestController
@RequestMapping("/api/training-cycles-faculty")
@CrossOrigin
public class TrainingCycleFacultyController {

    @Autowired
    private TrainingCycleFacultyService trainingCycleFacultyService;

    // Lấy danh sách tất cả TrainingCycleFaculty
    @GetMapping
    public ResponseEntity<List<TrainingCycleFaculty>> getAllTrainingCycleFaculties() {
        List<TrainingCycleFaculty> faculties = trainingCycleFacultyService.getAllTrainingCycleFaculties();
        if (faculties.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(faculties);
    }

    // Lấy 1 TrainingCycleFaculty theo id
    @GetMapping("/detail/{id}")
    public ResponseEntity<TrainingCycleFaculty> getTrainingCycleFacultyById(@PathVariable Integer id) {
        TrainingCycleFaculty faculty = trainingCycleFacultyService.getTrainingCycleFacultyById(id);
        if (faculty == null) {
            return ResponseEntity.notFound().build(); // 404 nếu không tìm thấy
        }
        return ResponseEntity.ok(faculty);
    }

    // Tạo mới TrainingCycleFaculty
    @PostMapping("/create")
    public TrainingCycleFaculty createTrainingCycleFaculty(@RequestBody TrainingCycleFaculty faculty) {
        return trainingCycleFacultyService.saveTrainingCycleFaculty(faculty);
    }

    // Cập nhật TrainingCycleFaculty
    @PatchMapping("/edit/{id}")
    public ResponseEntity<?> updateTrainingCycleFaculty(
            @PathVariable Integer id,
            @RequestBody TrainingCycleFaculty updatedFaculty) {

        TrainingCycleFaculty existing = trainingCycleFacultyService.getTrainingCycleFacultyById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setFaculty(updatedFaculty.getFaculty());
        existing.setTrainingCycle(updatedFaculty.getTrainingCycle());

        TrainingCycleFaculty saved = trainingCycleFacultyService.saveTrainingCycleFaculty(existing);
        return ResponseEntity.ok(saved);
    }

    // Xoá TrainingCycleFaculty
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTrainingCycleFaculty(@PathVariable Integer id) {
        TrainingCycleFaculty existing = trainingCycleFacultyService.getTrainingCycleFacultyById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        trainingCycleFacultyService.deleteTrainingCycleFaculty(id);
        return ResponseEntity.noContent().build();
    }
}

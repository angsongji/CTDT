package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.CTDT.entity.TeachingAssignment;
import com.project.CTDT.service.TeachingAssignmentService;

@RestController
@RequestMapping("/api/teaching-assignments")
@CrossOrigin // Cho phép gọi từ frontend
public class TeachingAssignmentController {

    @Autowired
    private TeachingAssignmentService teachingAssignmentService;

    @GetMapping
    public List<TeachingAssignment> getAllTeachingAssignments() {
        return teachingAssignmentService.getAllTeachingAssignments();
    }

    @GetMapping("detail/{id}")
    public TeachingAssignment getTeachingAssignmentById(@PathVariable Integer id) {
        return teachingAssignmentService.getTeachingAssignmentById(id);
    }

    @PostMapping("/create")
    public TeachingAssignment createTeachingAssignment(@RequestBody TeachingAssignment teachingAssignment) {
        return teachingAssignmentService.saveTeachingAssignment(teachingAssignment);
    }

    @PutMapping("edit/{id}")
    public TeachingAssignment updateTeachingAssignment(@PathVariable Integer id, @RequestBody TeachingAssignment teachingAssignment) {
        teachingAssignment.setId(id);
        return teachingAssignmentService.saveTeachingAssignment(teachingAssignment);
    }

    @DeleteMapping("del/{id}")
    public void deleteTeachingAssignment(@PathVariable Integer id) {
        teachingAssignmentService.deleteTeachingAssignment(id);
    }
}

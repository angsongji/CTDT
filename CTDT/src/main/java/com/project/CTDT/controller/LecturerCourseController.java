package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.CTDT.entity.LecturerCourse;
import com.project.CTDT.service.LecturerCourseService;

@RestController
@RequestMapping("/api/lecturer-courses")
@CrossOrigin // Cho phép gọi từ frontend
public class LecturerCourseController {

    @Autowired
    private LecturerCourseService lecturerCourseService;

    @GetMapping
    public List<LecturerCourse> getAllLecturerCourses() {
        return lecturerCourseService.getAllLecturerCourses();
    }

    @GetMapping("/{id}")
    public LecturerCourse getLecturerCourseById(@PathVariable Integer id) {
        return lecturerCourseService.getLecturerCourseById(id);
    }

    @PostMapping
    public LecturerCourse createLecturerCourse(@RequestBody LecturerCourse lecturerCourse) {
        return lecturerCourseService.saveLecturerCourse(lecturerCourse);
    }

    @PutMapping("/{id}")
    public LecturerCourse updateLecturerCourse(@PathVariable Integer id, @RequestBody LecturerCourse lecturerCourse) {
        lecturerCourse.setId(id);
        return lecturerCourseService.saveLecturerCourse(lecturerCourse);
    }

    @DeleteMapping("/{id}")
    public void deleteLecturerCourse(@PathVariable Integer id) {
        lecturerCourseService.deleteLecturerCourse(id);
    }
}

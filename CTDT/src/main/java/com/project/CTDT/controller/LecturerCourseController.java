package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public List<LecturerCourse> createLecturerCourse(@RequestBody List<LecturerCourse> lecturerCourses) {
		return lecturerCourseService.saveAll(lecturerCourses); // lưu toàn bộ
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

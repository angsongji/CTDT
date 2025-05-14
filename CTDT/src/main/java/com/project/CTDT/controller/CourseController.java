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

import com.project.CTDT.entity.Course;
import com.project.CTDT.service.CourseService;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

	@Autowired
	private CourseService courseService;

	@GetMapping
	public List<Course> getAllCourses() {
		return courseService.getAllCourses();
	}

	@GetMapping("/{id}")
	public Course getCourseById(@PathVariable Integer id) {
		return courseService.getCourseById(id);
	}

	@PostMapping
	public Course createCourse(@RequestBody Course course) {
		return courseService.saveCourse(course);
	}

	@PutMapping("/{id}")
	public Course updateCourse(@PathVariable Integer id, @RequestBody Course course) {
		course.setId(id);
		return courseService.saveCourse(course);
	}

	@DeleteMapping("/{id}")
	public void deleteCourse(@PathVariable Integer id) {
		courseService.deleteCourse(id);
	}

}

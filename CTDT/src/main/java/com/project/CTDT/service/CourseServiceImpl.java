package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.Course;
import com.project.CTDT.repository.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

	private final CourseRepository courseRepository;

	public CourseServiceImpl(CourseRepository courseRepository) {
		this.courseRepository = courseRepository;
	}

	@Override
	public List<Course> getAllCourses() {
		return courseRepository.findAll();
	}

	@Override
	public Course getCourseById(Integer id) {
		Optional<Course> optional = courseRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("Course not found with id " + id));
	}

	@Override
	public Course saveCourse(Course course) {
		return courseRepository.save(course);
	}

	@Override
	public void deleteCourse(Integer id) {
		courseRepository.deleteById(id);
	}
}

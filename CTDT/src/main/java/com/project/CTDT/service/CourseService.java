package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.Course;

public interface CourseService {
	List<Course> getAllCourses();

	Course getCourseById(Integer id);

	Course saveCourse(Course course);

	void deleteCourse(Integer id);

	List<Course> getByLecturerId(Integer idLecturer);

}

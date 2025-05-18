package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.LecturerCourse;

public interface LecturerCourseService {
	List<LecturerCourse> getAllLecturerCourses();

	LecturerCourse getLecturerCourseById(Integer id);

	LecturerCourse saveLecturerCourse(LecturerCourse lecturerCourse);

	void deleteLecturerCourse(Integer id);

	List<LecturerCourse> saveAll(List<LecturerCourse> list);

	void deleteAll(List<LecturerCourse> lecturerCourses);

}

package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.LecturerCourse;
import com.project.CTDT.repository.LecturerCourseRepository;

@Service
public class LecturerCourseServiceImpl implements LecturerCourseService {

	private final LecturerCourseRepository lecturerCourseRepository;

	// Constructor injection
	public LecturerCourseServiceImpl(LecturerCourseRepository lecturerCourseRepository) {
		this.lecturerCourseRepository = lecturerCourseRepository;
	}

	@Override
	public List<LecturerCourse> getAllLecturerCourses() {
		return lecturerCourseRepository.findAll();
	}

	@Override
	public LecturerCourse getLecturerCourseById(Integer id) {
		Optional<LecturerCourse> optional = lecturerCourseRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("LecturerCourse not found with id " + id));
	}

	@Override
	public LecturerCourse saveLecturerCourse(LecturerCourse lecturerCourse) {
		return lecturerCourseRepository.save(lecturerCourse);
	}

	@Override
	public void deleteLecturerCourse(Integer id) {
		lecturerCourseRepository.deleteById(id);
	}

	@Override
	public List<LecturerCourse> saveAll(List<LecturerCourse> list) {
		return lecturerCourseRepository.saveAll(list);
	}

	@Override
	public List<LecturerCourse> findByCourse_Id(Integer courseId) {
		return lecturerCourseRepository.findByCourse_Id(courseId);
	}
}

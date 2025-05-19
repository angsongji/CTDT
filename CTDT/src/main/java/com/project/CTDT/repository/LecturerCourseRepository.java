package com.project.CTDT.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.CTDT.entity.LecturerCourse;
import java.util.List;

public interface LecturerCourseRepository extends JpaRepository<LecturerCourse, Integer> {
	List<LecturerCourse> findByCourse_Id(Integer courseId);
}

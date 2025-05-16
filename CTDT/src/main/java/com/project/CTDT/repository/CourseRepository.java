package com.project.CTDT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.CTDT.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	@Query("SELECT lc.course FROM LecturerCourse lc WHERE lc.lecturer.id = :lecturerId")
	List<Course> getByLecturerId(@Param("lecturerId") Integer lecturerId);
}

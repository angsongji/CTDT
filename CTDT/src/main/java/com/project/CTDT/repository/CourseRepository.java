package com.project.CTDT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.CTDT.entity.Course;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

	List<Course> findByParentId(Integer parentId);
	
	// Lấy danh sách Course có status = 1
	List<Course> findByStatus(Integer status);

	@Query("SELECT lc.course FROM LecturerCourse lc WHERE lc.lecturer.id = :lecturerId")
	List<Course> getByLecturerId(@Param("lecturerId") Integer lecturerId);

}

package com.project.CTDT.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.CTDT.entity.Course;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findByParentId(Integer parentId);
	
	// Lấy danh sách Course có status = 1
	List<Course> findByStatus(Integer status);
}

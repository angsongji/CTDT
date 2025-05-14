package com.project.CTDT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.CTDT.entity.CourseOutline;

public interface CourseOutlineRepository extends JpaRepository<CourseOutline, Integer> {

    // Lấy danh sách CourseOutline theo id_course
	List<CourseOutline> findByCourseIdAndStatus(Integer courseId, Integer status);

    // Xóa tất cả CourseOutline theo id_course
    void deleteByCourseId(Integer courseId);
    
 // Lấy danh sách CourseOutline có status = 1
 	List<CourseOutline> findByStatus(Integer status);
 	
 // Tìm tất cả các CourseOutline có parent.id = idParent
    List<CourseOutline> findByParentId(Integer idParent);
}

package com.project.CTDT.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.CTDT.entity.CourseOutline;

public interface CourseOutlineRepository extends JpaRepository<CourseOutline, Integer> {

    // Lấy danh sách CourseOutline theo id_course
    List<CourseOutline> findByCourseId(Integer courseId);

    // Xóa tất cả CourseOutline theo id_course
    void deleteByCourseId(Integer courseId);
}

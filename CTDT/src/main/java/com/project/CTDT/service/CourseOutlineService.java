package com.project.CTDT.service;

import java.util.List;
import com.project.CTDT.entity.CourseOutline;

public interface CourseOutlineService {

    List<CourseOutline> getAllCourseOutlines(); 

    CourseOutline getCourseOutlineById(Integer id);

    List<CourseOutline> getCourseOutlinesByCourseId(Integer courseId); // lấy đề cương chi tiết theo id_course

    void deleteCourseOutlinesByCourseId(Integer courseId); // Xoá theo id_course

    CourseOutline saveCourseOutline(CourseOutline courseOutline);

    void deleteCourseOutline(Integer id); // Xoá theo id
    
    List<CourseOutline> getChildrenByParentId(Integer parentId);
}

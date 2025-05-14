package com.project.CTDT.controller;

import com.project.CTDT.entity.CourseOutline;
import com.project.CTDT.service.CourseOutlineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/course-outlines")
@CrossOrigin
public class CourseOutlineController {

    @Autowired
    private CourseOutlineService courseOutlineService;

    // Lấy tất cả course outline
    @GetMapping
    public List<CourseOutline> getAll() {
        return courseOutlineService.getAllCourseOutlines();
    }

    // Lấy course outline theo id
    @GetMapping("/{id}")
    public CourseOutline getById(@PathVariable Integer id) {
        return courseOutlineService.getCourseOutlineById(id);
    }

    // Lấy danh sách course outline theo id_course
    @GetMapping("/course/{courseId}")
    public List<CourseOutline> getByCourseId(@PathVariable Integer courseId) {
        return courseOutlineService.getCourseOutlinesByCourseId(courseId);
    }

    // Thêm mới course outline
    @PostMapping
    public CourseOutline createCourseOutline(@RequestBody CourseOutline courseOutline) {
        return courseOutlineService.saveCourseOutline(courseOutline);
    }

    // Cập nhật course outline
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourseOutline(@PathVariable Integer id, @RequestBody CourseOutline updated) {
        CourseOutline existing = courseOutlineService.getCourseOutlineById(id);

        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        // Chỉ cập nhật các trường cho phép
        existing.setAssessmentUnit(updated.getAssessmentUnit());
        existing.setComponentScore(updated.getComponentScore());
        existing.setAssessmentMethod(updated.getAssessmentMethod());
        existing.setWeight(updated.getWeight());
        existing.setStatus(updated.getStatus());

        CourseOutline saved = courseOutlineService.saveCourseOutline(existing);
        return ResponseEntity.ok(saved);
    }

    // Xoá 1 course outline theo id
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        CourseOutline outline = courseOutlineService.getCourseOutlineById(id);
        outline.setStatus(0);
        courseOutlineService.saveCourseOutline(outline);
    }

    // Xoá tất cả course outline theo id_course
    @DeleteMapping("/course/{courseId}")
    public void deleteByCourseId(@PathVariable Integer courseId) {
        List<CourseOutline> list = courseOutlineService.getCourseOutlinesByCourseId(courseId);
        for (CourseOutline outline : list) {
            outline.setStatus(0);
            courseOutlineService.saveCourseOutline(outline);
        }
    }
}

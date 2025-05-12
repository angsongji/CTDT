package com.project.CTDT.controller;

import com.project.CTDT.entity.CourseOutline;
import com.project.CTDT.service.CourseOutlineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-outlines")
@CrossOrigin
public class CourseOutlineController {

    private static final Logger logger = LoggerFactory.getLogger(CourseOutlineController.class);
    private final CourseOutlineService courseOutlineService;

    public CourseOutlineController(CourseOutlineService courseOutlineService) {
        this.courseOutlineService = courseOutlineService;
    }

    // Lấy tất cả course outline
    @GetMapping
    public List<CourseOutline> getAll() {
        List<CourseOutline> outlines = courseOutlineService.getAllCourseOutlines();
        logger.info("Returning {} course outlines", outlines.size());
        outlines.forEach(outline -> {
            logger.info("CourseOutline: id={}, assessmentUnit={}, componentScore={}, assessmentMethod={}, weight={}, status={}",
                outline.getId(),
                outline.getAssessmentUnit(),
                outline.getComponentScore(),
                outline.getAssessmentMethod(),
                outline.getWeight(),
                outline.getStatus()
            );
        });
        return outlines;
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
    public CourseOutline create(@RequestBody CourseOutline courseOutline) {
        return courseOutlineService.saveCourseOutline(courseOutline);
    }

    // Cập nhật course outline
    @PatchMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8"})
    public ResponseEntity<CourseOutline> update(@PathVariable Integer id, @RequestBody CourseOutline updated) {
        try {
            CourseOutline existing = courseOutlineService.getCourseOutlineById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            // Cập nhật các trường nếu không null
            if (updated.getAssessmentUnit() != null) {
                existing.setAssessmentUnit(updated.getAssessmentUnit());
            }
            if (updated.getComponentScore() != null) {
                existing.setComponentScore(updated.getComponentScore());
            }
            if (updated.getWeight() != null) {
                existing.setWeight(updated.getWeight());
            }
            if (updated.getAssessmentMethod() != null) {
                existing.setAssessmentMethod(updated.getAssessmentMethod());
            }
            if (updated.getStatus() != null) {
                existing.setStatus(updated.getStatus());
            }
            if (updated.getCourse() != null && updated.getCourse().getId() != null) {
                existing.setCourse(updated.getCourse());
            }
            if (updated.getParent() != null && updated.getParent().getId() != null) {
                existing.setParent(updated.getParent());
            }

            CourseOutline saved = courseOutlineService.saveCourseOutline(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            logger.error("Error updating course outline: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Xoá 1 course outline theo id
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        courseOutlineService.deleteCourseOutline(id);
    }

    // Xoá tất cả course outline theo id_course
    @DeleteMapping("/course/{courseId}")
    public void deleteByCourseId(@PathVariable Integer courseId) {
        courseOutlineService.deleteCourseOutlinesByCourseId(courseId);
    }
}

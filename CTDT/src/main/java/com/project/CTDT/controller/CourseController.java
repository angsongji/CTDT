package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Collections;


import com.project.CTDT.entity.Course;
import com.project.CTDT.service.CourseService;
import com.project.CTDT.entity.KnowledgeAreas;
import com.project.CTDT.service.KnowledgeAreasService;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

	@Autowired
	private CourseService courseService;

	@Autowired
	private KnowledgeAreasService knowledgeAreasService;

	@GetMapping
	public List<Course> getAllCourses() {
		return courseService.getAllCourses();
	}

	@GetMapping("/{id}")
	public Course getCourseById(@PathVariable Integer id) {
		return courseService.getCourseById(id);
	}

	@PostMapping
	public Course createCourse(@RequestBody Course course) {
		return courseService.saveCourse(course);
	}

	@PutMapping("/{id}")
	public Course updateCourse(@PathVariable Integer id, @RequestBody Course courseRequest) {
		Course existing = courseService.getCourseById(id);
		if (existing == null) {
			throw new RuntimeException("Course not found");
		}

		// Cập nhật các trường cơ bản
		existing.setName(courseRequest.getName());
		existing.setCredits(courseRequest.getCredits());
		existing.setLectureHours(courseRequest.getLectureHours());
		existing.setPracticeHours(courseRequest.getPracticeHours());
		existing.setInternshipHours(courseRequest.getInternshipHours());
		existing.setWeightingFactor(courseRequest.getWeightingFactor());
		existing.setRequirement(courseRequest.getRequirement());
		existing.setStatus(courseRequest.getStatus());

		// Gán lại KnowledgeAreas nếu có
		if (courseRequest.getKnowledgeAreas() != null && courseRequest.getKnowledgeAreas().getId() != null) {
			KnowledgeAreas k = knowledgeAreasService.getKnowledgeAreasById(courseRequest.getKnowledgeAreas().getId());
			if (k == null) {
				throw new RuntimeException("KnowledgeArea not found");
			}
			existing.setKnowledgeAreas(k);
		} else {
			existing.setKnowledgeAreas(null);
		}

		// Gán lại parent nếu có
		if (courseRequest.getParent() != null && courseRequest.getParent().getId() != null) {
			Course parent = courseService.getCourseById(courseRequest.getParent().getId());
			if (parent == null) {
				throw new RuntimeException("Parent course not found");
			}
			existing.setParent(parent);
		} else {
			existing.setParent(null);
		}

		return courseService.saveCourse(existing);
	}

	@PutMapping("/soft-delete/{id}")
	public ResponseEntity<?> deleteCourse(@PathVariable Integer id) {
	    Course parentCourse = courseService.getCourseById(id);
	    if (parentCourse == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(Collections.singletonMap("message", "Course not found"));
	    }

	    // Lấy danh sách course con
	    List<Course> childCourses = courseService.getCoursesByParentId(id);

	    // Cập nhật status course con
	    for (Course child : childCourses) {
	        child.setStatus(0);
	        courseService.saveCourse(child);
	    }

	    // Cập nhật status của parent
	    parentCourse.setStatus(0); // hoặc 0 nếu bạn dùng 0 là soft delete
	    courseService.saveCourse(parentCourse);

	    //Trả về phản hồi JSON
	    return ResponseEntity.ok(Collections.singletonMap("message", "Xóa mềm thành công"));
	}

}

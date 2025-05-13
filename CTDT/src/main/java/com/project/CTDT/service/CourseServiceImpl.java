package com.project.CTDT.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.Course;
import com.project.CTDT.repository.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

	private final CourseRepository courseRepository;

	public CourseServiceImpl(CourseRepository courseRepository) {
		this.courseRepository = courseRepository;
	}

	@Override
	public List<Course> getAllCourses() {
		return courseRepository.findAll();
	}

	@Override
	public Course getCourseById(Integer id) {
		Optional<Course> optional = courseRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("Course not found with id " + id));
	}

	@Override
	public Course saveCourse(Course course) {
		return courseRepository.save(course);
	}

	@Override
	public void deleteCourse(Integer id) {
		courseRepository.deleteById(id);
	}

	@Override
	public boolean isKnowledgeAreaReferenced(Integer knowledgeAreaId) {
		// Lấy danh sách tất cả ID con (bao gồm cả knowledgeAreaId)
		List<Integer> allRelatedIds = getAllChildKnowledgeAreaIds(knowledgeAreaId);
		allRelatedIds.add(knowledgeAreaId); // Thêm chính ID cha vào

		// Lấy tất cả các courses
		List<Course> courses = courseRepository.findAll();

		// Kiểm tra xem có course nào tham chiếu đến bất kỳ id nào trong danh sách không
		return courses.stream().anyMatch(course -> course.getKnowledgeArea() != null
				&& allRelatedIds.contains(course.getKnowledgeArea().getId()));
	}

	private List<Integer> getAllChildKnowledgeAreaIds(Integer parentId) {
		List<Integer> result = new ArrayList<>();
		List<KnowledgeArea> children = knowledgeAreaRepository.findByParentId(parentId);

		for (KnowledgeArea child : children) {
			result.add(child.getId());
			result.addAll(getAllChildKnowledgeAreaIds(child.getId())); // đệ quy để lấy con của con
		}

		return result;
	}

}

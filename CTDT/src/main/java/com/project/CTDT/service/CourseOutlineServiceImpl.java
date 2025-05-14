package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.project.CTDT.entity.CourseOutline;
import com.project.CTDT.repository.CourseOutlineRepository;

@Service
public class CourseOutlineServiceImpl implements CourseOutlineService {

    @Autowired
    private CourseOutlineRepository courseOutlineRepository;

    public CourseOutlineServiceImpl(CourseOutlineRepository courseOutlineRepository) {
        this.courseOutlineRepository = courseOutlineRepository;
    }

    @Override
    public List<CourseOutline> getAllCourseOutlines() {
        return courseOutlineRepository.findByStatus(1);
    }

    @Override
    public CourseOutline getCourseOutlineById(Integer id) {
        return courseOutlineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("CourseOutline not found with id " + id));
    }

    @Override
    public List<CourseOutline> getCourseOutlinesByCourseId(Integer courseId) {
    	return courseOutlineRepository.findByCourseIdAndStatus(courseId, 1);
    }

    @Override
    public void deleteCourseOutlinesByCourseId(Integer courseId) {
        courseOutlineRepository.deleteByCourseId(courseId);
    }

    @Override
    public CourseOutline saveCourseOutline(CourseOutline courseOutline) {
        return courseOutlineRepository.save(courseOutline);
    }

    @Override
    public void deleteCourseOutline(Integer id) {
        courseOutlineRepository.deleteById(id);
    }
    
	@Override
	public List<CourseOutline> getChildrenByParentId(Integer parentId) {
	    return courseOutlineRepository.findByParentId(parentId);
	}
}

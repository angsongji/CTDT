package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.CourseOutline;
import com.project.CTDT.repository.CourseOutlineRepository;

@Service
public class CourseOutlineServiceImpl implements CourseOutlineService {

    private final CourseOutlineRepository courseOutlineRepository;

    public CourseOutlineServiceImpl(CourseOutlineRepository courseOutlineRepository) {
        this.courseOutlineRepository = courseOutlineRepository;
    }

    @Override
    public List<CourseOutline> getAllCourseOutlines() {
        return courseOutlineRepository.findAll();
    }

    @Override
    public CourseOutline getCourseOutlineById(Integer id) {
        return courseOutlineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("CourseOutline not found with id " + id));
    }

    @Override
    public List<CourseOutline> getCourseOutlinesByCourseId(Integer courseId) {
        return courseOutlineRepository.findByCourseId(courseId);
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
}

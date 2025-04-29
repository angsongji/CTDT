package com.project.CTDT.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.CTDT.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
}

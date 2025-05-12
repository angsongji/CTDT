package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.TeachingAssignment;

public interface TeachingAssignmentService {
	List<TeachingAssignment> getAllTeachingAssignments();

	TeachingAssignment getTeachingAssignmentById(Integer id);

	TeachingAssignment saveTeachingAssignment(TeachingAssignment teachingAssignment);

	void deleteTeachingAssignment(Integer id);
}

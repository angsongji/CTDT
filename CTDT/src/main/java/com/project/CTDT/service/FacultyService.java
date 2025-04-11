package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.Faculty;

public interface FacultyService {
	List<Faculty> getAllFaculties();

	Faculty getFacultyById(Integer id);

	Faculty saveFaculty(Faculty faculty);

	void deleteFaculty(Integer id);
}

package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.Lecturer;

public interface LecturerService {
	List<Lecturer> getAllLecturers();

	Lecturer getLecturerById(Integer id);

	Lecturer saveLecturer(Lecturer lecturer);

	void deleteLecturer(Integer id);

	List<Lecturer> saveAll(List<Lecturer> list);
}

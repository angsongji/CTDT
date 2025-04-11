package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.Faculty;
import com.project.CTDT.repository.FacultyRepository;

@Service
public class FacultyServiceImpl implements FacultyService {

	private final FacultyRepository facultyRepository;

	public FacultyServiceImpl(FacultyRepository facultyRepository) {
		this.facultyRepository = facultyRepository;
	}

	@Override
	public List<Faculty> getAllFaculties() {
		return facultyRepository.findAll();
	}

	@Override
	public Faculty getFacultyById(Integer id) {
		Optional<Faculty> optional = facultyRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("Faculty not found with id " + id));
	}

	@Override
	public Faculty saveFaculty(Faculty faculty) {
		return facultyRepository.save(faculty);
	}

	@Override
	public void deleteFaculty(Integer id) {
		facultyRepository.deleteById(id);
	}
}

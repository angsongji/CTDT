package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.Lecturer;
import com.project.CTDT.repository.LecturerRepository;

@Service
public class LecturerServiceImpl implements LecturerService {

	private final LecturerRepository lecturerRepository;

	public LecturerServiceImpl(LecturerRepository lecturerRepository) {
		this.lecturerRepository = lecturerRepository;
	}

	@Override
	public List<Lecturer> getAllLecturers() {
		return lecturerRepository.findAll();
	}

	@Override
	public Lecturer getLecturerById(Integer id) {
		Optional<Lecturer> optional = lecturerRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("Lecturer not found with id " + id));
	}

	@Override
	public Lecturer saveLecturer(Lecturer lecturer) {
		return lecturerRepository.save(lecturer);
	}

	@Override
	public void deleteLecturer(Integer id) {
		lecturerRepository.deleteById(id);
	}
}

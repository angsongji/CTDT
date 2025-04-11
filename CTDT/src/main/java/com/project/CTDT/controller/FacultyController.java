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

import com.project.CTDT.entity.Faculty;
import com.project.CTDT.service.FacultyService;

@RestController
@RequestMapping("/api/faculties")
@CrossOrigin // Cho phép gọi từ frontend
public class FacultyController {

	@Autowired
	private FacultyService facultyService;

	@GetMapping
	public List<Faculty> getAllFaculties() {
		return facultyService.getAllFaculties();
	}

	@GetMapping("/{id}")
	public Faculty getFacultyById(@PathVariable Integer id) {
		return facultyService.getFacultyById(id);
	}

	@PostMapping
	public Faculty createFaculty(@RequestBody Faculty faculty) {
		return facultyService.saveFaculty(faculty);
	}

	@PutMapping("/{id}")
	public Faculty updateFaculty(@PathVariable Integer id, @RequestBody Faculty faculty) {
		faculty.setId(id);
		return facultyService.saveFaculty(faculty);
	}

	@DeleteMapping("/{id}")
	public void deleteFaculty(@PathVariable Integer id) {
		facultyService.deleteFaculty(id);
	}
}

package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.CTDT.entity.Lecturer;
import com.project.CTDT.service.LecturerService;

@RestController
@RequestMapping("/api/lecturers")
@CrossOrigin // Cho phép gọi từ frontend
public class LecturerController {

	@Autowired
	private LecturerService lecturerService;

	// Lấy danh sách tất cả giảng viên
	@GetMapping
	public List<Lecturer> getAllLecturers() {
		return lecturerService.getAllLecturers();
	}

	// Lấy giảng viên theo ID
	@GetMapping("/{id}")
	public Lecturer getLecturerById(@PathVariable Integer id) {
		return lecturerService.getLecturerById(id);
	}

	// Tạo mới giảng viên
	@PostMapping
	public Lecturer createLecturer(@RequestBody Lecturer lecturer) {
		return lecturerService.saveLecturer(lecturer);
	}

	// Cập nhật thông tin giảng viên
	@PutMapping("/{id}")
	public Lecturer updateLecturer(@PathVariable Integer id, @RequestBody Lecturer lecturer) {
		lecturer.setId(id); // Đảm bảo đúng ID khi cập nhật
		return lecturerService.saveLecturer(lecturer);
	}

	// Xóa giảng viên theo ID
	@DeleteMapping("/{id}")
	public void deleteLecturer(@PathVariable Integer id) {
		lecturerService.deleteLecturer(id);
	}
}

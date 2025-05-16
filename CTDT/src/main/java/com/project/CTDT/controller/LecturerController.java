package com.project.CTDT.controller;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
		List<Lecturer> list = lecturerService.getAllLecturers();
		Iterator<Lecturer> iterator = list.iterator();

		while (iterator.hasNext()) {
			Lecturer lecturer = iterator.next();
			if (lecturer.getStatus() == 0) {
				iterator.remove(); // Xóa phần tử nếu là status = 0
			}
		}
		return list;
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

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteLecturer(@PathVariable Integer id) {
		try {
			lecturerService.deleteLecturer(id);
			return ResponseEntity.ok().build();
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
}

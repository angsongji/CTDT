package com.project.CTDT.entity;

import java.util.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Lecturer")
public class Lecturer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "fullName", nullable = false, length = 255)
	private String fullName;

	@Column(name = "dateOfBirth", nullable = false)
	@Temporal(value = TemporalType.DATE)
	private Date dateOfBirth;

	@Column(name = "academicTitle", nullable = false, length = 255)
	private String academicTitle;

	@Column(name = "degree", nullable = false, length = 255)
	private String degree;

	@Column(name = "status")
	private Integer status = 1;

	@OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "lecturer-lecturerCourses")
	private Set<LecturerCourse> lecturerCourses;
	// cascade = CascadeType.ALL : Khi bạn xóa một phần tử LecturerCourse khỏi danh
	// sách lecturerCourses, thì Hibernate sẽ tự động xóa record đó khỏi database.

	@OneToMany(mappedBy = "lecturer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference(value = "lecturer-teachingAssignments")
	private Set<TeachingAssignment> TeachingAssignments;

}

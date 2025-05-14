package com.project.CTDT.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "faculty")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Faculty {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "website", nullable = true, length = 255)
	private String website;

	// Mối quan hệ 1-N với TrainingCycleFaculty
	@OneToMany(mappedBy = "faculty", fetch = FetchType.LAZY)
	@JsonManagedReference(value = "trainingCycleFaculty-faculty")
	private Set<TrainingCycleFaculty> trainingCycleFacultyList;
	// cascade = CascadeType.ALL : Khi bạn xóa một phần tử LecturerCourse khỏi danh
	// sách lecturerCourses, thì Hibernate sẽ tự động xóa record đó khỏi database.

//	@ManyToOne(fetch = FetchType.EAGER)
//	@JoinColumn(name = "TrainingCycle_Id", nullable = false, foreignKey = @ForeignKey(name = "fk_Faculty_TrainingCycle"))
//	@JsonBackReference(value = "trainingCycle-faculty") // Đúng khi Faculty là "nhiều" và TrainingCycle là "một"
//	private TrainingCycle trainingCycle;
}

package com.project.CTDT.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "general_information")
public class GeneralInformation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "level", nullable = false, length = 255)
	private String level;

	@Column(name = "degreeType", nullable = false, length = 255)
	private String degreeType;

	@Column(name = "modeOfEducation", nullable = false, length = 255)
	private String modeOfEducation;

	@Column(name = "duration", nullable = false)
	private Double duration;

	@Column(name = "language", nullable = false, length = 255)
	private String language;

	@Column(name = "issued", nullable = false, length = 255)
	private String issued;

	@Column(name = "status")
	private Integer status = 1;

	// Quan hệ 1-1 với bảng trung gian TrainingCycleFaculty
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "training_cycle_faculty_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_general_info_training_cycle_faculty"))
	@JsonBackReference(value = "trainingCycleFaculty-generalInformation")
	private TrainingCycleFaculty trainingCycleFaculty;

	// Mối quan hệ 1-N với TeachingPlan
//	@OneToMany(mappedBy = "generalInformation") // cái infor có liên kết với teaching plan thì sẽ error không xóa được
	@OneToMany(mappedBy = "generalInformation", cascade = CascadeType.ALL, orphanRemoval = true) // xóa infor sẽ xóa
																									// toàn bộ teaching
																									// plan liên quan
	@JsonIgnore
	private Set<TeachingPlan> teachingPlans = new HashSet<>();
}

package com.project.CTDT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;
import java.util.HashSet;
import com.project.CTDT.entity.TeachingPlan;
import jakarta.persistence.*;



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

	// Mối quan hệ N-1 với Faculty
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty_Id", nullable = false, foreignKey = @ForeignKey(name = "fk_Faculty_GeneralInformation"))
	@JsonBackReference(value = "faculty-generalInformation")
	private Faculty faculty;

	// Mối quan hệ 1-1 với CurriculumFramework
	@OneToOne(fetch = FetchType.LAZY, mappedBy = "generalInformation", cascade = CascadeType.ALL)
	@JsonManagedReference(value = "generalInformation-curriculumFramework")
	private CurriculumFramework curriculumFramework;

	// Mối quan hệ 1-N với TeachingPlan
	@OneToMany(mappedBy = "generalInformation", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<TeachingPlan> teachingPlans = new HashSet<>();	
}

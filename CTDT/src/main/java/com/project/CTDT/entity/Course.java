package com.project.CTDT.entity;

import java.util.HashSet;
import java.util.Set;

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
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "course")
public class Course {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "credits", nullable = false)
	private Integer credits;

	@Column(name = "lectureHours", nullable = false)
	private Integer lectureHours;

	@Column(name = "practiceHours", nullable = false)
	private Integer practiceHours;

	@Column(name = "internshipHours", nullable = false)
	private Integer internshipHours;

	@Column(name = "weightingFactor", nullable = false)
	private Double weightingFactor;

	@Column(name = "requirement ", nullable = false)
	private Integer requirement = 1; // Default = 1 la tu chon bat buoc

	@Column(name = "status", nullable = false)
	private Integer status = 1; // Default = 1

	// Mối quan hệ phản thân với Course (Mối học phần yêu cầu các học phần trước):
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_course_parent"), nullable = true)
	@JsonBackReference
	private Course parent;

	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private Set<Course> children = new HashSet<>();

	// Mối quan hệ 1-N với LecturerCourse
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "lecturerCourses-course")
	private Set<LecturerCourse> lecturerCourses;

	// Mối quan hệ N-1 với KnowledgeAreas
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "knowledgeAreas_Id", nullable = false, foreignKey = @ForeignKey(name = "fk_course_knowledgeAreas"))
	@JsonBackReference(value = "course-knowledgeAreas")
	private KnowledgeAreas knowledgeAreas;

	// Mối quan hệ N-N với CurriculumFramework
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "courses")
	private Set<CurriculumFramework> curriculumFrameworks = new HashSet<>();

	// Mối quan hệ 1-N với GroupOpeningPlan
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "groupPlan-course")
	private Set<GroupOpeningPlan> groupOpeningPlans = new HashSet<>();

}
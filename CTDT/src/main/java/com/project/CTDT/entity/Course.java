package com.project.CTDT.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "course")
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Course {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	@JsonProperty("name")
	private String name;

	@Column(name = "credits", nullable = false)
	@JsonProperty("credits")
	private Integer credits;

	@Column(name = "lectureHours", nullable = false)
	@JsonProperty("lectureHours")
	private Integer lectureHours;

	@Column(name = "practiceHours", nullable = false)
	@JsonProperty("practiceHours")
	private Integer practiceHours;

	@Column(name = "internshipHours", nullable = false)
	@JsonProperty("internshipHours")
	private Integer internshipHours;

	@Column(name = "weightingFactor", nullable = false)
	@JsonProperty("weightingFactor")
	private Double weightingFactor;

	@Column(name = "requirement", nullable = false)
	@JsonProperty("requirement")
	private Integer requirement = 1; // Default = 1 la tu chon bat buoc

	@Column(name = "status", nullable = false)
	@JsonProperty("status")
	private Integer status = 1; // Default = 1

	// Mối quan hệ phản thân với Course (Mối học phần yêu cầu các học phần trước):
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_course_parent"), nullable = true)
	@JsonIgnoreProperties({ "parent", "children" })
	@JsonProperty("parent")
	private Course parent;

	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnoreProperties({ "parent" })
	@JsonProperty("children")
	private Set<Course> children = new HashSet<>();

	// Mối quan hệ 1-N với LecturerCourse
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
	@JsonManagedReference(value = "lecturerCourses-course")
	@JsonIgnore
	private Set<LecturerCourse> lecturerCourses = new HashSet<>();

	// Getter để trả về Lecturer
	@JsonProperty("lecturers")
	public List<Lecturer> getLecturers() {
		if (lecturerCourses == null)
			return new ArrayList<>();
		List<Lecturer> list = new ArrayList<>();
		for (LecturerCourse l : lecturerCourses) {
			Lecturer p = l.getLecturer();
			if (p.getStatus() == 1)
				list.add(p);
		}
		return list;
	}

	// Mối quan hệ N-1 với KnowledgeAreas
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "knowledgeAreas_Id", nullable = false, foreignKey = @ForeignKey(name = "fk_course_knowledgeAreas"))
	@JsonBackReference(value = "course-knowledgeAreas")
	@JsonProperty("knowledgeAreas")
	private KnowledgeAreas knowledgeAreas;

	// Getter để trả về knowledgeAreas
	@JsonProperty("knowledgeArea")
	public KnowledgeAreas getKnowledgeArea() {
		return knowledgeAreas;
	}

	// Mối quan hệ 1-N với GroupOpeningPlan
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JsonIgnoreProperties({ "course" })
	@JsonProperty("groupOpeningPlans")
	private Set<GroupOpeningPlan> groupOpeningPlans = new HashSet<>();

	// 1-N với TeachingPlan - IGNORE để tránh vòng lặp JSON
	@OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<TeachingPlan> teachingPlans = new HashSet<>();

	// 1-N với CourseOutline - IGNORE để tránh vòng lặp JSON
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<CourseOutline> courseOutlines = new HashSet<>();

}
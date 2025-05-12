package com.project.CTDT.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
public class Course {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	@JsonProperty("id")
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

	@Column(name = "requirement ", nullable = false)
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
	@JsonIgnoreProperties({ "course" })
	@JsonProperty("lecturerCourses")
	private Set<LecturerCourse> lecturerCourses;

	// Mối quan hệ N-1 với KnowledgeAreas
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "knowledgeAreas_Id", nullable = false, foreignKey = @ForeignKey(name = "fk_course_knowledgeAreas"))
	@JsonIgnoreProperties({ "courses" })
	@JsonProperty("knowledgeAreas")
	@JsonBackReference(value = "course-knowledgeAreas")
	private KnowledgeAreas knowledgeAreas;

	// Thêm getter và setter cho knowledgeAreas
	public KnowledgeAreas getKnowledgeAreas() {
		return knowledgeAreas;
	}

	public void setKnowledgeAreas(KnowledgeAreas knowledgeAreas) {
		this.knowledgeAreas = knowledgeAreas;
	}

	// Mối quan hệ 1-N với GroupOpeningPlan
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JsonIgnoreProperties({ "course" })
	@JsonProperty("groupOpeningPlans")
	private Set<GroupOpeningPlan> groupOpeningPlans = new HashSet<>();

}
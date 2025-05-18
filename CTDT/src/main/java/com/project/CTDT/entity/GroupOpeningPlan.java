package com.project.CTDT.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "group_opening_plan")
public class GroupOpeningPlan {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "numberOfGroups", nullable = false)
	private Integer numberOfGroups;

	@Column(name = "numberOfStudents", nullable = false)
	private Integer numberOfStudents;

	@Column(name = "implementationSemester", nullable = false)
	private Integer implementationSemester;

	@Column(name = "status")
	private Integer status = 1;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "course_id", nullable = false, foreignKey = @ForeignKey(name = "fk_groupPlan_course"))
	@JsonBackReference(value = "groupPlan-course")
	private Course course;

	@OneToMany(mappedBy = "groupOpeningPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference(value = "groupPlan-groups")
	//@JsonIgnore //them de test hi
	private Set<Group> groups;

	// Quan hệ 1-1 với bảng trung gian TrainingCycleFaculty
	/*@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "training_cycle_faculty_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_group_opening_plan_training_cycle_faculty"))
	@JsonBackReference(value = "trainingCycleFaculty-group_opening_plan")
	private TrainingCycleFaculty trainingCycleFaculty;*/
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "training_cycle_faculty_id", nullable = false, foreignKey = @ForeignKey(name = "fk_group_opening_plan_training_cycle_faculty"))
	@JsonBackReference(value = "trainingCycleFaculty-group_opening_plan")
	private TrainingCycleFaculty trainingCycleFaculty;

	@JsonProperty("trainingCycleFacultyId")
	public Integer getTrainingCycleFacultyId() {
	    return trainingCycleFaculty != null ? trainingCycleFaculty.getId() : null;
	}
}
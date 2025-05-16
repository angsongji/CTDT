package com.project.CTDT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
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

@Getter
@Setter
@Entity
@Table(name = "training_cycle_faculty")
public class TrainingCycleFaculty {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "training_cycle_id", nullable = false, foreignKey = @ForeignKey(name = "fk_trainingCycle_faculty"))
	@JsonBackReference(value = "trainingCycle-trainingCycleFaculty")
	private TrainingCycle trainingCycle;

	// Getter để trả về trainingCycle
	@JsonProperty("trainingCycle")
	public TrainingCycle getTrainingCycle() {
		return trainingCycle;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty_id", nullable = false, foreignKey = @ForeignKey(name = "fk_faculty_trainingCycle"))
	@JsonBackReference(value = "trainingCycleFaculty-faculty")
	private Faculty faculty;

	// Getter để trả về faculty
	@JsonProperty("faculty")
	public Faculty getFaculty() {
		return faculty;
	}

	@OneToOne(mappedBy = "trainingCycleFaculty", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "trainingCycleFaculty-generalInformation")
	@JsonIgnore
	private GeneralInformation generalInformation;

	// Getter để trả về generalInformation có status == 1
	@JsonProperty("generalInformation")
	public GeneralInformation getGeneralInformation() {
		return generalInformation == null ? null : generalInformation.getStatus() == 1 ? generalInformation : null;
	}

	@OneToOne(mappedBy = "trainingCycleFaculty", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "trainingCycleFaculty-group_opening_plan")
	@JsonIgnore
	private GroupOpeningPlan groupOpeningPlan;

}

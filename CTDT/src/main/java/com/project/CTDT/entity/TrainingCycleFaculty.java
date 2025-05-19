package com.project.CTDT.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "faculty_id", nullable = false, foreignKey = @ForeignKey(name = "fk_faculty_trainingCycle")) 
	@JsonBackReference(value = "trainingCycleFaculty-faculty")
	private Faculty faculty;

	@OneToOne(mappedBy = "trainingCycleFaculty", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "trainingCycleFaculty-generalInformation")
	@JsonIgnore
	private GeneralInformation generalInformation;

	/*@OneToOne(mappedBy = "trainingCycleFaculty", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "trainingCycleFaculty-group_opening_plan")
	@JsonIgnore
	private GroupOpeningPlan groupOpeningPlan;*/
	
	@OneToMany(mappedBy = "trainingCycleFaculty", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@JsonManagedReference(value = "trainingCycleFaculty-group_opening_plan")
	@JsonIgnore
	private Set<GroupOpeningPlan> groupOpeningPlans;


	@JsonProperty("trainingCycleId")
	public Integer getTrainingCycleId() {
		return trainingCycle != null ? trainingCycle.getId() : null;
	}

	@JsonProperty("facultyId")
	public Integer getFacultyId() {
		return faculty != null ? faculty.getId() : null;
	}

	@JsonProperty("generalInformation")
	public GeneralInformation getFilteredGeneralInformation() {
		return generalInformation != null && generalInformation.getStatus() == 1 ? generalInformation : null;
	}
}

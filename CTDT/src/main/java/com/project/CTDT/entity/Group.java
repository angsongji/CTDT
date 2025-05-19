package com.project.CTDT.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "study_group")
public class Group {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Integer id;
	
	@Column(name = "groupNumber", nullable = false)
	private Integer groupNumber;
	
	@Column(name = "maxStudents", nullable = false)
	private Integer maxStudents;
		
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "groupOpeningPlan_id", nullable = false, foreignKey = @ForeignKey(name = "fk_group_opening_plan"))
	@JsonBackReference(value = "groupPlan-groups")
	private GroupOpeningPlan groupOpeningPlan;
	
	@OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference(value = "groups-teachingAssignments")
	private Set<TeachingAssignment> teachingAssignments;
	
}

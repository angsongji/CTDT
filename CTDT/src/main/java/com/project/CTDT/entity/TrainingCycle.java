package com.project.CTDT.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
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
@Table(name = "TrainingCycle")
public class TrainingCycle {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "startYear", nullable = false)
	private Integer startYear;

	@Column(name = "endYear", nullable = false)
	private Integer endYear;

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "trainingCycle", cascade = CascadeType.ALL)
	@JsonManagedReference(value = "trainingCycle-faculty") // Đúng khi TrainingCycle là "một" và Faculty là "nhiều"
	private Set<Faculty> faculties;
}

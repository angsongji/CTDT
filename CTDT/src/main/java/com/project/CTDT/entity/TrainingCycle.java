package com.project.CTDT.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

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
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TrainingCycle")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
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

	// Mối quan hệ 1-N với TrainingCycleFaculty
	@OneToMany(mappedBy = "trainingCycle", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
	@JsonManagedReference(value = "trainingCycle-trainingCycleFaculty")
	@JsonIgnore
	private Set<TrainingCycleFaculty> trainingCycleFacultyList = new HashSet<>();

	// Getter để trả về faculty
	@JsonProperty("faculties")
	public List<Faculty> getFaculties() {
		if (trainingCycleFacultyList == null)
			return new ArrayList<>();
		List<Faculty> list = new ArrayList<>();
		for (TrainingCycleFaculty t : trainingCycleFacultyList) {
			list.add(t.getFaculty());
		}
		return list;
	}

//		@OneToMany(fetch = FetchType.EAGER, mappedBy = "trainingCycle", cascade = CascadeType.ALL)
//		@JsonManagedReference(value = "trainingCycle-faculty") // Đúng khi TrainingCycle là "một" và Faculty là "nhiều"
//		private Set<Faculty> faculties;

}


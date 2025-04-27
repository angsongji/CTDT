package com.project.CTDT.entity;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "faculty")
public class Faculty {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	private String name;

	@Column(name = "website", nullable = true, length = 255)
	private String website;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TrainingCycle_Id", nullable = false, foreignKey = @ForeignKey(name = "fk_Faculty_TrainingCycle"))
    @JsonBackReference("trainingCycle-faculties")
    private TrainingCycle trainingCycle;

	// Mối quan hệ 1-N với GeneralInformation
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "faculty", cascade = CascadeType.ALL) // cascade là xóa các row
	// của bảng khác mà có
	// tham chiếu đến nó
	@JsonManagedReference
	private Set<GeneralInformation> generalInformations;

}

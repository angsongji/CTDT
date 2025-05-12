package com.project.CTDT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "curriculum_framework")
public class CurriculumFramework {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "status")
	private Integer status = 1;

	// Mối quan hệ 1-1 với GeneralInformation
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "generalInformation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_curriculum_general_info"))
	@JsonBackReference(value = "generalInformation-curriculumFramework")
	private GeneralInformation generalInformation;

}

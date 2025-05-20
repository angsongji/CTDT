package com.project.CTDT.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "course_outline")
@NoArgsConstructor
public class CourseOutline {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("id")
	private Integer id;

	// Nhiều mục đánh giá thuộc về một Course (ManyToOne)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "id_course", nullable = false, foreignKey = @ForeignKey(name = "fk_courseoutline_course"))
	@JsonIgnoreProperties({"courseOutlines"})
	@JsonProperty("course")
	private Course course;

	@Column(name = "assessment_unit", length = 255)
	@JsonProperty("assessmentUnit")
	private String assessmentUnit;

	@Column(name = "component_score", length = 255)
	@JsonProperty("componentScore")
	private String componentScore;

	@Column(name = "assessment_method", length = 255)
	@JsonProperty("assessmentMethod")
	private String assessmentMethod;

	@Column(name = "weight")
	@JsonProperty("weight")
	private Float weight;

	@Column(name = "status")
	@JsonProperty("status")
	private Integer status;

	// Nhiều CourseOutline con có thể thuộc về một CourseOutline cha (ManyToOne)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "id_parent", foreignKey = @ForeignKey(name = "fk_courseoutline_parent"))
	@JsonIgnoreProperties({"parent", "children"})
	@JsonProperty("parent")
	private CourseOutline parent;

	// Một CourseOutline có thể có nhiều mục con (OneToMany)
	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("id ASC")
	@JsonIgnoreProperties({"parent"})
	@JsonProperty("children")
	private Set<CourseOutline> children = new LinkedHashSet<>();
}

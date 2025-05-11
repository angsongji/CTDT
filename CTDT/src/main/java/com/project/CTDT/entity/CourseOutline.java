package com.project.CTDT.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "course_outline")
@JsonInclude(JsonInclude.Include.NON_NULL)
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

	// Constructor
	public CourseOutline() {
	}

	// Constructor with fields
	public CourseOutline(String assessmentUnit, String componentScore, String assessmentMethod, Float weight, Integer status) {
		this.assessmentUnit = assessmentUnit;
		this.componentScore = componentScore;
		this.assessmentMethod = assessmentMethod;
		this.weight = weight;
		this.status = status;
	}

	// Getters
	public Integer getId() {
		return id;
	}

	public Course getCourse() {
		return course;
	}

	public String getAssessmentUnit() {
		return assessmentUnit;
	}

	public String getComponentScore() {
		return componentScore;
	}

	public String getAssessmentMethod() {
		return assessmentMethod;
	}

	public Float getWeight() {
		return weight;
	}

	public Integer getStatus() {
		return status;
	}

	public CourseOutline getParent() {
		return parent;
	}

	public Set<CourseOutline> getChildren() {
		return children;
	}

	// Setters
	public void setId(Integer id) {
		this.id = id;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public void setAssessmentUnit(String assessmentUnit) {
		this.assessmentUnit = assessmentUnit;
	}

	public void setComponentScore(String componentScore) {
		this.componentScore = componentScore;
	}

	public void setAssessmentMethod(String assessmentMethod) {
		this.assessmentMethod = assessmentMethod;
	}

	public void setWeight(Float weight) {
		this.weight = weight;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public void setParent(CourseOutline parent) {
		this.parent = parent;
	}

	public void setChildren(Set<CourseOutline> children) {
		this.children = children;
	}
}

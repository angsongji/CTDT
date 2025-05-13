package com.project.CTDT.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

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
@Table(name = "knowledge_areas")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KnowledgeAreas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("id")
	private Integer id;

	@Column(name = "name", nullable = false, length = 255)
	@JsonProperty("name")
	private String name;

	@Column(name = "usage_count")
	private Integer usage_count = 1;

	// Mỗi quan hệ phản thân
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_Knowledge_areas_parent"), nullable = true)
	@JsonBackReference
	private KnowledgeAreas parent;

	// Getter để trả về id của parent
	@JsonProperty("parent_id")
	public Integer getParentId() {
		return parent != null ? parent.getId() : 0;
	}

	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private Set<KnowledgeAreas> children = new HashSet<>();

	// Mối quan hệ 1-N với Course
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "knowledgeAreas", cascade = CascadeType.ALL)
	@JsonManagedReference(value = "course-knowledgeAreas")
	@JsonIgnore
	private Set<Course> courses = new HashSet<>();
}

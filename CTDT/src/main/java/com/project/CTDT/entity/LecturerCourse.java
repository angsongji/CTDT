package com.project.CTDT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
//@ToString(exclude = { "lecturer", "course" })
@ToString(exclude = { "lecturer" })
@Entity
@Table(name = "lecturer_course")
public class LecturerCourse {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lecturer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_lecturer_course"))
	@JsonBackReference(value = "lecturer-lecturerCourses")
	private Lecturer lecturer;
	
	// Getter để trả về lecturer
		@JsonProperty("lecturer")
		public Lecturer getLecturer() {
			return lecturer;
		}


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false, foreignKey = @ForeignKey(name = "fk_course_lecturer"))
	@JsonBackReference(value = "lecturerCourses-course")
	private Course course;

	@JsonProperty("lecturerId")
    public Integer getLecturerId() {
        return lecturer != null ? lecturer.getId() : null;
    }
	
	@JsonProperty("courseId")
    public Integer getCourseId() {
        return course != null ? course.getId() : null;
    }
	
	@JsonProperty("lecturerName")
    public String getLecturerName() {
        return lecturer != null ? lecturer.getFullName() : null;
    }
	
	@JsonProperty("courseName")
    public String getCourseName() {
        return course != null ? course.getName() : null;
    }
}

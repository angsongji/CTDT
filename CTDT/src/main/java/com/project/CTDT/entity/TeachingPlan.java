package com.project.CTDT.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "teaching_plan")
@Getter
@Setter
@NoArgsConstructor
public class TeachingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Mối quan hệ N:1 với GeneralInformation
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_information", nullable = false,
                foreignKey = @ForeignKey(name = "fk_teaching_plan_information"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private GeneralInformation generalInformation;

    // Mối quan hệ N:1 với Course
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_course", nullable = false,
                foreignKey = @ForeignKey(name = "fk_teaching_plan_course"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Course course;

    // Mối quan hệ tự tham chiếu cho học phần trước
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id", 
                foreignKey = @ForeignKey(name = "fk_teaching_plan_parent"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "parent"})
    private TeachingPlan parent;

    @OneToMany(mappedBy = "parent")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "parent"})
    private Set<TeachingPlan> prerequisites = new HashSet<>();

    @Column(name = "implementation_semester", nullable = false)
    private Integer implementationSemester;

    @Column(name = "status", nullable = false)
    private Integer status;

    // Getter cho parent_id
    @JsonProperty("parent_id")
    public Integer getParentId() {
        return parent != null ? parent.getCourse().getId() : null;
    }

    // Setter cho parent_id
    public void setParentId(Integer parentId) {
        if (parentId != null) {
            TeachingPlan parentPlan = new TeachingPlan();
            Course parentCourse = new Course();
            parentCourse.setId(parentId);
            parentPlan.setCourse(parentCourse);
            this.parent = parentPlan;
        } else {
            this.parent = null;
        }
    }
}

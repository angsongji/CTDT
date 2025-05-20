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
    @JsonProperty("id")
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

    @Column(name = "implementation_semester", nullable = false)
    @JsonProperty("implementationSemester")
    private Integer implementationSemester;

    @Column(name = "status", nullable = false)
    @JsonProperty("status")
    private Integer status;
}

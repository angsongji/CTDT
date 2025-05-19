package com.project.CTDT.repository;

import com.project.CTDT.entity.CourseOutline;
import com.project.CTDT.entity.TeachingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeachingPlanRepository extends JpaRepository<TeachingPlan, Integer> {
	List<TeachingPlan> findByGeneralInformationId(Integer idInformation);

	List<TeachingPlan> findByCourseId(Integer courseId);

	// Lấy danh sách TeachingPlan theo id_information và status = 1
	List<TeachingPlan> findByGeneralInformationIdAndStatus(Integer generalInfoId, Integer status);

}
package com.project.CTDT.repository;

import com.project.CTDT.entity.TeachingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeachingPlanRepository extends JpaRepository<TeachingPlan, Integer> {
    List<TeachingPlan> findByGeneralInformationId(Integer idInformation);
}
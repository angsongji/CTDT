package com.project.CTDT.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.CTDT.entity.GroupOpeningPlan;
import java.util.List;
import org.springframework.data.jpa.repository.Query; 

public interface GroupOpenPlanRepository extends JpaRepository<GroupOpeningPlan, Integer> {

}

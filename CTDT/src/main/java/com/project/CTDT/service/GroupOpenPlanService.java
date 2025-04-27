package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.GroupOpeningPlan;

public interface GroupOpenPlanService {
	List<GroupOpeningPlan> getAllGroupOpeningPlans();

	GroupOpeningPlan getGroupOpeningPlanById(Integer id);

	GroupOpeningPlan saveGroupOpeningPlan(GroupOpeningPlan groupOpeningPlan);

	void deleteGroupOpeningPlan(Integer id);
}

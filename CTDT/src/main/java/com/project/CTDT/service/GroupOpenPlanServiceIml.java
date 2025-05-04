package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.project.CTDT.entity.GroupOpeningPlan;
import com.project.CTDT.repository.GroupOpenPlanRepository;

@Service
public class GroupOpenPlanServiceIml implements GroupOpenPlanService {

	private final GroupOpenPlanRepository groupOpenPlanRepository;
	
	@Autowired
	public GroupOpenPlanServiceIml(GroupOpenPlanRepository groupOpenPlanRepository) {
		this.groupOpenPlanRepository = groupOpenPlanRepository;
	}

	@Override //test
	public List<GroupOpeningPlan> getAllGroupOpeningPlans() {
		return groupOpenPlanRepository.findAll();
	}

	@Override
	public GroupOpeningPlan getGroupOpeningPlanById(Integer id) {
		Optional<GroupOpeningPlan> optional = groupOpenPlanRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("GroupOpeningPlan not found with id " + id));
	}
	
	@Override
	public GroupOpeningPlan saveGroupOpeningPlan(GroupOpeningPlan groupOpeningPlan) {
	    groupOpeningPlan.setGroups(null);
	    return groupOpenPlanRepository.save(groupOpeningPlan);
	}


	@Override
	public void deleteGroupOpeningPlan(Integer id) {
		groupOpenPlanRepository.deleteById(id);
	}
}

package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;


import com.project.CTDT.entity.GroupOpeningPlan;
import com.project.CTDT.service.GroupOpenPlanService;

@RestController
@RequestMapping("/api/group-open-plan")
@CrossOrigin
public class GroupOpenPlanController {
	@Autowired
	private GroupOpenPlanService groupOpenPlanService;

	@GetMapping
	public List<GroupOpeningPlan> getAllGroupOpeningPlans() {
		return groupOpenPlanService.getAllGroupOpeningPlans();
	}

	@GetMapping("/detail/{id}")
	public GroupOpeningPlan getGroupOpeningPlanById(@PathVariable Integer id) {
		return groupOpenPlanService.getGroupOpeningPlanById(id);
	}

	@PostMapping("/create")
	public GroupOpeningPlan createGroupOpeningPlan(@RequestBody GroupOpeningPlan groupOpeningPlan) {
		return groupOpenPlanService.saveGroupOpeningPlan(groupOpeningPlan);
	}
	
	
	@PatchMapping("/edit/{id}")
	public GroupOpeningPlan updateGroupOpeningPlan(@PathVariable Integer id, @RequestBody GroupOpeningPlan groupOpeningPlan) {
		groupOpeningPlan.setId(id);
		return groupOpenPlanService.saveGroupOpeningPlan(groupOpeningPlan);
	}

	@DeleteMapping("/del/{id}")
	public void deleteGroupOpeningPlan(@PathVariable Integer id) {
		groupOpenPlanService.deleteGroupOpeningPlan(id);
	}
}

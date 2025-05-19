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
	public GroupOpeningPlan updateGroupOpeningPlan(@PathVariable Integer id, @RequestBody GroupOpeningPlan input) {
	    GroupOpeningPlan existing = groupOpenPlanService.getGroupOpeningPlanById(id);

	    if (input.getNumberOfGroups() != null) {
	        existing.setNumberOfGroups(input.getNumberOfGroups());
	    }
	    if (input.getNumberOfStudents() != null) {
	        existing.setNumberOfStudents(input.getNumberOfStudents());
	    }
	    if (input.getImplementationSemester() != null) {
	        existing.setImplementationSemester(input.getImplementationSemester());
	    }
	    if (input.getStatus() != null) {
	        existing.setStatus(input.getStatus());
	    }

	    if (input.getCourse() != null && input.getCourse().getId() != null) {
	        existing.setCourse(input.getCourse());
	    }

	    if (input.getTrainingCycleFaculty() != null && input.getTrainingCycleFaculty().getId() != null) {
	        existing.setTrainingCycleFaculty(input.getTrainingCycleFaculty()); // hoặc lấy từ DB nếu muốn kiểm tra kỹ hơn
	    }

	    return groupOpenPlanService.saveGroupOpeningPlan(existing);
	}


	@DeleteMapping("/del/{id}")
	public void deleteGroupOpeningPlan(@PathVariable Integer id) {
		groupOpenPlanService.deleteGroupOpeningPlan(id);
	}
}

package com.project.CTDT.controller;

import com.project.CTDT.entity.TeachingPlan;
import com.project.CTDT.service.TeachingPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teaching-plans")
@CrossOrigin
public class TeachingPlanController {

    @Autowired
    private TeachingPlanService teachingPlanService;

    // Lấy tất cả TeachingPlan
    @GetMapping
    public List<TeachingPlan> getAll() {
        return teachingPlanService.getAllTeachingPlans();
    }

    // Tìm TeachingPlan theo id_information
    @GetMapping("/information/{idInformation}")
    public List<TeachingPlan> getByInformationId(@PathVariable Integer idInformation) {
        return teachingPlanService.getByInformationId(idInformation);
    }

    // Thêm TeachingPlan mới
    @PostMapping
    public TeachingPlan createTeachingPlan(@RequestBody TeachingPlan teachingPlan) {
        return teachingPlanService.saveTeachingPlan(teachingPlan);
    }

    // Cập nhật TeachingPlan theo id
    @PutMapping("/{id}")
    public TeachingPlan updateTeachingPlan(@PathVariable Integer id, @RequestBody TeachingPlan updatedPlan) {
    	updatedPlan.setId(id); 
        return teachingPlanService.saveTeachingPlan(updatedPlan);
    }

    // Xoá TeachingPlan theo id
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        teachingPlanService.deleteTeachingPlan(id);
    }
}

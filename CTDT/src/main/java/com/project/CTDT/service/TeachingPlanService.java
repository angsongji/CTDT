package com.project.CTDT.service;

import com.project.CTDT.entity.TeachingPlan;

import java.util.List;

public interface TeachingPlanService {
    List<TeachingPlan> getAllTeachingPlans();
    List<TeachingPlan> getByInformationId(Integer idInformation);
    TeachingPlan saveTeachingPlan(TeachingPlan teachingPlan);
    void deleteTeachingPlan(Integer id);
}

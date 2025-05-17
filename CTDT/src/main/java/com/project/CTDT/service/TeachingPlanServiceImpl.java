package com.project.CTDT.service;

import com.project.CTDT.entity.TeachingPlan;
import com.project.CTDT.repository.TeachingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeachingPlanServiceImpl implements TeachingPlanService {

    @Autowired
    private TeachingPlanRepository repository;

    public TeachingPlanServiceImpl(TeachingPlanRepository repository) {
        this.repository = repository;
    }

    // Lấy toàn bộ TeachingPlan
    @Override
    public List<TeachingPlan> getAllTeachingPlans() {
        return repository.findAll();
    }

    // Tìm TeachingPlan theo id của GeneralInformation
    @Override
    public List<TeachingPlan> getByInformationId(Integer idInformation) {
        return repository.findByGeneralInformationId(idInformation);
    }

    @Override
    public TeachingPlan saveTeachingPlan(TeachingPlan teachingPlan){
        return repository.save(teachingPlan);
    }

    // Xoá TeachingPlan theo id
    @Override
    public void deleteTeachingPlan(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không thể xoá. TeachingPlan không tồn tại với id: " + id);
        }
        repository.deleteById(id);
    }
    
    @Override
    public List<TeachingPlan> getByCourseId(Integer courseId) {
        return repository.findByCourseId(courseId);
    }
}

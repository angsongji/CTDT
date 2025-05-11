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

    // Tạo TeachingPlan mới
    @Override
    public TeachingPlan createTeachingPlan(TeachingPlan teachingPlan) {
        if (teachingPlan.getCourse() == null || teachingPlan.getGeneralInformation() == null) {
            throw new IllegalArgumentException("Course và GeneralInformation không được để trống.");
        }
        return repository.save(teachingPlan);
    }

    // Cập nhật TeachingPlan theo id
    @Override
    public TeachingPlan updateTeachingPlan(Integer id, TeachingPlan updatedTeachingPlan) {
        Optional<TeachingPlan> optional = repository.findById(id);
        if (optional.isPresent()) {
            TeachingPlan plan = optional.get();

            plan.setCourse(updatedTeachingPlan.getCourse());
            plan.setGeneralInformation(updatedTeachingPlan.getGeneralInformation());
            plan.setImplementationSemester(updatedTeachingPlan.getImplementationSemester());
            plan.setStatus(updatedTeachingPlan.getStatus());

            return repository.save(plan);
        } else {
            throw new RuntimeException("Không tìm thấy TeachingPlan với id: " + id);
        }
    }

    // Xoá TeachingPlan theo id
    @Override
    public void deleteTeachingPlan(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không thể xoá. TeachingPlan không tồn tại với id: " + id);
        }
        repository.deleteById(id);
    }
}

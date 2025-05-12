package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.CTDT.entity.TeachingAssignment;
import com.project.CTDT.repository.TeachingAssignmentRepository;

@Service
public class TeachingAssignmentServiceImpl implements TeachingAssignmentService {

    private final TeachingAssignmentRepository teachingAssignmentRepository;

    // Constructor injection
    public TeachingAssignmentServiceImpl(TeachingAssignmentRepository teachingAssignmentRepository) {
        this.teachingAssignmentRepository = teachingAssignmentRepository;
    }

    @Override
    public List<TeachingAssignment> getAllTeachingAssignments() {
        return teachingAssignmentRepository.findAll();
    }

    @Override
    public TeachingAssignment getTeachingAssignmentById(Integer id) {
        Optional<TeachingAssignment> optional = teachingAssignmentRepository.findById(id);
        return optional.orElseThrow(() -> new RuntimeException("TeachingAssignment not found with id " + id));
    }

    @Override
    public TeachingAssignment saveTeachingAssignment(TeachingAssignment teachingAssignment) {
        return teachingAssignmentRepository.save(teachingAssignment);
    }

    @Override
    public void deleteTeachingAssignment(Integer id) {
        teachingAssignmentRepository.deleteById(id);
    }
}

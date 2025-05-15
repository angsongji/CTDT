package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.CTDT.entity.TrainingCycleFaculty;
import com.project.CTDT.repository.TrainingCycleFacultyRepository;

@Service
public class TrainingCycleFacultyServiceImpl implements TrainingCycleFacultyService {

    @Autowired
    private TrainingCycleFacultyRepository trainingCycleFacultyRepository;

    @Override
    public List<TrainingCycleFaculty> getAllTrainingCycleFaculties() {
        return trainingCycleFacultyRepository.findAll();
    }

    @Override
    public TrainingCycleFaculty getTrainingCycleFacultyById(Integer id) {
        Optional<TrainingCycleFaculty> optional = trainingCycleFacultyRepository.findById(id);
        return optional.orElseThrow(() -> new RuntimeException("TrainingCycleFaculty not found with id " + id));
    }

    @Override
    public TrainingCycleFaculty saveTrainingCycleFaculty(TrainingCycleFaculty trainingCycleFaculty) {
        return trainingCycleFacultyRepository.save(trainingCycleFaculty);
    }

    @Override
    public void deleteTrainingCycleFaculty(Integer id) {
        trainingCycleFacultyRepository.deleteById(id);
    }
}

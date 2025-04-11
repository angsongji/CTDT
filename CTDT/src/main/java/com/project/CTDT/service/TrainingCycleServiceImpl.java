package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.CTDT.entity.TrainingCycle;
import com.project.CTDT.repository.TrainingCycleRepository;

@Service
public class TrainingCycleServiceImpl implements TrainingCycleService {

	@Autowired
	private TrainingCycleRepository trainingCycleRepository;

	@Override
	public List<TrainingCycle> getAllTrainingCycles() {
		return trainingCycleRepository.findAll();
	}

	@Override
	public TrainingCycle getTrainingCycleById(Integer id) {
		Optional<TrainingCycle> optional = trainingCycleRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("TrainingCycle not found with id " + id));
	}

	@Override
	public TrainingCycle saveTrainingCycle(TrainingCycle trainingCycle) {
		return trainingCycleRepository.save(trainingCycle);
	}

	@Override
	public void deleteTrainingCycle(Integer id) {
		trainingCycleRepository.deleteById(id);
	}
}

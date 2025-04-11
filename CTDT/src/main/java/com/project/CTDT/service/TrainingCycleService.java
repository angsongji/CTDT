package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.TrainingCycle;

public interface TrainingCycleService {
	List<TrainingCycle> getAllTrainingCycles();

	TrainingCycle getTrainingCycleById(Integer id);

	TrainingCycle saveTrainingCycle(TrainingCycle trainingCycle);

	void deleteTrainingCycle(Integer id);
}

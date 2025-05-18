package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.TrainingCycleFaculty;

public interface TrainingCycleFacultyService {
	List<TrainingCycleFaculty> getAllTrainingCycleFaculties();

	TrainingCycleFaculty getTrainingCycleFacultyById(Integer id);

	TrainingCycleFaculty saveTrainingCycleFaculty(TrainingCycleFaculty trainingCycleFaculty);

	void deleteTrainingCycleFaculty(Integer id);
}

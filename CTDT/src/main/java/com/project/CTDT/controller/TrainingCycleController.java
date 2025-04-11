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

import com.project.CTDT.entity.TrainingCycle;
import com.project.CTDT.service.TrainingCycleService;

@RestController
@RequestMapping("/api/training-cycles")
@CrossOrigin
public class TrainingCycleController {

	@Autowired
	private TrainingCycleService trainingCycleService;

	@GetMapping
	public List<TrainingCycle> getAllTrainingCycles() {
		return trainingCycleService.getAllTrainingCycles();
	}

	@GetMapping("/{id}")
	public TrainingCycle getTrainingCycleById(@PathVariable Integer id) {
		return trainingCycleService.getTrainingCycleById(id);
	}

	@PostMapping
	public TrainingCycle createTrainingCycle(@RequestBody TrainingCycle trainingCycle) {
		return trainingCycleService.saveTrainingCycle(trainingCycle);
	}

	@PutMapping("/{id}")
	public TrainingCycle updateTrainingCycle(@PathVariable Integer id, @RequestBody TrainingCycle trainingCycle) {
		trainingCycle.setId(id);
		return trainingCycleService.saveTrainingCycle(trainingCycle);
	}

	@DeleteMapping("/{id}")
	public void deleteTrainingCycle(@PathVariable Integer id) {
		trainingCycleService.deleteTrainingCycle(id);
	}
}

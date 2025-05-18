package com.project.CTDT.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.CTDT.entity.GeneralInformation;
import com.project.CTDT.service.GeneralInformationService;

@RestController
@RequestMapping("/api/general-informations")
@CrossOrigin
public class GeneralInformationController {

	@Autowired
	private GeneralInformationService generalInformationService;

	@GetMapping
	public List<GeneralInformation> getAllGeneralInformations() {
		return generalInformationService.getAllGeneralInformations();
	}

	@GetMapping("/{id}")
	public GeneralInformation getGeneralInformationById(@PathVariable Integer id) {
		return generalInformationService.getGeneralInformationById(id);
	}

	@PostMapping
	public GeneralInformation createGeneralInformation(@RequestBody GeneralInformation generalInformation) {
		return generalInformationService.saveGeneralInformation(generalInformation);
	}

	@PutMapping("/{id}")
	public GeneralInformation updateGeneralInformation(@PathVariable Integer id,
			@RequestBody GeneralInformation generalInformation) {
		generalInformation.setId(id);
		return generalInformationService.saveGeneralInformation(generalInformation);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteGeneralInformation(@PathVariable Integer id) {
		try {
			generalInformationService.deleteGeneralInformation(id);
			return ResponseEntity.ok().build();
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
}

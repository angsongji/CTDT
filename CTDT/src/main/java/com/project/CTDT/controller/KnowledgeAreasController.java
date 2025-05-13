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

import com.project.CTDT.entity.KnowledgeAreas;
import com.project.CTDT.service.KnowledgeAreasService;

@RestController
@RequestMapping("/api/knowledge-areas")
@CrossOrigin // Cho phép gọi từ frontend
public class KnowledgeAreasController {
	@Autowired
	private KnowledgeAreasService knowledgeAreasService;

	@GetMapping
	public List<KnowledgeAreas> getAllKnowledgeAreas() {
		return knowledgeAreasService.getAllKnowledgeAreas();
	}

	@GetMapping("/{id}")
	public KnowledgeAreas getKnowledgeAreasById(@PathVariable Integer id) {
		return knowledgeAreasService.getKnowledgeAreasById(id);
	}

	@PostMapping
	public ResponseEntity<KnowledgeAreas> createKnowledgeAreas(@RequestBody KnowledgeAreas knowledgeAreas) {
		KnowledgeAreas saved = knowledgeAreasService.saveKnowledgeAreas(knowledgeAreas);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping("/{id}")
	public KnowledgeAreas updateKnowledgeAreas(@PathVariable Integer id, @RequestBody KnowledgeAreas knowledgeAreas) {
		knowledgeAreas.setId(id);
		return knowledgeAreasService.saveKnowledgeAreas(knowledgeAreas);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteKnowledgeArea(@PathVariable Integer id) {
		try {
			knowledgeAreasService.deleteKnowledgeAreas(id);
			return ResponseEntity.ok().build();
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

}

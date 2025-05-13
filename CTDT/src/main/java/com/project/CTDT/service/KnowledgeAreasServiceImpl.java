package com.project.CTDT.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.CTDT.entity.KnowledgeAreas;
import com.project.CTDT.repository.KnowledgeAreasRepository;

@Service
public class KnowledgeAreasServiceImpl implements KnowledgeAreasService {

	@Autowired
	private KnowledgeAreasRepository knowledgeAreasRepository;

	@Override
	public List<KnowledgeAreas> getAllKnowledgeAreas() {
		return knowledgeAreasRepository.findAll();
	}

	@Override
	public KnowledgeAreas getKnowledgeAreasById(Integer id) {
		return knowledgeAreasRepository.findById(id).orElse(null);
	}

	@Override
	public KnowledgeAreas saveKnowledgeAreas(KnowledgeAreas knowledgeAreas) {
		return knowledgeAreasRepository.save(knowledgeAreas);
	}

	@Override
	public void deleteKnowledgeAreas(Integer id) {
		knowledgeAreasRepository.deleteById(id);
	}
}

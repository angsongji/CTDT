package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.KnowledgeAreas;

public interface KnowledgeAreasService {
	List<KnowledgeAreas> getAllKnowledgeAreas();

	KnowledgeAreas getKnowledgeAreasById(Integer id);

	KnowledgeAreas saveKnowledgeAreas(KnowledgeAreas knowledgeAreas);

	void deleteKnowledgeAreas(Integer id);
}

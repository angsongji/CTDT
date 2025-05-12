package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.GeneralInformation;

public interface GeneralInformationService {
	List<GeneralInformation> getAllGeneralInformations();

	GeneralInformation getGeneralInformationById(Integer id);

	GeneralInformation saveGeneralInformation(GeneralInformation generalInformation);

	void deleteGeneralInformation(Integer id);
}

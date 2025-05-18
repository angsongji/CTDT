package com.project.CTDT.service;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.project.CTDT.entity.GeneralInformation;
import com.project.CTDT.repository.GeneralInformationRepository;

@Service
public class GeneralInformationServiceImpl implements GeneralInformationService {

	private final GeneralInformationRepository generalInformationRepository;

	public GeneralInformationServiceImpl(GeneralInformationRepository generalInformationRepository) {
		this.generalInformationRepository = generalInformationRepository;
	}

	@Override
	public List<GeneralInformation> getAllGeneralInformations() {
		return generalInformationRepository.findAll();
	}

	@Override
	public GeneralInformation getGeneralInformationById(Integer id) {
		Optional<GeneralInformation> optional = generalInformationRepository.findById(id);
		return optional.orElseThrow(() -> new RuntimeException("GeneralInformation not found with id " + id));
	}

	@Override
	public GeneralInformation saveGeneralInformation(GeneralInformation generalInformation) {
		return generalInformationRepository.save(generalInformation);
	}

	@Override
	public void deleteGeneralInformation(Integer id) {
		try {
			generalInformationRepository.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			// Nếu có lỗi ràng buộc, không xóa mà update status về 0
			Optional<GeneralInformation> optional = generalInformationRepository.findById(id);
			if (optional.isPresent()) {
				GeneralInformation gi = optional.get();
				gi.setStatus(0);
				generalInformationRepository.save(gi);
			} else {
				throw new RuntimeException("Không tìm thấy thông tin chung với mã thông tin: " + id);
			}
		}
	}

}

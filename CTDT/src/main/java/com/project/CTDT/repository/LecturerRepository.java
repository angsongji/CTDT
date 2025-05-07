package com.project.CTDT.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.CTDT.entity.Lecturer;

public interface LecturerRepository extends JpaRepository<Lecturer, Integer> {
}

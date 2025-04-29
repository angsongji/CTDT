package com.project.CTDT.service;

import java.util.List;

import com.project.CTDT.entity.Group;

public interface GroupService {
	List<Group> getAllGroups();

	Group getGroupById(Integer id);

	Group saveGroup(Group group);

	void deleteGroup(Integer id);
}

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

import com.project.CTDT.entity.Group;
import com.project.CTDT.service.GroupService;

@RestController
@RequestMapping("/api/group-study")
@CrossOrigin // Cho phép gọi từ frontend
public class GroupController {

    @Autowired
    private GroupService groupService;

    // GET all groups
    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    // GET group by ID
    @GetMapping("/detail/{id}")
    public Group getGroupById(@PathVariable Integer id) {
        return groupService.getGroupById(id);
    }

    // POST create new group
    @PostMapping("/create")
    public Group createGroup(@RequestBody Group group) {
        return groupService.saveGroup(group);
    }

    // PUT update group
    @PutMapping("/update/{id}")
    public Group updateGroup(@PathVariable Integer id, @RequestBody Group group) {
        group.setId(id);
        return groupService.saveGroup(group);
    }

    // DELETE group
    @DeleteMapping("/delete/{id}")
    public void deleteGroup(@PathVariable Integer id) {
        groupService.deleteGroup(id);
    }
}

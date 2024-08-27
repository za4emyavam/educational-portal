package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.Task;
import com.example.test_pre_diplom.entities.dto.TaskInfoDTO;
import com.example.test_pre_diplom.entities.dto.TaskLabDTO;
import com.example.test_pre_diplom.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class TaskRestController {
    private final TaskService taskService;

    public TaskRestController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/subjects/{id}/tasks")
    public List<Task> getAllTasksBySubject(@PathVariable Long id) {
        return taskService.getAllTasksBySubjectId(id);
    }

    @GetMapping("/tasks/{taskId}")
    public Task getTaskById(@PathVariable Long taskId) {
        return taskService.getTaskById(taskId);
    }

    @GetMapping("/tasks/students/{studentId}")
    public List<Task> getAllTasksByStudent(@PathVariable Long studentId) {
        return taskService.getAllForStudyGroupByStudentId(studentId);
    }

    @GetMapping("/tasks/students/{studentId}/pag")
    public Page<Task> getAllTaskByStudentWithPag(@PathVariable Long studentId,
                                                 @RequestParam(defaultValue = "0") Integer page,
                                                 @RequestParam(defaultValue = "5") Integer size,
                                                 @RequestParam(defaultValue = "createDate") String sortBy,
                                                 @RequestParam(defaultValue = "desc") String direction) {
        return taskService.getAllForStudyGroupByStudentId(studentId, page, size, sortBy, direction);
    }

    @DeleteMapping("/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTaskById(@PathVariable Long taskId) {
        taskService.deleteTaskById(taskId);
    }

    @PostMapping("/subjects/{subjectId}/tasks")
    public Task saveTask(@PathVariable Long subjectId, @RequestBody Task task) {
        return taskService.saveTask(task, subjectId);
    }

    @PostMapping("/subjects/{subjectId}/tasks/info")
    public Task saveTask(@PathVariable Long subjectId, @RequestBody TaskInfoDTO task) {
        return taskService.saveTask(task, subjectId);
    }

    @PostMapping("/subjects/{subjectId}/tasks/lab")
    public Task saveTask(@PathVariable Long subjectId, @RequestBody TaskLabDTO task) {
        return taskService.saveTask(task, subjectId);
    }

    @PatchMapping("/subjects/{subjectId}/tasks/{taskId}")
    public Task patchTask(@RequestBody Task task, @PathVariable Long subjectId, @PathVariable Long taskId) {
        return taskService.updateTask(task, subjectId, taskId);
    }
}

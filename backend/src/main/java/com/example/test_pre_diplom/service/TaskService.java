package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.GradedTaskRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.SubjectRepository;
import com.example.test_pre_diplom.data.TaskRepository;
import com.example.test_pre_diplom.entities.GradedTask;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.Subject;
import com.example.test_pre_diplom.entities.Task;
import com.example.test_pre_diplom.entities.dto.TaskInfoDTO;
import com.example.test_pre_diplom.entities.dto.TaskLabDTO;
import com.example.test_pre_diplom.exceptions.GradedTaskNotFound;
import com.example.test_pre_diplom.exceptions.StudentNotFoundException;
import com.example.test_pre_diplom.exceptions.SubjectNotFoundException;
import com.example.test_pre_diplom.exceptions.TaskNotFound;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final GradedTaskRepository gradedTaskRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final FileService fileService;

    public TaskService(TaskRepository taskRepository, GradedTaskRepository gradedTaskRepository, SubjectRepository subjectRepository, StudentRepository studentRepository, FileService fileService) {
        this.taskRepository = taskRepository;
        this.gradedTaskRepository = gradedTaskRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.fileService = fileService;
    }

    public List<Task> getAllTasksBySubjectId(Long subjectId) {
        Optional<Subject> subject = subjectRepository.findById(subjectId);
        return subject.map(taskRepository::getAllBySubjectIdOrderByCreateDateDesc).orElse(null);
    }

    public Task getTaskById(Long taskId) {
        Optional<Task> task = taskRepository.findById(taskId);
        return task.orElse(null);
    }


    /**
     * Saves a task along with graded task (if applicable).
     *
     * @param task      The task to save.
     * @param subjectId The ID of the subject associated with the task.
     * @return The saved task.
     * @throws SubjectNotFoundException if the subject with the specified ID is not found.
     */
    @Transactional
    public Task saveTask(Task task, Long subjectId) {
        Optional<Subject> subject = subjectRepository.findById(subjectId);
        if (subject.isEmpty())
            throw new SubjectNotFoundException("Subject with id: " + subjectId + " not found.");
        task.setSubjectId(subject.get());
        Task savedTask = taskRepository.save(task);
        switch (task.getTask()){
            case LAB:
            case MODULAR:
                GradedTask gradedTask = new GradedTask();
                gradedTask.setTaskId(savedTask.getTaskId());
                gradedTask.setMaxScore(task.getGradedTask().getMaxScore());
                gradedTask.setDateTo(task.getGradedTask().getDateTo());
                GradedTask savedGradedTask = gradedTaskRepository.save(gradedTask);
                savedTask.setGradedTask(savedGradedTask);
        }
        return savedTask;
    }

    public Task saveTask(TaskInfoDTO task, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found."));

        return taskRepository.save(new Task(subject, Task.TaskType.INFO, task.getTitle(), task.getDescription()));
    }

    @Transactional
    public Task saveTask(TaskLabDTO task, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found."));

        Task savedTask = taskRepository.save(new Task(subject, Task.TaskType.valueOf(task.getType()), task.getTitle(), task.getDescription()));

        GradedTask gradedTask = new GradedTask(savedTask.getTaskId(), task.getMaxScore(), task.getDateTo().atStartOfDay());
        System.out.println(gradedTask);
        GradedTask savedGradedTask = gradedTaskRepository.save(gradedTask);
        savedTask.setGradedTask(savedGradedTask);

        return savedTask;
    }

    @Transactional
    public void deleteTaskById(Long taskId) {
        fileService.deleteAllFilesByTask(taskId);
        gradedTaskRepository.deleteById(taskId);
        taskRepository.deleteById(taskId);
    }

    @Transactional
    public Task updateTask(Task updatedTask, Long subjectId, Long currentTaskId) {
        Task task = taskRepository.findById(currentTaskId)
                .orElseThrow(() -> new TaskNotFound("GradedTask with id: " + currentTaskId + " not found."));

        if (updatedTask.getTitle() != null)
            task.setTitle(updatedTask.getTitle());

        if (updatedTask.getDescription() != null)
            task.setDescription(updatedTask.getDescription());

        if (updatedTask.getGradedTask() != null &&
                (task.getTask().equals(Task.TaskType.LAB) || task.getTask().equals(Task.TaskType.MODULAR))) {
            GradedTask gradedTask = gradedTaskRepository.findById(currentTaskId)
                    .orElseThrow(() -> new GradedTaskNotFound("GradedTask with id: " + currentTaskId + " not found."));
            if (updatedTask.getGradedTask().getMaxScore() != null)
                gradedTask.setMaxScore(updatedTask.getGradedTask().getMaxScore());

            if (updatedTask.getGradedTask().getDateTo() != null)
                gradedTask.setDateTo(updatedTask.getGradedTask().getDateTo());

            gradedTaskRepository.save(gradedTask);
        }
        return taskRepository.save(task);
    }

    public List<Task> getAllForStudyGroupByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));
        return taskRepository.findTasksByStudyGroup(student.getGroupId());
    }

    public Page<Task> getAllForStudyGroupByStudentId(Long studentId, Integer page, Integer size, String sortBy, String direction) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        return taskRepository.findTasksByStudyGroup(student.getGroupId(),
                PageRequest.of(page, size, direction.equals("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending()));
    }
}

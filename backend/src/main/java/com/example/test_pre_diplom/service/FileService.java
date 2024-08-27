package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.*;
import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.FileDTO;
import com.example.test_pre_diplom.entities.dto.StudentTaskFileDTO;
import com.example.test_pre_diplom.entities.dto.TaskFileDTO;
import com.example.test_pre_diplom.exceptions.FileNotFoundException;
import com.example.test_pre_diplom.exceptions.StudentNotFoundException;
import com.example.test_pre_diplom.exceptions.StudentTaskFileNotFoundException;
import com.example.test_pre_diplom.exceptions.TaskNotFound;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {
    private final TaskFileRepository taskFileRepository;
    private final TaskRepository taskRepository;
    private final FileRepository fileRepository;
    private final S3Service s3Service;
    private final StudentRepository studentRepository;
    private final StudentTaskFileRepository studentTaskFileRepository;

    public FileService(TaskFileRepository taskFileRepository, TaskRepository taskRepository, FileRepository fileRepository, S3Service s3Service, StudentRepository studentRepository, StudentTaskFileRepository studentTaskFileRepository) {
        this.taskFileRepository = taskFileRepository;
        this.taskRepository = taskRepository;
        this.fileRepository = fileRepository;
        this.s3Service = s3Service;
        this.studentRepository = studentRepository;
        this.studentTaskFileRepository = studentTaskFileRepository;
    }


    public List<FileDTO> getFilesByTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));

        List<FileDTO> result = new ArrayList<>();

        taskFileRepository.getFilesByTaskId(task).forEach(file -> {
            result.add(
                    new FileDTO(file.getFileId().getFileId(), file.getFileId().getFilename(), file.getFileId().getFiletype(), file.getFileId().getUploadedDate())
            );
        });

        return result;
    }

    public byte[] getFileContent(Long fileId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File with id " + fileId + " not found"));
        return s3Service.getFileFromS3(file.getLink());
    }

    @Transactional
    public FileDTO uploadStudentTaskFile(Long taskId, Long studentId, MultipartFile file) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id" + studentId + " not found"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));

        String keyName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        FileDTO filesMeta = null;
        try {
            String url = s3Service.uploadFile(file, keyName);
            if (url != null && !url.isBlank()) {
                String extension = "";
                int dotIndex = file.getOriginalFilename().lastIndexOf(".");

                if (dotIndex > 0 && dotIndex < file.getOriginalFilename().length() - 1) {
                    extension = file.getOriginalFilename().substring(dotIndex + 1);
                }

                File savedFile = fileRepository.save(new File(url, file.getOriginalFilename(), extension));
                StudentTaskFileId studentTaskFileId = new StudentTaskFileId(studentId, taskId, savedFile.getFileId());
                StudentTaskFile studentTaskFile = new StudentTaskFile(studentTaskFileId, student, task, savedFile);
                studentTaskFileRepository.save(studentTaskFile);
                filesMeta = new FileDTO(savedFile.getFileId(), savedFile.getFilename(), savedFile.getFiletype(), savedFile.getUploadedDate());
            }
            return filesMeta;
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    @Transactional
    public FileDTO uploadTaskFile(Long taskId, MultipartFile file) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));

        String keyName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        FileDTO filesMeta = null;
        try {
            String url = s3Service.uploadFile(file, keyName);
            if (url != null && !url.isBlank()) {
                String extension = "";
                int dotIndex = file.getOriginalFilename().lastIndexOf(".");

                if (dotIndex > 0 && dotIndex < file.getOriginalFilename().length() - 1) {
                    extension = file.getOriginalFilename().substring(dotIndex + 1);
                }

                File savedFile = fileRepository.save(new File(url, file.getOriginalFilename(), extension));

                TaskFileId taskFileId = new TaskFileId(taskId, savedFile.getFileId());
                TaskFile taskFile = new TaskFile(taskFileId, task, savedFile);
                taskFileRepository.save(taskFile);
                filesMeta = new FileDTO(savedFile.getFileId(), savedFile.getFilename(), savedFile.getFiletype(), savedFile.getUploadedDate());
            }
            return filesMeta;
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    public List<FileDTO> getStudentTaskFilesMeta(Long taskId, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id" + studentId + " not found"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));
        List<FileDTO> result = new ArrayList<>();

        studentTaskFileRepository.findAllByStudentIdAndTaskId(student, task).forEach(file -> {
            result.add(
                    new FileDTO(file.getFileId().getFileId(), file.getFileId().getFilename(), file.getFileId().getFiletype(), file.getFileId().getUploadedDate())
            );
        });

        return result;
    }

    @Transactional
    public void deleteStudentTaskFile(Long studentId, Long taskId, Long fileId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id" + studentId + " not found"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new FileNotFoundException("File with id " + fileId + " not found"));

        StudentTaskFile studentTaskFile = studentTaskFileRepository.findById(new StudentTaskFileId(studentId, taskId, fileId))
                .orElseThrow(() -> new StudentTaskFileNotFoundException(
                        "StudentTaskFile with id: " + new StudentTaskFileId(studentId, taskId, fileId) + " not found"));

        s3Service.deleteFileByUrl(studentTaskFile.getFileId().getLink());
        studentTaskFileRepository.deleteById(new StudentTaskFileId(studentId, taskId, fileId));
        fileRepository.delete(file);
    }

    public List<TaskFileDTO> getAllFilesByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id" + studentId + " not found"));

        List<TaskFileDTO> result = new ArrayList<>();
        studentTaskFileRepository.findAllByStudentId(student).forEach(
                (taskFile) -> result.add(new TaskFileDTO(taskFile.getTaskId().getTaskId(), taskFile.getFileId().getFileId())));

        return result;
    }

    public List<StudentTaskFileDTO> getAllStudentTaskFilesByTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));

        List<StudentTaskFileDTO> result = new ArrayList<>();

        studentTaskFileRepository.findAllByTaskId(task).forEach(
                (file) -> result.add(new StudentTaskFileDTO(file.getStudentId().getStudentId(), file.getTaskId().getTaskId(), file.getFileId().getFileId(), file.getFileId().getUploadedDate()))
        );

        return result;
    }

    @Transactional
    public void deleteAllFilesByTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id " + taskId + " not found"));

        taskFileRepository.getFilesByTaskId(task).forEach((file) -> {
                    s3Service.deleteFileByUrl(file.getFileId().getLink());
                    taskFileRepository.delete(file);
                    fileRepository.delete(file.getFileId());
                }
        );

        studentTaskFileRepository.findAllByTaskId(task).forEach((file) -> {
                    s3Service.deleteFileByUrl(file.getFileId().getLink());
                    studentTaskFileRepository.delete(file);
                    fileRepository.delete(file.getFileId());
                }
        );
    }
}

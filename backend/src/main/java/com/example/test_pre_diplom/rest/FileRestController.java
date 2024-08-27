package com.example.test_pre_diplom.rest;


import com.example.test_pre_diplom.entities.File;
import com.example.test_pre_diplom.entities.dto.FileDTO;
import com.example.test_pre_diplom.entities.dto.StudentTaskFileDTO;
import com.example.test_pre_diplom.entities.dto.TaskFileDTO;
import com.example.test_pre_diplom.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = "/v1")
public class FileRestController {
    public final FileService fileService;

    public FileRestController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/tasks/{taskId}/files")
    public List<FileDTO> getAllByTask(@PathVariable Long taskId) {
        return fileService.getFilesByTask(taskId);
    }

    @GetMapping("/files/{fileId}")
    public ResponseEntity<byte[]> getFileContent(@PathVariable Long fileId) {
        // Заглушка: возвращаем содержимое файла из S3
        byte[] fileContent = fileService.getFileContent(fileId);
        if (fileContent == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(fileContent);
        }
    }

    @PostMapping("/tasks/{taskId}/students/{studentId}/files")
    public ResponseEntity<FileDTO> saveStudentTaskFileContent(@PathVariable Long taskId, @PathVariable Long studentId, @RequestParam("file") MultipartFile file) {
        FileDTO uploadedFileMeta = fileService.uploadStudentTaskFile(taskId, studentId, file);
        if (uploadedFileMeta != null)
            return ResponseEntity.ok(uploadedFileMeta);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    @PostMapping("/tasks/{taskId}/teach/files")
    public ResponseEntity<FileDTO> saveTaskFileContent(@PathVariable Long taskId, @RequestParam("file") MultipartFile file) {
        FileDTO uploadedFileMeta = fileService.uploadTaskFile(taskId, file);
        if (uploadedFileMeta != null)
            return ResponseEntity.ok(uploadedFileMeta);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    @GetMapping("/tasks/{taskId}/students/{studentId}/files")
    public List<FileDTO> getStudentTaskFilesMeta(@PathVariable Long taskId, @PathVariable Long studentId) {
        return fileService.getStudentTaskFilesMeta(taskId, studentId);
    }

    @DeleteMapping("/tasks/{taskId}/students/{studentId}/files/{filesId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudentTaskFile(@PathVariable Long taskId, @PathVariable Long studentId, @PathVariable Long filesId) {
        fileService.deleteStudentTaskFile(studentId, taskId, filesId);
    }

    @GetMapping("/student/{studentId}/files")
    public List<TaskFileDTO> getListOfAllFilesByStudent(@PathVariable Long studentId) {
        return fileService.getAllFilesByStudent(studentId);
    }

    @GetMapping("/tasks/{taskId}/students/files")
    public List<StudentTaskFileDTO> getAllStudentTaskFilesByTask(@PathVariable Long taskId) {
        return fileService.getAllStudentTaskFilesByTask(taskId);
    }
}

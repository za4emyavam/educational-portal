package com.example.test_pre_diplom.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@Data
@AllArgsConstructor
public class SubjectInfoDTO {
    private Long subjectId;
    private String name;
    private Long teacherId;
    private String teacherFirstName;
    private String teacherLastName;
    private String teacherPatronymicName;
    private List<StudyGroupDTO> groupsList;
}

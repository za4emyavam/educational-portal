package com.example.test_pre_diplom.entities.dto;

import com.example.test_pre_diplom.entities.PersonalData;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RenewInfoDTO {
    private Long taskId;
    private String taskTitle;
    private Long subjectId;
    private String subjectName;
    private Long studentId;
    private String studentFirstname;
    private String studentSurname;
    private String studentPatronymic;
    private Integer maxScore;
    private ScoreDTO scoreDTO;
    private LocalDateTime lastUpdated;
    private TypeRenew type;

    public RenewInfoDTO(Long taskId, String taskTitle, Long subjectId, String subjectName, Long studentId, Integer maxScore, PersonalData personalData, LocalDateTime lastUpdated, TypeRenew type) {
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.studentId = studentId;
        this.maxScore = maxScore;
        this.studentFirstname = personalData.getFirstName();
        this.studentSurname = personalData.getLastName();
        this.studentPatronymic = personalData.getPatronymic();
        this.lastUpdated = lastUpdated;
        this.type = type;
    }

    public enum TypeRenew {
        TASK, MESSAGE
    }
}

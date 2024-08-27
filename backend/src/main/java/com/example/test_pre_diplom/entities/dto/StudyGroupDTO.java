package com.example.test_pre_diplom.entities.dto;

import com.example.test_pre_diplom.entities.StudyGroup;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudyGroupDTO {
    private Long groupId;
    private String groupName;
    private Integer yearOfStudy;
    private MajorDTO major;

    public StudyGroupDTO(StudyGroup studyGroup, MajorDTO major) {
        this.groupId = studyGroup.getGroupId();
        this.groupName = studyGroup.getName();
        this.yearOfStudy = studyGroup.getYearOfStudy();
        this.major = major;
    }
}

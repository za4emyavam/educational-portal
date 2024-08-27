package com.example.test_pre_diplom.entities.dto;

import com.example.test_pre_diplom.entities.Major;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MajorDTO {
    private Long majorId;
    private String name;
    private Long facultyId;
    private String facultyName;

    public MajorDTO(Major major) {
        this.majorId = major.getMajorId();
        this.name = major.getName();
        this.facultyId = major.getFaculty().getFacultyId();
        this.facultyName = major.getFaculty().getName();
    }
}

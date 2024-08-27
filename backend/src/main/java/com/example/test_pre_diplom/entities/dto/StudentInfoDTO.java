package com.example.test_pre_diplom.entities.dto;

import com.example.test_pre_diplom.entities.Student;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StudentInfoDTO {
    private Long studentId;
    private String firstname;
    private String lastname;
    private String patronymic;
    private String email;
    private MajorDTO major;
    private Long groupId;
    private String groupName;
    private Integer yearOfStudy;

    public StudentInfoDTO(Student student) {
        this.studentId = student.getStudentId();
        this.firstname = student.getPersonalData().getFirstName();
        this.lastname = student.getPersonalData().getLastName();
        this.patronymic = student.getPersonalData().getPatronymic();
        this.email = student.getPersonalData().getMember().getEmail();
        this.major = new MajorDTO(student.getGroupId().getMajor());
        this.groupId = student.getGroupId().getGroupId();
        this.groupName = student.getGroupId().getName();
        this.yearOfStudy = student.getGroupId().getYearOfStudy();
    }
}

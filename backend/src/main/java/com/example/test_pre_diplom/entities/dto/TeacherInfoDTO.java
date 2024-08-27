package com.example.test_pre_diplom.entities.dto;

import com.example.test_pre_diplom.entities.Teacher;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TeacherInfoDTO {
    private Long teacherId;
    private String firstname;
    private String lastname;
    private String patronymic;
    private String email;

    public TeacherInfoDTO(Teacher teacher) {
        this.teacherId = teacher.getTeacherId();
        this.firstname = teacher.getPersonalData().getFirstName();
        this.lastname = teacher.getPersonalData().getLastName();
        this.patronymic = teacher.getPersonalData().getPatronymic();
        this.email = teacher.getPersonalData().getMember().getEmail();
    }
}

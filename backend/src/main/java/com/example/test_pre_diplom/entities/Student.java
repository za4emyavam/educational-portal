package com.example.test_pre_diplom.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Entity
public class Student implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private Long studentId;

    @OneToOne
    @MapsId("dataId")
    @JoinColumn(name = "student_id")
    private PersonalData personalData;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "groupId")
    private StudyGroup groupId;

}

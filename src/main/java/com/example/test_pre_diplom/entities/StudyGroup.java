package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

//TODO validation
//TODO переделать, почему факультет привязан к группе. Может нужно кафедру, а может вынести на уровень студента -_-
@Data
@Entity
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String name;

    private Integer yearOfStudy;

    @ManyToOne
    @JoinColumn(name = "faculty", referencedColumnName = "facultyId")
    private Faculty faculty;
}

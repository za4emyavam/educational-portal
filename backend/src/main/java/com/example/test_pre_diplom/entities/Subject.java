package com.example.test_pre_diplom.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subjectId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "main_teacher")
    private Teacher mainTeacher;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "subject_study_group",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private Set<StudyGroup> studyGroups;
}

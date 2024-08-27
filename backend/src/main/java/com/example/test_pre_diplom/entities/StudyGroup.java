package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "major")
    private Major major;

    private Integer yearOfStudy;
}

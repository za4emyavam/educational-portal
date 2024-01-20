package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long facultyId;
    private String name;
    private String description;

    /*@JsonIgnore
    @ManyToOne
    private Teacher teacher;*/
}

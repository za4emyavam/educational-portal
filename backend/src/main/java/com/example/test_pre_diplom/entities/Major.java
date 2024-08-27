package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Entity
@NoArgsConstructor
public class Major {

    @Id
    @Column(name = "major_id")
    private Long majorId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "faculty_id", referencedColumnName = "facultyId")
    private Faculty faculty;

    public Major(Long majorId, String name, Faculty faculty) {
        this.majorId = majorId;
        this.name = name;
        this.faculty = faculty;
    }
}

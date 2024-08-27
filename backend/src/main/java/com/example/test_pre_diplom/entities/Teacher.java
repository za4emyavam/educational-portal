package com.example.test_pre_diplom.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    private Long teacherId;

    @OneToOne
    @MapsId("dataId")
    @JoinColumn(name = "teacher_id")
    private PersonalData personalData;
}

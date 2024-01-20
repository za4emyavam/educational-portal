package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "groupId")
    private StudyGroup groupId;

    private LocalDate yearOfEntry;

    @OneToOne
    @JoinColumn(name = "member", referencedColumnName = "memberId")
    private Member member;
}

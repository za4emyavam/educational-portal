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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "groupId")
    private StudyGroup groupId;

    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate yearOfEntry;

    @OneToOne
    @JoinColumn(name = "member", referencedColumnName = "memberId")
    private Member member;
}

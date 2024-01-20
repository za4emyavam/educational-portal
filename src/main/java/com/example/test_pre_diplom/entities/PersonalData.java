package com.example.test_pre_diplom.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class PersonalData {
    //TODO: validation
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dataId;

    @OneToOne
    @JoinColumn(name = "member", referencedColumnName = "memberId")
    @JsonIgnore
    private Member member;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phoneNumber;
}

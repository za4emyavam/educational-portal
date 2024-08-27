package com.example.test_pre_diplom.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
public class Member {
    //TODO: validation
    /*memberId
    * email
    * passwordHash
    * role
    * */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;
    private String email;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "role_type")
    private RoleType role;

    @OneToOne(mappedBy = "member")
    @JsonIgnore
    private PersonalData personalData;

    @OneToOne(mappedBy = "member")
    @JsonIgnore
    private Student student;

    public enum RoleType {
        STUDENT, TEACHER, ADMIN
    }
}

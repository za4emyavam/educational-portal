package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;

    @OneToOne
    // @JsonIgnore <-- must have
    @JoinColumn(name = "member", referencedColumnName = "memberId")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "faculty", referencedColumnName = "facultyId")
    private Faculty faculty;

    /*
    * Maybe more info about teacher (year of start,  etc.)
    * */
}

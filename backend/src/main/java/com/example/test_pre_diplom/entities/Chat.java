package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Generated;

import java.time.LocalDateTime;

@Data
@Entity
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task taskId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student studentId;

    @ManyToOne
    @JoinColumn(name = "sender")
    private PersonalData sender;

    @Generated
    private LocalDateTime sentDate;

    private String message;
}

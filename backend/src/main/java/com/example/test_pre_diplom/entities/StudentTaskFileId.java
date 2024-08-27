package com.example.test_pre_diplom.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class StudentTaskFileId {
    private Long studentId;
    private Long taskId;
    private Long fileId;
}

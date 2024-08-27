package com.example.test_pre_diplom.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class TaskFileId implements Serializable {
    private Long taskId;
    private Long fileId;
}

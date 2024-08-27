package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class StudentTaskFile {
    @EmbeddedId
    private StudentTaskFileId studentTaskFileId;

    /*@ManyToOne(cascade = CascadeType.ALL)
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private Student studentId;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task taskId;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("fileId")
    @JoinColumn(name = "file_id")
    private File fileId;*/

    @ManyToOne()
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private Student studentId;

    @ManyToOne()
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task taskId;

    @ManyToOne()
    @MapsId("fileId")
    @JoinColumn(name = "file_id")
    private File fileId;
}

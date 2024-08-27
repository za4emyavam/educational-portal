package com.example.test_pre_diplom.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.Generated;

import java.time.LocalDateTime;

@Data
@Entity
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;
    private String link;
    private String filename;
    private String filetype;
    @Generated
    private LocalDateTime uploadedDate;

    public File(String link, String filename, String filetype) {
        this.link = link;
        this.filename = filename;
        this.filetype = filetype;
    }

    public File() {

    }
}

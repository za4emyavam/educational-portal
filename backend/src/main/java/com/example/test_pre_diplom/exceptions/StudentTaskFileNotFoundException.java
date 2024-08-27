package com.example.test_pre_diplom.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class StudentTaskFileNotFoundException extends RuntimeException {
    public StudentTaskFileNotFoundException(String s) {
        super(s);
    }
}

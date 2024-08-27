package com.example.test_pre_diplom.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class GradedTaskNotFound extends RuntimeException {
    public GradedTaskNotFound(String message) {
        super(message);
    }
}

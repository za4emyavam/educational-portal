package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatCreateDTO {
    @NotNull(message = "Потрібен відправник")
    @Min(value = 1, message = "Потрібен валідний відправник")
    private Long sender;

    @NotEmpty(message = "Потрібен текст повідомлення")
    private String message;
}

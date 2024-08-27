package com.example.test_pre_diplom.entities.dto;

import com.example.test_pre_diplom.entities.Chat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatDTO {
    private Long chatId;
    private Long sender;
    private String firstname;
    private String lastname;
    private String patronymic;
    private LocalDateTime sentDate;
    private String message;

    public ChatDTO(Chat chat) {
        this.chatId = chat.getChatId();
        this.sender = chat.getSender().getDataId();
        this.firstname = chat.getSender().getFirstName();
        this.lastname = chat.getSender().getLastName();
        this.patronymic = chat.getSender().getPatronymic();
        this.sentDate = chat.getSentDate();
        this.message = chat.getMessage();
    }
}

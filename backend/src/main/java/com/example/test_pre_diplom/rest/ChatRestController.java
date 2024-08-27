package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.dto.ChatCreateDTO;
import com.example.test_pre_diplom.entities.dto.ChatDTO;
import com.example.test_pre_diplom.entities.dto.MajorDTO;
import com.example.test_pre_diplom.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class ChatRestController {
    private final ChatService chatService;

    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/tasks/{taskId}/students/{studentId}/chat")
    public List<ChatDTO> getChatsByTaskAndStudent(@PathVariable Long taskId, @PathVariable Long studentId) {
        return chatService.getAllByTaskAndStudent(taskId, studentId);
    }

    @PostMapping("/tasks/{taskId}/students/{studentId}/chat")
    public ResponseEntity<?> saveChat(@PathVariable Long taskId, @PathVariable Long studentId,
                            @Valid @RequestBody ChatCreateDTO chatCreateDTO,
                            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        ChatDTO chatDTO = chatService.save(taskId, studentId, chatCreateDTO);

        return chatDTO != null ? new ResponseEntity<>(chatDTO, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}

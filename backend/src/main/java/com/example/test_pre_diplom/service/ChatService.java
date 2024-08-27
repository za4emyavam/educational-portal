package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.ChatRepository;
import com.example.test_pre_diplom.data.PersonalDataRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.TaskRepository;
import com.example.test_pre_diplom.entities.Chat;
import com.example.test_pre_diplom.entities.PersonalData;
import com.example.test_pre_diplom.entities.Task;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.dto.ChatCreateDTO;
import com.example.test_pre_diplom.entities.dto.ChatDTO;
import com.example.test_pre_diplom.exceptions.PersonalDataNotFoundException;
import com.example.test_pre_diplom.exceptions.StudentNotFoundException;
import com.example.test_pre_diplom.exceptions.TaskNotFound;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final TaskRepository taskRepository;
    private final StudentRepository studentRepository;
    private final PersonalDataRepository personalDataRepository;

    public ChatService(ChatRepository chatRepository, TaskRepository taskRepository, StudentRepository studentRepository, PersonalDataRepository personalDataRepository) {
        this.chatRepository = chatRepository;
        this.taskRepository = taskRepository;
        this.studentRepository = studentRepository;
        this.personalDataRepository = personalDataRepository;
    }

    public List<ChatDTO> getAllByTaskAndStudent(Long taskId, Long studentId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id: " + taskId + " not found."));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        List<ChatDTO> result = new ArrayList<>();

        chatRepository.findAllByTaskIdAndStudentId(task, student).stream()
                .sorted(Comparator.comparing(Chat::getSentDate))
                .toList().forEach(chat -> result.add(new ChatDTO(chat)));

        return result;
    }

    public ChatDTO save(Long taskId, Long studentId, ChatCreateDTO chatCreateDTO) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id: " + taskId + " not found."));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        PersonalData personalData = personalDataRepository.findById(chatCreateDTO.getSender())
                .orElseThrow(() -> new PersonalDataNotFoundException("PData with id: " + chatCreateDTO.getSender() + " not found."));

        Chat chat = new Chat();
        chat.setTaskId(task);
        chat.setStudentId(student);
        chat.setSender(personalData);
        chat.setMessage(chatCreateDTO.getMessage());

        Chat savedChat = chatRepository.save(chat);
        return new ChatDTO(savedChat);
    }
}

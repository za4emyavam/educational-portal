package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.Schedule;
import com.example.test_pre_diplom.entities.dto.ScheduleCreateDTO;
import com.example.test_pre_diplom.entities.dto.ScheduleDeleteDTO;
import com.example.test_pre_diplom.service.ScheduleService;
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
public class ScheduleRestController {
    private final ScheduleService scheduleService;

    public ScheduleRestController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/schedules/{groupId}")
    public Map<Integer, List<Schedule>> getSchedulesByGroup(@PathVariable Long groupId) {
        return scheduleService.getByGroupId(groupId);
    }

    @GetMapping("/schedules/student/{studentId}")
    public Map<Integer, List<Schedule>> getScheduleByStudentId(@PathVariable Long studentId) {
        return scheduleService.getByStudentId(studentId);
    }

    @PostMapping("/schedules/{studentGroupId}")
    public ResponseEntity<?> saveSchedule(@PathVariable Long studentGroupId,
                                          @Valid @RequestBody ScheduleCreateDTO scheduleCreateDTO,
                                          BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        Schedule savedSchedule = scheduleService.save(studentGroupId, scheduleCreateDTO);

        return savedSchedule == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) : new ResponseEntity<>(savedSchedule, HttpStatus.CREATED);
    }

    @DeleteMapping("/schedules/{studyGroupId}")
    public void delete(@PathVariable Long studyGroupId, @RequestParam Integer day, @RequestParam Integer number) {
        scheduleService.delete(studyGroupId, new ScheduleDeleteDTO(day, number));
    }

    /*@GetMapping("/schedules/student/{studentId}")
    public List<Schedule> getScheduleByStudentId(@PathVariable Long studentId) {
        return scheduleService.getByStudentId(studentId);
    }*/
}

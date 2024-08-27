package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.ScheduleRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.StudyGroupRepository;
import com.example.test_pre_diplom.data.SubjectRepository;
import com.example.test_pre_diplom.entities.Schedule;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.entities.Subject;
import com.example.test_pre_diplom.entities.dto.ScheduleCreateDTO;
import com.example.test_pre_diplom.entities.dto.ScheduleDTO;
import com.example.test_pre_diplom.entities.dto.ScheduleDeleteDTO;
import com.example.test_pre_diplom.exceptions.StudentNotFoundException;
import com.example.test_pre_diplom.exceptions.StudyGroupNotFoundException;
import com.example.test_pre_diplom.exceptions.SubjectNotFoundException;
import org.springframework.data.web.config.SortHandlerMethodArgumentResolverCustomizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, StudyGroupRepository studyGroupRepository, StudentRepository studentRepository, SubjectRepository subjectRepository) {
        this.scheduleRepository = scheduleRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    public List<Schedule> getAll() {
        return scheduleRepository.findAll();
    }

    public Map<Integer, List<Schedule>> getByGroupId(Long groupId) {
        StudyGroup group =  studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("Group with id: " + groupId + " not found."));
        List<Schedule> schedules = scheduleRepository.findAllByGroupId(group);
        System.out.println(schedules);
        return refactorData(schedules);
    }

    public Map<Integer, List<Schedule>> getByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        return refactorData(scheduleRepository.findAllByGroupId(student.getGroupId()));
    }

    public Schedule save(Long groupId, ScheduleCreateDTO scheduleDTO) {
        StudyGroup studyGroup = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("Group with id: " + groupId + " not found."));

        Subject subject = subjectRepository.findById(scheduleDTO.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + scheduleDTO.getSubjectId() + " not found."));

        Schedule schedule = new Schedule();
        schedule.setGroupId(studyGroup);
        schedule.setSubjectId(subject);
        schedule.setDay(scheduleDTO.getDay());
        schedule.setNumber(scheduleDTO.getNumber());
        schedule.setClassType(Schedule.ClassType.valueOf(scheduleDTO.getClassType()));

        return scheduleRepository.save(schedule);
    }

    @Transactional
    public void delete(Long studyGroupId, ScheduleDeleteDTO scheduleDeleteDTO) {
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("Group with id: " + studyGroupId + " not found."));

        scheduleRepository.deleteByGroupIdAndDayAndNumber(studyGroup, scheduleDeleteDTO.getDay(), scheduleDeleteDTO.getNumber());
    }

    private Map<Integer, List<Schedule>> refactorData(List<Schedule> schedules) {
        //grouping by number
        Map<Integer, List<Schedule>> sortedByNumber =
                schedules.stream().collect(Collectors.groupingBy(Schedule::getNumber));

        //sorting by day
        sortedByNumber.values().forEach((l) -> l.sort(Comparator.comparingInt(Schedule::getDay)));

        return sortedByNumber;
    }
}

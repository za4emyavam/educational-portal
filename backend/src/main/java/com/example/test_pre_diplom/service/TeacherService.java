package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.*;
import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.RenewInfoDTO;
import com.example.test_pre_diplom.entities.dto.ScoreDTO;
import com.example.test_pre_diplom.entities.dto.TeacherCreateDTO;
import com.example.test_pre_diplom.entities.dto.TeacherInfoDTO;
import com.example.test_pre_diplom.exceptions.AccessDeniedException;
import com.example.test_pre_diplom.exceptions.TeacherNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final StudentTaskFileRepository studentTaskFileRepository;
    private final ScoreRepository scoreRepository;
    private final PersonalDataRepository personalDataRepository;
    private final MemberService memberService;
    private final ChatRepository chatRepository;

    public TeacherService(TeacherRepository teacherRepository, SubjectRepository subjectRepository, StudentRepository studentRepository, StudentTaskFileRepository studentTaskFileRepository, ScoreRepository scoreRepository, PersonalDataRepository personalDataRepository, MemberService memberService, ChatRepository chatRepository) {
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.studentTaskFileRepository = studentTaskFileRepository;
        this.scoreRepository = scoreRepository;
        this.personalDataRepository = personalDataRepository;
        this.memberService = memberService;
        this.chatRepository = chatRepository;
    }

    public List<TeacherInfoDTO> getAllTeachers() {
        List<TeacherInfoDTO> teachers = new ArrayList<>();

        teacherRepository.findAll(Sort.by("teacherId")).forEach((teacher) -> teachers.add(new TeacherInfoDTO(teacher)));

        return teachers;
    }

    public TeacherInfoDTO getTeacherById(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(
                () -> new TeacherNotFoundException("Teacher with id: " + teacherId + " not found")
        );

        return new TeacherInfoDTO(teacher);
    }

    @Transactional
    public void deleteTeacher(Long teacherId) {
        teacherRepository.deleteById(teacherId);
    }

    public List<RenewInfoDTO> getAllRenewInfo(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + teacherId + " not found."));

        List<Subject> subjects = subjectRepository.findAllByMainTeacher(teacher);
        List<Student> students = new ArrayList<>();

        for (Subject subject : subjects) {
            List<Student> studentsInSubject = subject.getStudyGroups().stream()
                    .flatMap(group -> studentRepository.findAllByGroupId(group).stream())
                    .toList();
            students.addAll(studentsInSubject);
        }

        List<StudentTaskFile> studentTaskFiles = students.stream()
                .flatMap(student -> studentTaskFileRepository.findAllByStudentId(student).stream())
                .toList();

        Map<String, RenewInfoDTO> renewInfoMap = studentTaskFiles.stream()
                .collect(Collectors.toMap(
                        stf -> stf.getStudentId().getStudentId() + "-" + stf.getTaskId().getTaskId(),
                        stf -> new RenewInfoDTO(
                                stf.getTaskId().getTaskId(), stf.getTaskId().getTitle(), stf.getTaskId().getSubjectId().getSubjectId(),
                                stf.getTaskId().getSubjectId().getName(), stf.getStudentId().getStudentId(),
                                stf.getTaskId().getGradedTask().getMaxScore(), stf.getStudentId().getPersonalData(),
                                stf.getFileId().getUploadedDate(), RenewInfoDTO.TypeRenew.TASK
                        ),
                        (existing, replacement) -> {
                            if (existing.getLastUpdated().isBefore(replacement.getLastUpdated())) {
                                return replacement;
                            } else {
                                return existing;
                            }
                        }
                ));

        List <RenewInfoDTO> renewInfos = new ArrayList<>(renewInfoMap.values());

        List<Chat> studentsChat = students.stream()
                .flatMap(student -> chatRepository.findAllByStudentId(student).stream())
                .toList();

        renewInfoMap = studentsChat.stream().collect(
                Collectors.toMap(
                        chat -> chat.getStudentId().getStudentId() + "-" + chat.getTaskId().getTaskId(),
                        chat -> new RenewInfoDTO(chat.getTaskId().getTaskId(), chat.getTaskId().getTitle(), chat.getTaskId().getSubjectId().getSubjectId(),
                                chat.getTaskId().getSubjectId().getName(), chat.getStudentId().getStudentId(),
                                chat.getTaskId().getGradedTask() == null ? null : chat.getTaskId().getGradedTask().getMaxScore(), chat.getStudentId().getPersonalData(),
                                chat.getSentDate(), RenewInfoDTO.TypeRenew.MESSAGE),
                        (existing, replacement) -> {
                            if (existing.getLastUpdated().isBefore(replacement.getLastUpdated())) {
                                return replacement;
                            } else {
                                return existing;
                            }
                        }
                )
        );

        renewInfos.addAll(renewInfoMap.values());

        return getRenewInfoDTOS(renewInfos);
    }

    @Transactional
    public Teacher save(TeacherCreateDTO teacherCreateDTO) {
        Member member = memberService.save(teacherCreateDTO.getEmail(), teacherCreateDTO.getPassword(),
                Member.RoleType.TEACHER);

        PersonalData personalData = new PersonalData();
        personalData.setMember(member);
        personalData.setFirstName(teacherCreateDTO.getFirstName());
        personalData.setLastName(teacherCreateDTO.getLastName());
        personalData.setPatronymic(teacherCreateDTO.getPatronymic());

        PersonalData savedPersonalData = personalDataRepository.save(personalData);

        Teacher teacher = new Teacher();
        teacher.setTeacherId(savedPersonalData.getDataId());

        return teacherRepository.save(teacher);
    }

    private List<RenewInfoDTO> getRenewInfoDTOS(List<RenewInfoDTO> renewInfoMap) {
        List<RenewInfoDTO> res = new ArrayList<>(renewInfoMap);
        res.forEach((renewInfoDTO) -> {
            ScoreId scoreId = new ScoreId(renewInfoDTO.getTaskId(), renewInfoDTO.getStudentId());
            Optional<Score> score = scoreRepository.findById(scoreId);
            score.ifPresent(value -> renewInfoDTO.setScoreDTO(
                    new ScoreDTO(value.getStudentId().getStudentId(), value.getTaskId().getTaskId(),
                            value.getScoreValue(), value.getEvaluationDate())));
        });
        return res.stream()
                .sorted(Comparator.comparing(RenewInfoDTO::getLastUpdated).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public TeacherInfoDTO update(Long teacherId, TeacherCreateDTO teacherCreateDTO) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + teacherId + " not found."));

        if (!teacher.getPersonalData().getMember().getEmail().equals(teacherCreateDTO.getEmail())) {
            if (memberService.isExistsByEmail(teacherCreateDTO.getEmail())) {
                throw new AccessDeniedException("User with this email already exists");
            }
            Member member = new Member();
            member.setEmail(teacherCreateDTO.getEmail());
            member.setRole(Member.RoleType.TEACHER);
            member.setPasswordHash(teacher.getPersonalData().getMember().getPasswordHash());
            teacher.getPersonalData().setMember(memberService.update(member));
        }

        PersonalData personalData = new PersonalData();
        personalData.setDataId(teacher.getPersonalData().getDataId());
        personalData.setFirstName(teacherCreateDTO.getFirstName());
        personalData.setLastName(teacherCreateDTO.getLastName());
        personalData.setPatronymic(teacherCreateDTO.getPatronymic());
        personalData.setMember(teacher.getPersonalData().getMember());

        teacher.setPersonalData(personalDataRepository.save(personalData));

        return new TeacherInfoDTO(teacher);
    }
}

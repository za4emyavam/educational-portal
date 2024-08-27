package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.*;
import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.*;
import com.example.test_pre_diplom.exceptions.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final StudentTaskFileRepository studentTaskFileRepository;
    private final ScoreRepository scoreRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final FileService fileService;
    private final ChatRepository chatRepository;

    public SubjectService(SubjectRepository subjectRepository, TeacherRepository teacherRepository, StudentRepository studentRepository, StudentTaskFileRepository studentTaskFileRepository, ScoreRepository scoreRepository, StudyGroupRepository studyGroupRepository, FileService fileService, ChatRepository chatRepository) {
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.studentTaskFileRepository = studentTaskFileRepository;
        this.scoreRepository = scoreRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.fileService = fileService;
        this.chatRepository = chatRepository;
    }


    public List<SubjectInfoDTO> getAllSubjects() {
        List<SubjectInfoDTO> allSubjects = new ArrayList<>();
        subjectRepository.findAll().forEach((subject) -> {
                    List<StudyGroupDTO> studyGroupDTOS = new ArrayList<>();
                    subject.getStudyGroups().forEach(
                            (studyGroup) -> studyGroupDTOS.add(
                                    new StudyGroupDTO(studyGroup, new MajorDTO(studyGroup.getMajor())
                                    )));
                    allSubjects.add(new SubjectInfoDTO(subject.getSubjectId(), subject.getName(), subject.getMainTeacher().getTeacherId(),
                            subject.getMainTeacher().getPersonalData().getFirstName(),
                            subject.getMainTeacher().getPersonalData().getLastName(),
                            subject.getMainTeacher().getPersonalData().getPatronymic(),
                            studyGroupDTOS));
                }
        );
        return allSubjects;
    }

    public SubjectInfoDTO getSubjectById(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found."));

        if (isDeniedForStudent(subject) || isDeniedForTeacher(subject)) {
            throw new AccessDeniedException("Access denied");
        }

        List<StudyGroupDTO> studyGroupDTOS = new ArrayList<>();
        subject.getStudyGroups().forEach(
                (studyGroup) -> studyGroupDTOS.add(
                        new StudyGroupDTO(studyGroup, new MajorDTO(studyGroup.getMajor())
                        )));

        return new SubjectInfoDTO(subject.getSubjectId(), subject.getName(), subject.getMainTeacher().getTeacherId(),
                subject.getMainTeacher().getPersonalData().getFirstName(),
                subject.getMainTeacher().getPersonalData().getLastName(),
                subject.getMainTeacher().getPersonalData().getPatronymic(),
                studyGroupDTOS
        );
    }

    public Subject saveSubject(SubjectCreateDTO subject) {
        Teacher teacher = teacherRepository.findById(subject.getTeacherId())
                .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + subject.getTeacherId() + "not found"));

        Subject savedSubject = new Subject();
        savedSubject.setName(subject.getName());
        savedSubject.setMainTeacher(teacher);
        Set<StudyGroup> studyGroups = new HashSet<>();
        subject.getGroups().forEach((groupId) -> studyGroups.add(
                studyGroupRepository.findById(groupId)
                        .orElseThrow(() -> new StudyGroupNotFoundException("StudyGroup with id: " + groupId + "not found"))
        ));
        savedSubject.setStudyGroups(studyGroups);

        return subjectRepository.save(savedSubject);
    }

    @Transactional
    public Subject putSubject(Long subjectIdd, SubjectCreateDTO subjectCreateDTO) {
        Subject subject = subjectRepository.findById(subjectIdd)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectIdd + "not found"));

        Teacher teacher = teacherRepository.findById(subjectCreateDTO.getTeacherId())
                .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + subjectCreateDTO.getTeacherId() + "not found"));


        Set<StudyGroup> studyGroups = new HashSet<>();
        subjectCreateDTO.getGroups().forEach((groupId) -> studyGroups.add(
                studyGroupRepository.findById(groupId)
                        .orElseThrow(() -> new StudyGroupNotFoundException("StudyGroup with id: " + groupId + "not found"))
        ));

        subject.getStudyGroups().forEach((group) -> {
            if (!subjectCreateDTO.getGroups().contains(group.getGroupId()) || !Objects.equals(teacher.getTeacherId(), subject.getMainTeacher().getTeacherId())) {
                deleteStudFilesAndScore(group);
            }
        });
        subject.setName(subjectCreateDTO.getName());
        subject.setMainTeacher(teacher);
        subject.setStudyGroups(studyGroups);

        return subjectRepository.save(subject);
    }

    @Transactional
    public void deleteSubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + "not found"));

        subject.getStudyGroups().forEach(this::deleteStudFilesAndScore);

        subjectRepository.deleteById(subjectId);
    }

    private void deleteStudFilesAndScore(StudyGroup group) {
        List<Student> students = studentRepository.findAllByGroupId(group);
        students.forEach((student) -> {
            List<StudentTaskFile> studentTaskFiles = studentTaskFileRepository.findAllByStudentId(student);
            studentTaskFiles.forEach(
                    (studentTaskFile ->
                            fileService.deleteStudentTaskFile(student.getStudentId(), studentTaskFile.getTaskId().getTaskId(), studentTaskFile.getFileId().getFileId())));

            scoreRepository.deleteAllByStudentId(student);
        });
    }

    //TODO TEACHER ONLY
    public Set<StudyGroup> getStudyGroupsForSubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow(
                () -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found."));

        if (isDeniedForTeacher(subject))
            throw new AccessDeniedException("Access denied");

        return subject.getStudyGroups();
    }

    //TODO only for student
    public List<Subject> getAllSubjectsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));
        return subjectRepository.findAllByStudyGroupsContaining(student.getGroupId());
    }

    //TODO only for teacher
    public List<SubjectInfoDTO> getAllSubjectByTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + teacherId + " not found."));

        List<SubjectInfoDTO> result = new ArrayList<>();

        subjectRepository.findAllByMainTeacher(teacher).forEach(
                (subject) -> {
                    List<StudyGroupDTO> studyGroupDTOS = new ArrayList<>();
                    subject.getStudyGroups().forEach(
                            (studyGroup) -> studyGroupDTOS.add(
                                    new StudyGroupDTO(studyGroup, new MajorDTO(studyGroup.getMajor()))));
                    result.add(new SubjectInfoDTO(subject.getSubjectId(), subject.getName(), subject.getMainTeacher().getTeacherId(),
                            subject.getMainTeacher().getPersonalData().getFirstName(),
                            subject.getMainTeacher().getPersonalData().getLastName(),
                            subject.getMainTeacher().getPersonalData().getPatronymic(),
                            studyGroupDTOS
                    ));
                });

        return result;
    }

    //todo only for teacher
    public List<RenewInfoDTO> getRenewInfoBySubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found."));
        List<Student> students = subject.getStudyGroups().stream()
                .flatMap(group -> studentRepository.findAllByGroupId(group).stream())
                .toList();

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

    //TODO teacher only
    public StudentInfoDTO getStudentInSubject(Long subjectId, Long studentId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found."));
        if (isDeniedForTeacher(subject)) {
            throw new AccessDeniedException("Access denied");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        if (!subject.getStudyGroups().contains(student.getGroupId()))
            throw new StudentNotFoundException("Student in subject with id: " + subjectId + " not found.");

        return new StudentInfoDTO(student);
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

    private Collection<? extends GrantedAuthority> getAuthorities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Member member = (Member) authentication.getPrincipal();

        return member.getAuthorities();
    }

    private boolean isDeniedForTeacher(Subject subject) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Member member = (Member) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = getAuthorities();
        if (authorities.size() == 1 && authorities.contains(new SimpleGrantedAuthority("ROLE_TEACHER"))) {
            return !Objects.equals(subject.getMainTeacher().getTeacherId(), member.getMemberId());
        }
        return false;
    }

    private boolean isDeniedForStudent(Subject subject) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Member member = (Member) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = getAuthorities();
        if (authorities.size() == 1 && authorities.contains(new SimpleGrantedAuthority("ROLE_STUDENT"))) {
            Student student = studentRepository.findById(member.getMemberId()).get();
            return !subject.getStudyGroups().contains(student.getGroupId());
        }
        return false;
    }

    public List<SubjectInfoDTO> getAllSubjectsByStudentGroup(Long studyGroupId) {
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("StudyGroup with id: " + studyGroupId + " not found."));

        List<SubjectInfoDTO> subjectInfoDTOS = new ArrayList<>();
        subjectRepository.findAllByStudyGroupsContaining(studyGroup).forEach((subject) -> {
                    List<StudyGroupDTO> studyGroupDTOS = new ArrayList<>();
                    subject.getStudyGroups().forEach(
                            (group) -> studyGroupDTOS.add(
                                    new StudyGroupDTO(group, new MajorDTO(group.getMajor())
                                    )));
            subjectInfoDTOS.add(new SubjectInfoDTO(subject.getSubjectId(), subject.getName(), subject.getMainTeacher().getTeacherId(),
                            subject.getMainTeacher().getPersonalData().getFirstName(),
                            subject.getMainTeacher().getPersonalData().getLastName(),
                            subject.getMainTeacher().getPersonalData().getPatronymic(),
                            studyGroupDTOS));
                }
        );
        return subjectInfoDTOS;
    }
}
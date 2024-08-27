package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.*;
import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.StudentCreateDTO;
import com.example.test_pre_diplom.entities.dto.StudentInfoDTO;
import com.example.test_pre_diplom.exceptions.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final PersonalDataRepository personalDataRepository;
    private final MemberService memberService;
    private final StudentTaskFileRepository studentTaskFileRepository;
    private final FileService fileService;
    private final ScoreRepository scoreRepository;

    public StudentService(StudentRepository studentRepository, StudyGroupRepository studyGroupRepository, PersonalDataRepository personalDataRepository, MemberService memberService, StudentTaskFileRepository studentTaskFileRepository, FileService fileService, ScoreRepository scoreRepository) {
        this.studentRepository = studentRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.personalDataRepository = personalDataRepository;
        this.memberService = memberService;
        this.studentTaskFileRepository = studentTaskFileRepository;
        this.fileService = fileService;
        this.scoreRepository = scoreRepository;
    }

    public List<StudentInfoDTO> getAllStudents() {
        List<StudentInfoDTO> students = new ArrayList<>();

        studentRepository.findAll(Sort.by("studentId")).forEach((student -> students.add(new StudentInfoDTO(student))));

        return students;
    }

    public StudentInfoDTO getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));
        return new StudentInfoDTO(student);
    }

    @Transactional
    public Student save(StudentCreateDTO studentCreateDTO) {
        StudyGroup studyGroup = studyGroupRepository.findById(studentCreateDTO.getGroupId())
                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id:" + studentCreateDTO.getGroupId() + " not found."));

        Member member = memberService.save(studentCreateDTO.getEmail(), studentCreateDTO.getPassword(),
                Member.RoleType.STUDENT);

        PersonalData personalData = new PersonalData();
        personalData.setMember(member);
        personalData.setFirstName(studentCreateDTO.getFirstName());
        personalData.setLastName(studentCreateDTO.getLastName());
        personalData.setPatronymic(studentCreateDTO.getPatronymic());

        PersonalData savedPersonalData = personalDataRepository.save(personalData);

        Student student = new Student();
        student.setStudentId(savedPersonalData.getDataId());
        student.setGroupId(studyGroup);


        return studentRepository.save(student);
    }

    @Transactional
    public StudentInfoDTO update(Long studentId, StudentCreateDTO studentCreateDTO) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        StudyGroup studyGroup = studyGroupRepository.findById(studentCreateDTO.getGroupId())
                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id:" + studentCreateDTO.getGroupId() + " not found."));

        if (!student.getPersonalData().getMember().getEmail().equals(studentCreateDTO.getEmail())) {
            if (memberService.isExistsByEmail(studentCreateDTO.getEmail())) {
                throw new AccessDeniedException("User with this email already exists");
            }
            Member member = new Member();
            member.setEmail(studentCreateDTO.getEmail());
            member.setRole(Member.RoleType.STUDENT);
            member.setPasswordHash(student.getPersonalData().getMember().getPasswordHash());
            student.getPersonalData().setMember(memberService.update(member));
        }

        if (!Objects.equals(student.getGroupId().getGroupId(), studentCreateDTO.getGroupId())) {
            List<StudentTaskFile> studentTaskFiles = studentTaskFileRepository.findAllByStudentId(student);
            studentTaskFiles.forEach(
                    (studentTaskFile ->
                            fileService.deleteStudentTaskFile(studentId, studentTaskFile.getTaskId().getTaskId(), studentTaskFile.getFileId().getFileId())));

            scoreRepository.deleteAllByStudentId(student);
        }

        PersonalData personalData = new PersonalData();
        personalData.setDataId(student.getPersonalData().getDataId());
        personalData.setFirstName(studentCreateDTO.getFirstName());
        personalData.setLastName(studentCreateDTO.getLastName());
        personalData.setPatronymic(studentCreateDTO.getPatronymic());
        personalData.setMember(student.getPersonalData().getMember());

        student.setPersonalData(personalDataRepository.save(personalData));

        student.setGroupId(studyGroup);

        return new StudentInfoDTO(studentRepository.save(student));
    }

    @Transactional
    public void delete(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found."));

        List<StudentTaskFile> studentTaskFiles = studentTaskFileRepository.findAllByStudentId(student);
        studentTaskFiles.forEach(
                (studentTaskFile ->
                        fileService.deleteStudentTaskFile(studentId, studentTaskFile.getTaskId().getTaskId(), studentTaskFile.getFileId().getFileId())));

        scoreRepository.deleteAllByStudentId(student);

        studentRepository.delete(student);

    }
}

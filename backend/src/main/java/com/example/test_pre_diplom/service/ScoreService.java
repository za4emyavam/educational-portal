package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.*;
import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.ScoreCreateDTO;
import com.example.test_pre_diplom.entities.dto.ScoreDTO;
import com.example.test_pre_diplom.exceptions.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScoreService {
    private final ScoreRepository scoreRepository;
    private final TaskRepository taskRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    public ScoreService(ScoreRepository scoreRepository, TaskRepository taskRepository, StudentRepository studentRepository, SubjectRepository subjectRepository, TeacherRepository teacherRepository) {
        this.scoreRepository = scoreRepository;
        this.taskRepository = taskRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
    }

    public List<Score> getAllScores() {
        return scoreRepository.findAll();
    }

    public List<Score> getAllScoresByTask(long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id: " + taskId + " not found"));
        return scoreRepository.findAllByTaskId(task);
    }

    public List<Score> getAllScoresByStudentInSubject(Long studentId, Long subjectId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found"));

        return scoreRepository.findAllByStudentIdAndTaskIdSubjectId(student, subject);
    }

    public Score getScoreById(Long studentId, Long taskId) {
        ScoreId scoreId = new ScoreId();
        scoreId.setStudentId(studentId);
        scoreId.setTaskId(taskId);

        return scoreRepository.findById(scoreId)
                .orElse(null);
    }

    public List<Score> getAllScoresByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found"));
        return scoreRepository.findAllByStudentId(student);
    }

    public Score saveScore(ScoreCreateDTO score, Long taskId, Long studentId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFound("Task with id: " + taskId + " not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + studentId + " not found"));

        Teacher teacher = teacherRepository.findById(score.getTeacherId())
                        .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + score.getTeacherId() + " not found"));

        ScoreId scoreId = new ScoreId();
        scoreId.setStudentId(studentId);
        scoreId.setTaskId(taskId);
        Score saveScore = new Score();
        saveScore.setScoreId(scoreId);
        saveScore.setStudentId(student);
        saveScore.setTaskId(task);
        saveScore.setTeacherId(teacher);
        saveScore.setScoreValue(score.getValue());

        //TODO validation of max value of the task

        return scoreRepository.save(saveScore);
    }

    public Score updateScore(Score score, Long taskId, Long studentId) {
        ScoreId scoreId = new ScoreId();
        scoreId.setStudentId(studentId);
        scoreId.setTaskId(taskId);

        Score updatedScore = scoreRepository.findById(scoreId)
                .orElseThrow(() -> new ScoreNotFound("Score with id: (" + taskId + ", " + studentId + ") not found"));

        if (score.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(score.getTeacherId().getTeacherId())
                    .orElseThrow(() -> new TeacherNotFoundException("Teacher with id: " + score.getTeacherId().getTeacherId() + " not found"));
            updatedScore.setTeacherId(teacher);
        }

        if (score.getScoreValue() != 0) {
            updatedScore.setScoreValue(score.getScoreValue());
        }

        return scoreRepository.save(updatedScore);
    }

    public void deleteScore(Long taskId, Long studentId) {
        ScoreId scoreId = new ScoreId();
        scoreId.setStudentId(studentId);
        scoreId.setTaskId(taskId);
        scoreRepository.deleteById(scoreId);
    }

    public List<ScoreDTO> getAllScoresBySubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject with id: " + subjectId + " not found"));

        List<ScoreDTO> scores = new ArrayList<>();

        scoreRepository.findAllByTaskIdSubjectId(subject).forEach((score -> scores.add(new ScoreDTO(
                score.getScoreId().getStudentId(), score.getTaskId().getTaskId(), score.getScoreValue(), score.getEvaluationDate()
        ))));

        return scores;
    }
}

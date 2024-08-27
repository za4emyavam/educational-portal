package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.Score;
import com.example.test_pre_diplom.entities.dto.ScoreCreateDTO;
import com.example.test_pre_diplom.entities.dto.ScoreDTO;
import com.example.test_pre_diplom.service.ScoreService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class ScoreRestController {
    private final ScoreService scoreService;

    public ScoreRestController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping("/scores")
    public List<Score> getScores() {
        return scoreService.getAllScores();
    }

    @GetMapping("/subjects/{subjectId}/tasks/{taskId}/scores")
    public List<Score> allScoresByTask(@PathVariable Long subjectId, @PathVariable Long taskId) {
        return scoreService.getAllScoresByTask(taskId);
    }

    @GetMapping("/subjects/{subjectId}/students/{studentId}/scores")
    public List<Score> allScoresByStudentInSubject(@PathVariable Long subjectId, @PathVariable Long studentId) {
        return scoreService.getAllScoresByStudentInSubject(studentId, subjectId);
    }

    @GetMapping("/subjects/{subjectId}/tasks/{taskId}/students/{studentId}")
    public Score getScoreForTaskByStudent(@PathVariable Long subjectId, @PathVariable Long taskId,
                                          @PathVariable Long studentId) {
        return scoreService.getScoreById(studentId, taskId);
    }

    @GetMapping("/scores/{studentId}")
    public List<Score> getAllScoreFromStudent(@PathVariable Long studentId) {
        return scoreService.getAllScoresByStudent(studentId);
    }

    @PostMapping("/subjects/{subjectId}/tasks/{taskId}/students/{studentId}")
    public Score saveScore(@RequestBody ScoreCreateDTO score, @PathVariable Long subjectId,
                           @PathVariable Long taskId, @PathVariable Long studentId) {
        return scoreService.saveScore(score, taskId, studentId);
    }

    @PatchMapping("/subjects/{subjectId}/tasks/{taskId}/students/{studentId}")
    public Score patchScore(@RequestBody Score score, @PathVariable Long subjectId,
                            @PathVariable Long taskId, @PathVariable Long studentId) {
        return scoreService.updateScore(score, taskId, studentId);
    }

    @DeleteMapping("/subjects/{subjectId}/tasks/{taskId}/students/{studentId}")
    public void deleteScore(@PathVariable Long subjectId,
                            @PathVariable Long taskId, @PathVariable Long studentId) {
        scoreService.deleteScore(taskId, studentId);
    }

    @GetMapping("/subjects/{subjectId}/scores")
    public List<ScoreDTO> getAllScoresFromSubject(@PathVariable Long subjectId) {
        return scoreService.getAllScoresBySubject(subjectId);
    }
}

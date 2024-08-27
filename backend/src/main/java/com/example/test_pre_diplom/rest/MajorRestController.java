package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.dto.ChangePasswordDTO;
import com.example.test_pre_diplom.entities.dto.MajorCreateDTO;
import com.example.test_pre_diplom.entities.dto.MajorDTO;
import com.example.test_pre_diplom.service.MajorService;
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
@RequestMapping(path = "/v1")
public class MajorRestController {
    private final MajorService majorService;

    public MajorRestController(MajorService majorService) {
        this.majorService = majorService;
    }

    @GetMapping("/majors")
    public List<MajorDTO> getAllMajors() {
        return majorService.getAllMajors();
    }

    @GetMapping("/majors/{majorId}")
    public MajorDTO getMajorById(@PathVariable Long majorId) {
        return majorService.getMajorById(majorId);
    }

    @PostMapping("/majors")
    public ResponseEntity<?> saveMajor(@Valid @RequestBody MajorCreateDTO majorCreateDTO,
                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        MajorDTO majorDTO = majorService.save(majorCreateDTO);

        return majorDTO != null ? new ResponseEntity<>(majorDTO, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/majors/{majorId}")
    public ResponseEntity<?> updateMajor(@PathVariable Long majorId, @Valid @RequestBody MajorCreateDTO majorCreateDTO,
                                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        MajorDTO majorDTO = majorService.update(majorId, majorCreateDTO);

        return majorDTO != null ? ResponseEntity.ok(majorDTO) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/majors/{majorId}")
    public void delete(@PathVariable Long majorId) {
        majorService.delete(majorId);
    }
}

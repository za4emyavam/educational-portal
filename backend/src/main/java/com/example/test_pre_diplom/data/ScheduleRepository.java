package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.Schedule;
import com.example.test_pre_diplom.entities.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findAllByGroupId(StudyGroup groupId);
    void deleteByGroupIdAndDayAndNumber(StudyGroup groupId, Integer day, Integer number);
}

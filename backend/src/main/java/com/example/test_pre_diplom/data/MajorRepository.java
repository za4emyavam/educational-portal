package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MajorRepository extends JpaRepository<Major, Long> {

}

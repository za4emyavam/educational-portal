package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.PersonalData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalDataRepository extends JpaRepository<PersonalData, Long> {
    Optional<PersonalData> findByMember (Member member);
}

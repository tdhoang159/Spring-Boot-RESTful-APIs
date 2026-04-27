package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.Optional;

import com.truongduchoang.SpringBootRESTfullAPIs.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndUserIdNot(String email, Long userId);
}

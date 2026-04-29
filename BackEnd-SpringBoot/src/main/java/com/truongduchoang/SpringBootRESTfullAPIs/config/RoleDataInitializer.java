package com.truongduchoang.SpringBootRESTfullAPIs.config;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Role;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.RoleName;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.RoleRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleDataInitializer {

    @Bean
    public ApplicationRunner ensureDefaultRoles(RoleRepository roleRepository) {
        return args -> {
            ensureRoleExists(roleRepository, RoleName.ADMIN, "System administrator");
            ensureRoleExists(roleRepository, RoleName.ORGANIZER, "Event organizer");
            ensureRoleExists(roleRepository, RoleName.ATTENDEE, "Event attendee");
        };
    }

    private void ensureRoleExists(RoleRepository roleRepository, RoleName roleName, String description) {
        if (roleRepository.existsByRoleName(roleName)) {
            return;
        }

        Role role = new Role();
        role.setRoleName(roleName);
        role.setDescription(description);
        roleRepository.save(role);
    }
}

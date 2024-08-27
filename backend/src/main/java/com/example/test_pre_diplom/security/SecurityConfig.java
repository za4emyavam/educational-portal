package com.example.test_pre_diplom.security;

import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.entities.Member;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(request -> {
            var corsConfiguration = new CorsConfiguration();
            corsConfiguration.setAllowedOriginPatterns(List.of("*"));
            corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            corsConfiguration.setAllowedHeaders(List.of("*"));
            corsConfiguration.setAllowCredentials(true);
            return corsConfiguration;
        }));
        http.sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.authorizeHttpRequests(request ->
                request
                        .requestMatchers("/v1/login", "/v1/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/majors", "/v1/members", "/v1/faculties",
                                "/v1/schedules/", "/v1/schedules/{studentGroupId}", "/v1/students", "/v1/study_groups",
                                "/v1/subjects", "/v1/teachers")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/v1/faculties/{facultyId}", "/v1/majors/{majorsId}",
                                "/v1/students/{studentId}", "/v1/study_groups/{groupId}", "/v1/subjects/{subjectId}",
                                "/v1/teachers/{teachersId}")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/v1/faculties", "/v1/faculties/{facultyId}", "/v1/majors",
                                "/v1/majors/{majorsId}", "/v1/schedules/{groupId}", "/v1/students",
                                "/v1/students/{studentId}", "/v1/study_groups", "/v1/study_groups/{id}",
                                "/v1/subjects", "/v1/subjects/study_groups/{studyGroupId}", "/v1/teachers",
                                "/v1/teachers/{teacherId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/v1/faculties/{facultyId}", "/v1/majors/{majorsId}",
                                "/v1/schedules/{studyGroupId}", "/v1/students/{studentId}", "/v1/study_groups/{id}",
                                "/v1/subjects/{id}", "/v1/teachers/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/v1/subjects/{subjectId}/tasks/lab", "/v1/subjects/{subjectId}/tasks/info",
                                "/v1/subjects/{subjectId}/tasks/{taskId}/students/{studentId}", "/v1/tasks/{taskId}/teach/files")
                        .hasRole("TEACHER")
                        .requestMatchers(HttpMethod.GET, "/v1/subjects/teacher/{teacherId}", "/v1/teachers/{teacherId}/renews")
                        .hasRole("TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/v1/tasks/{taskId}").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.GET, "/v1/study_groups/{id}/students", "/v1/subjects/{subjectId}/renew",
                                "/v1/subjects/{subjectId}/scores", "/v1/subjects/{subjectId}/student/{studentId}",
                                "/v1/subjects/{subjectId}/tasks/{taskId}/scores", "/v1/tasks/{taskId}/students/files")
                        .hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/v1/subjects/student/{studentId}", "/v1/subjects/{subjectId}/students/{studentId}/scores",
                                "/v1/tasks/students/{studentId}/pag")
                        .hasRole("STUDENT")
                        .requestMatchers(HttpMethod.POST, "/v1/tasks/{taskId}/students/{studentId}/chat").hasAnyRole("TEACHER", "STUDENT")
                        .requestMatchers(HttpMethod.POST, "/v1/tasks/{taskId}/students/{studentId}/files").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/tasks/{taskId}/students/{studentId}/files/{filesId}").hasRole("STUDENT")
                        .anyRequest().authenticated());
        return http.build();
    }
}
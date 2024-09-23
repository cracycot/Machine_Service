//package org.example.machine_service.config;
//
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractAuthenticationFilterConfigurer;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.provisioning.InMemoryUserDetailsManager;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//    @Bean
//    public UserDetailsService userDetailsService (PasswordEncoder encoder) {
//        UserDetails admin = User.builder().username("admin").password(encoder.encode("admin12345")).build();
//        return new InMemoryUserDetailsManager(admin);
//    }
//    @Bean
//    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception {
//        return http.csrf(AbstractHttpConfigurer::disable )
//                .authorizeHttpRequests(auth -> auth.requestMatchers("/admin", "/product/deleteproduct", "product/updateproduct").authenticated().requestMatchers("/**" , "/css/**","/js/**","/img/**")
//                        .permitAll())
//                 .formLogin(AbstractAuthenticationFilterConfigurer::permitAll).build();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}
package org.example.machine_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractAuthenticationFilterConfigurer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
//        UserDetails admin = User.builder()
//                .username("admin")
//                .password(encoder.encode("admin12345"))
//                .roles("ADMIN") // Можно добавить роли
//                .build();
//        return new InMemoryUserDetailsManager(admin);
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http.csrf(AbstractHttpConfigurer::disable)
////                .authorizeHttpRequests(auth -> auth
////                        .requestMatchers("/admin", "/product/deleteproduct", "/product/updateproduct").authenticated()
////                        .requestMatchers("/**", "/css/**", "/js/**", "/img/**").permitAll()
////                )
////                .formLogin(AbstractAuthenticationFilterConfigurer::permitAll);
//        http.csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/css/**", "/js/**", "/img/**").permitAll()
//                        .requestMatchers("/admin", "/product/**").authenticated()
//                        .anyRequest().permitAll()
//                )
//                .formLogin(AbstractAuthenticationFilterConfigurer::permitAll);
//        return http.build();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//}
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(encoder.encode("admin12345"))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Решите, нужно ли вам отключать CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/css/**", "/js/**", "/img/**", "product/**").permitAll()
                        .requestMatchers("/admin", "/product/updateproduct", "/product/deleteproduct", "/product/create", "/product/increaseStock", "/product/decreaseStock").authenticated()
                        .anyRequest().permitAll()
                )
                .formLogin(AbstractAuthenticationFilterConfigurer::permitAll);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

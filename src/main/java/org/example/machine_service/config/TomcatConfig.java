package org.example.machine_service.config;
import org.apache.catalina.Context;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {

    @Bean
    public TomcatContextCustomizer tomcatContextCustomizer() {
        return (Context context) -> {
            context.setManager(null);
        };
    }
}
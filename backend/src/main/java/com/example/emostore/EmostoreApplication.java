package com.example.emostore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EmostoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmostoreApplication.class, args);
	}

}

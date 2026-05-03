package com.example.emostore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
	public class EmostoreApplication {

    public static void main(String[] args) {
        System.out.println("DEBUG: MYSQLHOST=" + System.getenv("MYSQLHOST"));
        System.out.println("DEBUG: MYSQLPORT=" + System.getenv("MYSQLPORT"));
        System.out.println("DEBUG: MYSQLDATABASE=" + System.getenv("MYSQLDATABASE"));
        System.out.println("DEBUG: MYSQLUSER=" + System.getenv("MYSQLUSER"));
        SpringApplication.run(EmostoreApplication.class, args);
	}

	}

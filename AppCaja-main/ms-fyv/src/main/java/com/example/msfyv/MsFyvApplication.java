package com.example.msfyv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsFyvApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsFyvApplication.class, args);
	}

}

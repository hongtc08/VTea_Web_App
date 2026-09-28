package com.kiemchung.vtea;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/api/test")
    public String testPipeline() {
        int a=10;
        return "Hệ thống CI/CD và SonarCloud hoạt động ngon lành!";
    }
}
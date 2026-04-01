package com.truongduchoang.SpringBootRESTfullAPIs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Todo;

@RestController
public class HelloWorldController {
    @GetMapping("/")
    public ResponseEntity<String> index() {
        return ResponseEntity.ok().body("Hello world!");
    }

    @GetMapping("/demo")
    public ResponseEntity<Todo> demo(){
        Todo testTodo = new Todo("Tran Dinh Phi Hung", true);
        return ResponseEntity.ok().body(testTodo);
    }
}

package com.truongduchoang.SpringBootRESTfullAPIs.controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Todo;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TodoService;

@RestController
public class TodoController {
    private final TodoService todoService;

    public TodoController(TodoService todoService){
        this.todoService = todoService;
    }

    @GetMapping("/create-todo")
    public String create(){
        Todo muTodo = new Todo("Truong Duc Hoang", true);
        Todo savedTodo = this.todoService.handleCreateTodo(muTodo);
        return "create todo with id = " + savedTodo.getId();
    }

    @GetMapping("/todos")
    public String getAllTodos(){
        this.todoService.handleGetAllTodos();
        return "get all todos";
    }

    @GetMapping("/update-todo")
    public String updateTodo(){
        this.todoService.handleUpdateTodo();
        return "update todo!";
    }

    @GetMapping("/delete-todo")
    public String deleteTodo(){
        this.todoService.handleDeleteTodo(4l);
        return "delete todo!";
    }
}

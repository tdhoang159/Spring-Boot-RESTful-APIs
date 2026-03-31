package com.truongduchoang.SpringBootRESTfullAPIs.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Todo;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TodoRepository;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository){
        this.todoRepository = todoRepository;
    }

    public Todo handleCreateTodo(Todo todo){
        System.out.printf(">>> Run todo service!!!!!!: %s", todo.toString());
        Todo newTodo = this.todoRepository.save(todo);
        return newTodo;
    }

    public void handleGetAllTodos(){
        // List<Todo> listTodos = this.todoRepository.findAll();
        // listTodos.forEach(todo -> System.out.printf("%s", todo.toString()));

        // Optional<Todo> optionalTodo = this.todoRepository.findById(3l);
        // if (optionalTodo.isPresent()) {
        //     System.out.println(optionalTodo.toString());
        // }
        List<Todo> listTodo = this.todoRepository.findByUserName("Truong Duc Hoang demo 1");
        listTodo.forEach(todo -> System.out.printf("%s", todo.toString()));
    }

    public void handleUpdateTodo(){
        Optional<Todo> optionalTodo = this.todoRepository.findById(2l);
        if(optionalTodo.isPresent()){
            Todo currentTodo = optionalTodo.get();
            currentTodo.setCompleted(false);
            currentTodo.setUserName("Tran Dinh Phi Hung update");
            this.todoRepository.save(currentTodo);
        }
    }

    public void handleDeleteTodo(Long id){
        this.todoRepository.deleteById(id);
    }
}

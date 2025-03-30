package com.dominator.chatapp.controller;

import com.dominator.chatapp.model.ChatMessage;
import com.dominator.chatapp.service.ChatHistoryService;
import com.dominator.chatapp.service.KafkaProducerService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final KafkaProducerService kafkaProducerService;
    private final Set<String> activeUsers = new HashSet<>();
    private final ChatHistoryService service;

    public ChatController(KafkaProducerService kafkaProducerService, ChatHistoryService service) {
        this.kafkaProducerService = kafkaProducerService;
        this.service = service;
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinChat(@RequestParam String username) {
        synchronized (activeUsers) {
            if (activeUsers.contains(username)) {
                return ResponseEntity.ok(false);
            }
            activeUsers.add(username);
            return ResponseEntity.ok(true);
        }
    }

    @MessageMapping("/send")
    public void sendMessage(ChatMessage message) {
        kafkaProducerService.sendMessage(message.getGroupName(), message);
    }

    @GetMapping("/history")
    public List<ChatMessage> getHistory(@RequestParam String groupName) {
        return service.getMessages(groupName);
    }
}

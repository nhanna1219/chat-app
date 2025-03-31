package com.dominator.chatapp.controller;

import com.dominator.chatapp.config.ChatTopicProperties;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*") // Allow React frontend
@RestController
@RequestMapping("/chat")
public class ChatGroupController {
    private final ChatTopicProperties properties;

    public ChatGroupController(ChatTopicProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/channels")
    public List<String> getAvailableChannels() {
        return properties.getTopics();
    }
}

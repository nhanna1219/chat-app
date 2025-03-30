package com.dominator.chatapp.service;

import com.dominator.chatapp.model.ChatMessage;
import com.dominator.chatapp.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatHistoryService {
    private final ChatMessageRepository repository;

    public ChatHistoryService(ChatMessageRepository repository) {
        this.repository = repository;
    }

    public List<ChatMessage> getMessages(String groupName) {
        return repository.findByGroupNameOrderByTimestampAsc(groupName);
    }

    public void save(ChatMessage msg) {
        repository.save(msg);
    }
}

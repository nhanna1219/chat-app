package com.dominator.chatapp.repository;

import com.dominator.chatapp.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByGroupNameOrderByTimestampAsc(String groupName);
}

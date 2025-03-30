package com.dominator.chatapp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "chat_messages")
@Data
public class ChatMessage {
    @Id
    private String id;
    private boolean system = false;
    private String sender;
    private String content;
    private String groupName;
    private Instant timestamp = Instant.now();
}

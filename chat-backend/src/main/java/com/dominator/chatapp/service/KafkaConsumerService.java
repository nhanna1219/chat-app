package com.dominator.chatapp.service;

import com.dominator.chatapp.model.ChatMessage;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatHistoryService service;

    public KafkaConsumerService(SimpMessagingTemplate messagingTemplate, ChatHistoryService service) {
        this.messagingTemplate = messagingTemplate;
        this.service = service;
    }

    @KafkaListener(topicPattern = ".*", groupId = "chat-group")
    public void consumeMessage(ChatMessage message) {
        service.save(message);
        messagingTemplate.convertAndSend("/topic/" + message.getGroupName(), message);
    }
}
package com.dominator.chatapp.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.List;

@Configuration
public class KafkaConfig {
    private final ChatTopicProperties properties;
    public KafkaConfig(ChatTopicProperties properties) {
        this.properties = properties;
    }

    @Bean
    public KafkaAdmin.NewTopics createAllTopics() {
        List<NewTopic> topics = properties.getTopics().stream()
                .map(name -> TopicBuilder.name(name).partitions(1).replicas(1).build())
                .toList();
        return new KafkaAdmin.NewTopics(topics.toArray(NewTopic[]::new));
    }
}
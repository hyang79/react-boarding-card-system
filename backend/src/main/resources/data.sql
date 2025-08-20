-- 테스트 사용자 데이터 (H2용)
-- password123 해시: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNa2MFUOQ7Qa
INSERT INTO users (email, password, name, role) VALUES 
('test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNa2MFUOQ7Qa', 'Test User', 'USER'),
('admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNa2MFUOQ7Qa', 'Admin User', 'ADMIN'),
('user1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNa2MFUOQ7Qa', 'User1', 'USER'),
('user2@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFVMLVZqpjBWNa2MFUOQ7Qa', 'User2', 'USER');

-- 테스트 게시글 데이터
INSERT INTO posts (title, content, author_id, author_name, author_email) VALUES 
('MyBatis와 Spring Boot 연동하기', 'MyBatis를 사용하여 Spring Boot 애플리케이션을 개발하는 방법에 대해 알아보겠습니다.', 1, 'Test User', 'test@example.com'),
('React와 Spring Boot 연동', '프론트엔드 React와 백엔드 Spring Boot를 연동하는 방법을 설명합니다.', 1, 'Test User', 'test@example.com'),
('시스템 공지사항', '시스템 업데이트가 완료되었습니다. 새로운 기능들을 확인해보세요.', 2, 'Admin User', 'admin@example.com'),
('개발 가이드라인', '개발 시 준수해야 할 가이드라인입니다.', 2, 'Admin User', 'admin@example.com'),
('프론트엔드 개발 팁', 'React 개발 시 유용한 팁들을 공유합니다.', 3, 'User1', 'user1@example.com');
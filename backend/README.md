# Login Backend with MariaDB

Spring Boot 기반의 로그인 백엔드 API 서버입니다.

## 사전 요구사항

### 1. Java 17 설치
```bash
java -version
```

### 2. MariaDB 설치 (Windows)

#### 방법 1: 공식 사이트에서 다운로드
1. https://mariadb.org/download/ 에서 Windows용 MariaDB 다운로드
2. 설치 시 root 비밀번호를 `0000`으로 설정

#### 방법 2: Chocolatey 사용 (관리자 권한 필요)
```powershell
choco install mariadb
```

#### 방법 3: winget 사용
```powershell
winget install MariaDB.Server
```

### 3. MariaDB 서비스 시작
```powershell
# 서비스 시작
net start mariadb

# 또는 MySQL 서비스로 설치된 경우
net start mysql
```

### 4. 데이터베이스 생성 (선택사항)
```sql
mysql -u root -p0000
CREATE DATABASE IF NOT EXISTS react;
```

## 프로젝트 실행

### 1. 의존성 설치
```bash
cd backend
mvn clean install
```

### 2. 애플리케이션 실행
```bash
mvn spring-boot:run
```

또는

```bash
java -jar target/login-backend-0.0.1-SNAPSHOT.jar
```

## API 엔드포인트

### 인증 관련
- `POST http://localhost:9090/api/auth/login` - 로그인
- `POST http://localhost:9090/api/auth/register` - 회원가입
- `GET http://localhost:9090/api/auth/test` - 서버 상태 확인

### 요청 예시

#### 로그인
```json
POST http://localhost:9090/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 응답
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "message": "로그인 성공"
}
```

## 설정

### application.yml 주요 설정
- **데이터베이스**: H2 인메모리 (개발용) / MariaDB (프로덕션)
- **서버 포트**: 9090
- **컨텍스트 패스**: /api
- **JWT 만료시간**: 24시간

## 문제 해결

### MariaDB 연결 실패 시
1. MariaDB 서비스가 실행 중인지 확인
2. 포트 3306이 사용 가능한지 확인
3. 사용자명/비밀번호 확인 (root/0000)

### 포트 충돌 시
application.yml에서 server.port 변경

## 개발 모드

### 자동 재시작 (Spring Boot DevTools)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### H2 데이터베이스 사용 (개발용)
MariaDB 대신 인메모리 H2 데이터베이스 사용 시:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
```
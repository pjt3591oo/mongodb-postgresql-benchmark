# MongoDB vs PostgreSQL Benchmark

MongoDB의 Aggregation Lookup과 PostgreSQL의 JOIN 성능을 비교하는 벤치마크 프로젝트입니다.

## 구조

- 7개의 테이블/컬렉션 (a, b, c, d, e, f, g)
- 관계: a <- b <- c <- d <- e <- f <- g
- 각 테이블당 10,000개의 레코드 생성

## 시작하기

### 1. 데이터베이스 시작

```bash
docker-compose up -d
```

### 2. 의존성 설치

```bash
npm install
```

npm 캐시 문제가 있는 경우 권한설정

```bash
sudo chown -R $(whoami) ~/.npm
```

### 3. 시드 데이터 생성

```bash
npm run seed
```

### 4. 벤치마크 실행

```bash
npm run benchmark
```

## 파일 구조

- `docker-compose.yml` - MongoDB와 PostgreSQL 컨테이너 설정
- `src/models/mongodb.js` - MongoDB 스키마 정의
- `src/models/postgresql.sql` - PostgreSQL 테이블 정의
- `src/seed.js` - 더미 데이터 생성 스크립트
- `src/benchmark.js` - 벤치마크 실행 코드
- `src/db-connection.js` - 데이터베이스 연결 관리

## 환경 변수

`.env` 파일에 다음 변수들이 설정되어 있습니다:

```
MONGO_URI=mongodb://admin:password@localhost:27017/benchmark?authSource=admin
POSTGRES_URI=postgresql://admin:password@localhost:5432/benchmark
```
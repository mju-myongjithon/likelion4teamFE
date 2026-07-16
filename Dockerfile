# syntax=docker/dockerfile:1
# ============================================
# [1단계] 빌드 스테이지 — 정적 파일(dist) 생성
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# 빌드 시점에 API 서버 주소를 고정한다. FE·BE가 같은 도메인(syncday.site) 뒤에서
# 서빙되므로 절대 URL을 그대로 써도 CORS 문제가 없다(WebConfig에도 이미 허용돼 있음).
ARG VITE_API_BASE_URL=https://syncday.site
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ============================================
# [2단계] 실행 스테이지 — 정적 파일만 Caddy로 서빙
# ============================================
FROM caddy:2-alpine
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

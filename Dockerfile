FROM node:20-alpine

WORKDIR /app

# 정적 파일 서빙용 경량 패키지 설치
RUN npm install -g serve

# 로컬에서 export된 dist 폴더 복사
COPY dist ./dist

# 외부 노출 포트
EXPOSE 3000

# -s: SPA 새로고침 라우팅 대응 (index.html 폴백)
# -l 3000: 3000 포트로 직접 실행
CMD ["serve", "-s", "dist", "-l", "3000"]
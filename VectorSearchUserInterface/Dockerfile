FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno cache dev.ts

EXPOSE 8000

CMD ["run", "-A", "dev.ts"]
FROM golang:1.24-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

COPY . .

RUN go build -o server .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

COPY --from=build /app/server /server

EXPOSE 8080

CMD ["/server"]
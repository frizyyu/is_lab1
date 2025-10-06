FROM gradle:8.9-jdk17 AS build
WORKDIR /app
COPY gradlew gradlew.bat ./
COPY gradle gradle
COPY settings.gradle.kts build.gradle.kts gradle.properties ./
RUN ./gradlew --no-daemon dependencies

COPY . .
RUN rm -rf /root/.gradle/caches /root/.gradle/wrapper
RUN ./gradlew --no-daemon detekt spotlessCheck
RUN ./gradlew --no-daemon clean shadowJar -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*-all.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

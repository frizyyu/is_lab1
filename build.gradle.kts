import com.diffplug.spotless.LineEnding
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

plugins {
    id("org.jetbrains.kotlin.jvm") version "1.9.25"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.25"
    id("org.jetbrains.kotlin.plugin.noarg") version "1.9.25"
    id("com.google.devtools.ksp") version "1.9.25-1.0.20"

    id("io.micronaut.application") version "4.5.4"
    id("io.micronaut.test-resources") version "4.5.4"
    id("com.gradleup.shadow") version "8.3.7"

    id("io.gitlab.arturbosch.detekt") version "1.23.6"
    id("com.diffplug.spotless") version "6.25.0"
}

version = "0.1"
group = "com.isproj"

val micronautVersion = "4.9.3"
val kotlinVersion = "1.9.25"

repositories {
    mavenCentral()
}

dependencies {
    implementation(platform("io.micronaut.platform:micronaut-platform:$micronautVersion"))

    implementation("io.gitlab.arturbosch.detekt:detekt-formatting:1.23.6")
    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.23.6")

    implementation("io.micronaut:micronaut-http-server-netty")
    implementation("io.micronaut:micronaut-jackson-databind")
    implementation("io.micronaut.serde:micronaut-serde-jackson")
    implementation("io.micronaut:micronaut-http-validation")
    implementation("io.micronaut.beanvalidation:micronaut-hibernate-validator")
    implementation("io.micronaut:micronaut-management")
    implementation("io.micronaut.kotlin:micronaut-kotlin-runtime")

    implementation("io.micronaut.data:micronaut-data-jdbc")
    ksp("io.micronaut.data:micronaut-data-processor")
    ksp("io.micronaut.serde:micronaut-serde-processor")

    implementation("io.micronaut.sql:micronaut-jdbc")
    implementation("io.micronaut.sql:micronaut-jdbc-hikari")
    runtimeOnly("org.postgresql:postgresql")

    runtimeOnly("ch.qos.logback:logback-classic")
    runtimeOnly("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect:$kotlinVersion")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlinVersion")

    testImplementation("io.micronaut:micronaut-http-client")
}

application {
    mainClass = "com.isproj.ApplicationKt"
}

java { sourceCompatibility = JavaVersion.toVersion("17") }
kotlin { jvmToolchain(17) }

micronaut {
    version.set(micronautVersion)
    runtime("netty")
    testRuntime("junit5")
    processing {
        incremental(true)
        annotations("com.isproj.*")
    }
}

tasks.named<ShadowJar>("shadowJar") {
    archiveClassifier.set("all")
    mergeServiceFiles()
    mergeServiceFiles {
        include("META-INF/services/*")
        include("META-INF/micronaut/*")
    }
}

spotless {
    lineEndings = LineEnding.UNIX
    kotlin {
        ktlint().editorConfigOverride(
            mapOf(
                "ktlint_standard_multiline-expression-wrapping" to "disabled"
            )
        )
        target("src/**/*.kt")
        endWithNewline()
        trimTrailingWhitespace()
    }
}

detekt {
    buildUponDefaultConfig = true
    allRules = false
    config.setFrom(files("detekt.yml"))

    autoCorrect = true
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}
noArg { annotation("jakarta.persistence.Entity") }

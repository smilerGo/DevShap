# 声明与管理依赖

## 版本目录（Version Catalogs）

版本目录是 Gradle 7.0+ 引入的功能，用于集中管理依赖版本，提高可维护性。

### 创建版本目录

```kotlin
// gradle/libs.versions.toml
[versions]
slf4j = "2.0.7"
junit = "5.9.2"
spring-boot = "3.1.0"

[libraries]
slf4j-api = { module = "org.slf4j:slf4j-api", version.ref = "slf4j" }
junit-jupiter = { module = "org.junit.jupiter:junit-jupiter", version.ref = "junit" }
spring-boot-starter-web = { module = "org.springframework.boot:spring-boot-starter-web", version.ref = "spring-boot" }

[bundles]
testing = ["junit-jupiter"]

[plugins]
spring-boot = { id = "org.springframework.boot", version.ref = "spring-boot" }
```

### 使用版本目录

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.spring.boot)
}

dependencies {
    implementation(libs.slf4j.api)
    testImplementation(libs.bundles.testing)
}
```

**实际应用场景**：

```kotlin
// gradle/libs.versions.toml
[versions]
kotlin = "1.9.0"
spring-boot = "3.1.0"
slf4j = "2.0.7"

[libraries]
kotlin-stdlib = { module = "org.jetbrains.kotlin:kotlin-stdlib", version.ref = "kotlin" }
spring-boot-starter-web = { module = "org.springframework.boot:spring-boot-starter-web", version.ref = "spring-boot" }

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
spring-boot = { id = "org.springframework.boot", version.ref = "spring-boot" }

// build.gradle.kts
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.spring.boot)
}

dependencies {
    implementation(libs.kotlin.stdlib)
    implementation(libs.spring.boot.starter.web)
}
```

## 依赖约束

### 添加依赖约束

```kotlin
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 约束传递依赖的版本
    constraints {
        implementation("org.slf4j:slf4j-api:2.0.7") {
            because("统一日志框架版本")
        }
    }
}
```

**实际应用场景**：

```kotlin
dependencies {
    implementation("com.example:my-lib:1.0.0")
    
    // 约束传递依赖
    constraints {
        implementation("org.slf4j:slf4j-api:2.0.7") {
            because("解决版本冲突")
        }
        implementation("com.google.guava:guava:32.1.1-jre") {
            because("统一工具库版本")
        }
    }
}
```

## 依赖解析

### 查看依赖

```bash
# 查看所有依赖
./gradlew dependencies

# 查看特定配置的依赖
./gradlew dependencies --configuration runtimeClasspath

# 查看依赖树
./gradlew dependencies --configuration compileClasspath
```

### 解决依赖冲突

```kotlin
dependencies {
    // 使用新版本
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 排除旧版本
    implementation("com.example:legacy-lib:1.0.0") {
        exclude(group = "org.slf4j", module = "slf4j-api")
    }
}
```

## 最佳实践

### 1. 使用版本目录

```kotlin
// ✅ 推荐：使用版本目录
dependencies {
    implementation(libs.slf4j.api)
}

// ❌ 不推荐：硬编码版本
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}
```

### 2. 统一版本管理

```kotlin
// 在根项目中统一管理
allprojects {
    dependencies {
        constraints {
            implementation("org.slf4j:slf4j-api:2.0.7")
        }
    }
}
```

## 总结

- **版本目录**：集中管理依赖版本
- **依赖约束**：解决版本冲突
- **依赖解析**：查看和管理依赖
- **最佳实践**：使用版本目录，统一版本管理

掌握依赖管理是维护大型项目的关键技能。


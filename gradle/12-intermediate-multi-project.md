# 多项目构建结构

## 什么是多项目构建？

多项目构建（Multi-Project Build）允许将大型项目拆分为多个子项目，每个子项目可以独立构建，也可以作为整体构建。这种方式提高了代码组织性和构建效率。

## 多项目结构

### 基本结构

```
project-root/
├── settings.gradle.kts      # 定义项目结构
├── build.gradle.kts         # 根项目配置
├── app/                     # 应用模块
│   └── build.gradle.kts
├── lib/                     # 库模块
│   └── build.gradle.kts
└── common/                  # 公共模块
    └── build.gradle.kts
```

### Settings 文件配置

```kotlin
// settings.gradle.kts
rootProject.name = "multi-module-project"

include("app")
include("lib")
include("common")
```

**实际应用场景**：

```kotlin
// settings.gradle.kts
rootProject.name = "e-commerce-platform"

// 核心模块
include(":core")
include(":core:domain")
include(":core:infrastructure")

// 应用模块
include(":app")
include(":app:web")
include(":app:api")

// 共享模块
include(":shared")
include(":shared:common")
include(":shared:utils")
```

## 根项目配置

### 共享配置

```kotlin
// 根项目 build.gradle.kts
plugins {
    id("java")
}

// 所有项目共享的配置
allprojects {
    group = "com.example"
    version = "1.0.0"
    
    repositories {
        mavenCentral()
    }
}

// 子项目共享的配置
subprojects {
    apply(plugin = "java")
    
    java {
        sourceCompatibility = JavaVersion.VERSION_17
    }
    
    dependencies {
        testImplementation("junit:junit:4.13.2")
    }
}
```

**实际应用场景**：

```kotlin
// 根项目 build.gradle.kts
plugins {
    id("java") apply false
    id("org.springframework.boot") version "3.1.0" apply false
}

allprojects {
    group = "com.example"
    version = "1.0.0"
    
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")
    
    java {
        sourceCompatibility = JavaVersion.VERSION_17
    }
    
    // 统一测试配置
    tasks.test {
        useJUnitPlatform()
    }
}
```

## 子项目配置

### 应用模块

```kotlin
// app/build.gradle.kts
plugins {
    id("java")
    id("application")
}

dependencies {
    // 依赖其他模块
    implementation(project(":lib"))
    implementation(project(":common"))
    
    // 外部依赖
    implementation("org.springframework.boot:spring-boot-starter-web")
}

application {
    mainClass.set("com.example.Main")
}
```

### 库模块

```kotlin
// lib/build.gradle.kts
plugins {
    id("java-library")
}

dependencies {
    // API 依赖（会暴露给消费者）
    api("com.google.guava:guava:32.1.1-jre")
    
    // 实现依赖（不暴露）
    implementation("org.apache.commons:commons-lang3:3.12.0")
    
    // 依赖公共模块
    implementation(project(":common"))
}
```

### 公共模块

```kotlin
// common/build.gradle.kts
plugins {
    id("java-library")
}

dependencies {
    api("org.slf4j:slf4j-api:2.0.7")
}
```

## 项目依赖

### 声明项目依赖

```kotlin
// app/build.gradle.kts
dependencies {
    // 依赖 lib 模块
    implementation(project(":lib"))
    
    // 依赖特定配置
    implementation(project(":lib", "default"))
    
    // 依赖嵌套模块
    implementation(project(":shared:common"))
}
```

**实际应用场景**：

```kotlin
// app/build.gradle.kts
dependencies {
    // 核心模块
    implementation(project(":core"))
    implementation(project(":core:domain"))
    
    // 共享模块
    implementation(project(":shared:common"))
    
    // 外部依赖
    implementation("org.springframework.boot:spring-boot-starter-web")
}

// core/build.gradle.kts
dependencies {
    // 依赖基础设施
    implementation(project(":core:infrastructure"))
    
    // 共享模块
    api(project(":shared:common"))
}
```

## 实际项目示例

### 示例 1：Spring Boot 多模块

```kotlin
// settings.gradle.kts
rootProject.name = "spring-boot-multi-module"

include(":api")
include(":service")
include(":repository")
include(":domain")

// 根项目 build.gradle.kts
plugins {
    id("java") apply false
    id("org.springframework.boot") version "3.1.0" apply false
    id("io.spring.dependency-management") version "1.1.0" apply false
}

allprojects {
    group = "com.example"
    version = "1.0.0"
    
    repositories {
        mavenCentral()
    }
}

// api/build.gradle.kts
plugins {
    id("java")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation(project(":service"))
    implementation("org.springframework.boot:spring-boot-starter-web")
}

// service/build.gradle.kts
plugins {
    id("java")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation(project(":repository"))
    implementation(project(":domain"))
    implementation("org.springframework.boot:spring-boot-starter")
}

// repository/build.gradle.kts
plugins {
    id("java")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation(project(":domain"))
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
}

// domain/build.gradle.kts
plugins {
    id("java")
}

dependencies {
    // 领域模型，无外部依赖
}
```

### 示例 2：Android 多模块

```kotlin
// settings.gradle.kts
rootProject.name = "android-multi-module"

include(":app")
include(":core")
include(":feature:home")
include(":feature:profile")

// 根项目 build.gradle.kts
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.0")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

// app/build.gradle.kts
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android") version "1.9.0"
}

dependencies {
    implementation(project(":core"))
    implementation(project(":feature:home"))
    implementation(project(":feature:profile"))
}

// core/build.gradle.kts
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android") version "1.9.0"
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
}
```

## 构建多项目

### 构建所有项目

```bash
# 构建所有项目
./gradlew build

# 构建特定项目
./gradlew :app:build

# 构建项目及其依赖
./gradlew :app:buildNeeded

# 构建项目及依赖它的项目
./gradlew :app:buildDependents
```

### 并行构建

```bash
# 并行构建所有项目
./gradlew build --parallel

# 限制并行度
./gradlew build --parallel --max-workers=4
```

## 最佳实践

### 1. 使用 allprojects 和 subprojects

```kotlin
// ✅ 推荐：在根项目中统一配置
allprojects {
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")
    java {
        sourceCompatibility = JavaVersion.VERSION_17
    }
}
```

### 2. 合理划分模块

```kotlin
// ✅ 推荐：按功能或层次划分
// - domain: 领域模型
// - repository: 数据访问
// - service: 业务逻辑
// - api: 接口层

// ❌ 不推荐：过于细粒度或过于粗粒度
```

### 3. 使用 api 和 implementation

```kotlin
// ✅ 推荐：库项目使用 api 暴露依赖
// lib/build.gradle.kts
dependencies {
    api("com.google.guava:guava:32.1.1-jre")  // 暴露给消费者
    implementation("org.apache.commons:commons-lang3:3.12.0")  // 内部使用
}
```

### 4. 避免循环依赖

```kotlin
// ❌ 错误：循环依赖
// app 依赖 lib
// lib 依赖 app

// ✅ 正确：单向依赖
// app 依赖 lib
// lib 不依赖 app
```

## 常见问题

### Q: 如何查看项目依赖关系？

A: 使用 `./gradlew :app:dependencies` 查看特定项目的依赖。

### Q: 如何只构建特定项目？

A: 使用 `./gradlew :projectName:build` 构建特定项目。

### Q: 如何处理循环依赖？

A: 重构代码，提取公共模块，消除循环依赖。

### Q: 如何共享版本号？

A: 在根项目的 `build.gradle.kts` 中定义版本变量，子项目引用。

```kotlin
// 根项目 build.gradle.kts
val slf4jVersion = "2.0.7"

subprojects {
    dependencies {
        implementation("org.slf4j:slf4j-api:$slf4jVersion")
    }
}
```

## 总结

- **多项目构建**：将大型项目拆分为多个子项目
- **Settings 文件**：定义项目结构
- **根项目配置**：使用 allprojects 和 subprojects 共享配置
- **项目依赖**：使用 project() 声明项目依赖
- **构建命令**：可以构建所有项目或特定项目
- **最佳实践**：合理划分模块、使用 api/implementation、避免循环依赖

掌握多项目构建是管理大型项目的关键，它提高了代码组织性和构建效率。



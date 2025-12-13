# 二进制插件发布

## 发布配置

### 使用 maven-publish 插件

```kotlin
// build.gradle.kts
plugins {
    id("java-gradle-plugin")
    id("maven-publish")
}

gradlePlugin {
    plugins {
        create("myPlugin") {
            id = "com.example.my-plugin"
            implementationClass = "com.example.MyPlugin"
        }
    }
}

publishing {
    repositories {
        maven {
            name = "local"
            url = uri("${rootProject.buildDir}/repo")
        }
    }
}
```

**实际应用场景**：

```kotlin
// build.gradle.kts
plugins {
    id("java-gradle-plugin")
    id("maven-publish")
    id("signing")
}

gradlePlugin {
    plugins {
        create("myPlugin") {
            id = "com.example.my-plugin"
            implementationClass = "com.example.MyPlugin"
            version = project.version.toString()
        }
    }
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            
            pom {
                name.set("My Gradle Plugin")
                description.set("A useful Gradle plugin")
                url.set("https://github.com/example/my-plugin")
            }
        }
    }
    
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/example/my-plugin")
            credentials {
                username = project.findProperty("gpr.user") as String?
                password = project.findProperty("gpr.key") as String?
            }
        }
    }
}
```

## 发布到仓库

### 发布到本地

```bash
# 发布到本地 Maven 仓库
./gradlew publishToMavenLocal

# 使用插件
plugins {
    id("com.example.my-plugin") version "1.0.0"
}
```

### 发布到远程

```bash
# 发布到远程仓库
./gradlew publish

# 需要配置仓库凭据
```

## 版本管理

### 语义化版本

```kotlin
// gradle.properties
version=1.0.0

// 或
version=1.0.0-SNAPSHOT
```

## 最佳实践

### 1. 使用语义化版本

```kotlin
// ✅ 推荐
version = "1.0.0"
version = "1.0.1"  // 补丁版本
version = "1.1.0"  // 次要版本
version = "2.0.0"  // 主要版本
```

### 2. 发布前测试

```bash
# 本地测试
./gradlew publishToMavenLocal

# 在测试项目中验证
```

## 总结

- **发布配置**：使用 maven-publish 插件
- **发布到仓库**：本地或远程仓库
- **版本管理**：使用语义化版本
- **最佳实践**：发布前测试，使用语义化版本

掌握插件发布是分享 Gradle 功能的关键。






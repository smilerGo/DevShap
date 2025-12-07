# 增量构建与构建缓存

## 什么是增量构建？

增量构建是 Gradle 的核心特性之一，它只执行自上次构建以来发生变化的任务，跳过未变更的任务，从而显著提高构建速度。

## 增量构建原理

### 工作原理

1. **输入检测**：Gradle 检测任务的输入（源文件、配置等）
2. **输出检测**：Gradle 检测任务的输出（生成的文件）
3. **变更比较**：比较当前输入/输出与上次构建的哈希值
4. **跳过执行**：如果输入和输出未变化，跳过任务执行

### 示例

```kotlin
tasks.register("compileJava") {
    inputs.files(fileTree("src/main/java"))
    outputs.dir("build/classes")
    
    doLast {
        // 只有源文件改变时才执行
        println("编译 Java 代码...")
    }
}
```

**实际应用场景**：

```kotlin
// 代码生成任务
tasks.register("generateCode") {
    // 输入：模板文件
    inputs.files(fileTree("src/main/templates") {
        include("**/*.template")
    })
    
    // 输入：配置属性
    inputs.property("version", project.version)
    
    // 输出：生成的代码
    outputs.dir("build/generated")
    
    doLast {
        // 只有模板或配置改变时才执行
        println("生成代码...")
    }
}
```

## 声明输入和输出

### 文件输入/输出

```kotlin
tasks.register("processFiles") {
    // 单个文件
    inputs.file("input.txt")
    outputs.file("output.txt")
    
    // 文件集合
    inputs.files("src/main/data")
    outputs.dir("build/processed")
    
    // 文件树
    inputs.files(fileTree("src") {
        include("**/*.java")
    })
}
```

**实际应用场景**：

```kotlin
// 资源处理任务
tasks.register("processResources") {
    description = "处理资源文件"
    
    // 输入：资源文件
    inputs.files(fileTree("src/main/resources") {
        include("**/*.properties")
        include("**/*.xml")
    })
    
    // 输出：处理后的资源
    outputs.dir("build/resources")
    
    doLast {
        // 处理资源文件
        copy {
            from("src/main/resources")
            into("build/resources")
            filter { line ->
                line.replace("@version@", project.version.toString())
            }
        }
    }
}
```

### 属性输入/输出

```kotlin
tasks.register("generateConfig") {
    // 属性输入
    inputs.property("environment", "production")
    inputs.property("version", project.version)
    
    // 属性输出
    outputs.property("generated", true)
    
    doLast {
        // 生成配置
    }
}
```

**实际应用场景**：

```kotlin
// 配置生成任务
tasks.register("generateAppConfig") {
    description = "生成应用配置"
    
    // 输入属性
    inputs.property("appName", project.name)
    inputs.property("version", project.version)
    inputs.property("environment", project.findProperty("env") ?: "dev")
    
    // 输出文件
    outputs.file("build/config/application.properties")
    
    doLast {
        val configFile = file("build/config/application.properties")
        configFile.parentFile.mkdirs()
        configFile.writeText("""
            app.name=${inputs.properties["appName"]}
            app.version=${inputs.properties["version"]}
            app.environment=${inputs.properties["environment"]}
        """.trimIndent())
    }
}
```

### 目录输入/输出

```kotlin
tasks.register("copyResources") {
    // 目录输入
    inputs.dir("src/main/resources")
    
    // 目录输出
    outputs.dir("build/resources")
    
    doLast {
        copy {
            from("src/main/resources")
            into("build/resources")
        }
    }
}
```

## 构建缓存

### 什么是构建缓存？

构建缓存存储任务的输出，允许在不同构建之间共享任务结果。如果任务的输入相同，Gradle 可以直接使用缓存的结果，而不需要重新执行任务。

### 启用构建缓存

```kotlin
// settings.gradle.kts
buildCache {
    local {
        enabled = true
        directory = file("$rootDir/.gradle/build-cache")
    }
}
```

**实际应用场景**：

```kotlin
// settings.gradle.kts
buildCache {
    // 本地缓存
    local {
        enabled = true
        directory = file("$rootDir/.gradle/build-cache")
        removeUnusedEntriesAfterDays = 7
    }
    
    // 远程缓存（可选）
    remote<HttpBuildCache> {
        url = uri("https://cache.example.com/cache/")
        isPush = true
        credentials {
            username = project.findProperty("cacheUsername") as String?
            password = project.findProperty("cachePassword") as String?
        }
    }
}
```

### 使用构建缓存

```bash
# 启用构建缓存
./gradlew build --build-cache

# 禁用构建缓存
./gradlew build --no-build-cache

# 推送结果到缓存
./gradlew build --build-cache --push
```

**实际应用场景**：

```bash
# CI 环境：使用远程缓存
./gradlew build --build-cache

# 本地开发：使用本地缓存
./gradlew build --build-cache

# 清理缓存
rm -rf .gradle/build-cache
```

## 任务缓存

### 启用任务缓存

```kotlin
tasks.register("expensiveTask") {
    // 启用任务缓存
    outputs.cacheIf { true }
    
    inputs.files("src")
    outputs.dir("build/output")
    
    doLast {
        // 耗时操作
    }
}
```

**实际应用场景**：

```kotlin
// 代码生成任务（支持缓存）
tasks.register("generateCode") {
    description = "生成代码"
    
    // 输入
    inputs.files(fileTree("src/main/templates"))
    inputs.property("version", project.version)
    
    // 输出
    outputs.dir("build/generated")
    
    // 启用缓存
    outputs.cacheIf { true }
    
    doLast {
        // 代码生成逻辑
        println("生成代码...")
    }
}
```

## 实际项目示例

### 示例 1：编译任务

```kotlin
tasks.compileJava {
    // 输入：Java 源文件
    inputs.files(sourceSets["main"].allJava)
    
    // 输入：编译选项
    inputs.property("sourceCompatibility", java.sourceCompatibility)
    inputs.property("targetCompatibility", java.targetCompatibility)
    
    // 输出：编译后的类文件
    outputs.dir("build/classes/java/main")
    
    // 启用缓存
    outputs.cacheIf { true }
}
```

### 示例 2：测试任务

```kotlin
tasks.test {
    // 输入：测试源文件
    inputs.files(sourceSets["test"].allJava)
    
    // 输入：测试类路径
    inputs.files(classpath)
    
    // 输出：测试报告
    outputs.files("build/test-results")
    outputs.dir("build/reports/tests")
    
    // 启用缓存
    outputs.cacheIf { true }
}
```

### 示例 3：资源处理

```kotlin
tasks.register("processResources") {
    description = "处理资源文件"
    
    // 输入：资源文件
    inputs.files(fileTree("src/main/resources"))
    
    // 输入：处理配置
    inputs.property("appName", project.name)
    inputs.property("version", project.version)
    
    // 输出：处理后的资源
    outputs.dir("build/resources/main")
    
    doLast {
        copy {
            from("src/main/resources")
            into("build/resources/main")
            expand(
                "appName" to inputs.properties["appName"],
                "version" to inputs.properties["version"]
            )
        }
    }
}
```

## 性能优化技巧

### 1. 正确声明输入/输出

```kotlin
// ✅ 推荐：明确声明所有输入和输出
tasks.register("process") {
    inputs.files("src")
    inputs.property("config", "value")
    outputs.dir("build/output")
}

// ❌ 不推荐：未声明输入/输出（无法增量构建）
tasks.register("process") {
    doLast {
        // 处理逻辑
    }
}
```

### 2. 避免不必要的输入

```kotlin
// ✅ 推荐：只声明必要的输入
tasks.register("compile") {
    inputs.files(sourceSets["main"].allJava)
    outputs.dir("build/classes")
}

// ❌ 不推荐：包含不必要的文件
tasks.register("compile") {
    inputs.files(fileTree(".") { include("**/*") })
    outputs.dir("build/classes")
}
```

### 3. 使用构建缓存

```kotlin
// ✅ 推荐：启用构建缓存
buildCache {
    local { enabled = true }
}

// 任务启用缓存
tasks.register("expensive") {
    outputs.cacheIf { true }
}
```

### 4. 避免在配置阶段执行代码

```kotlin
// ✅ 推荐：在 doLast 中执行
tasks.register("myTask") {
    doLast {
        // 执行逻辑
    }
}

// ❌ 不推荐：在配置阶段执行
tasks.register("myTask") {
    // 这会在配置阶段执行
    println("执行逻辑")
}
```

## 调试增量构建

### 查看任务状态

```bash
# 查看任务执行原因
./gradlew build --info

# 查看任务输入/输出
./gradlew build --debug
```

### 强制重新执行

```bash
# 强制重新执行所有任务
./gradlew build --rerun-tasks

# 清理后构建
./gradlew clean build
```

## 常见问题

### Q: 为什么任务总是执行？

A: 可能原因：
1. 未声明输入/输出
2. 输入/输出声明不正确
3. 输入/输出文件被修改

### Q: 如何查看任务为什么执行？

A: 使用 `./gradlew build --info` 查看任务执行原因。

### Q: 构建缓存和增量构建有什么区别？

A: 
- **增量构建**：在同一构建中跳过未变更的任务
- **构建缓存**：在不同构建之间共享任务结果

### Q: 如何清理构建缓存？

A: 删除 `.gradle/build-cache` 目录或使用 `./gradlew cleanBuildCache`（如果可用）。

## 总结

- **增量构建**：只执行变更的任务，提高构建速度
- **输入/输出声明**：明确声明任务的输入和输出
- **构建缓存**：在不同构建之间共享任务结果
- **任务缓存**：启用任务缓存进一步优化
- **性能优化**：正确声明输入/输出，使用缓存，避免配置阶段执行

掌握增量构建和构建缓存是优化 Gradle 构建性能的关键，它们可以显著减少构建时间。


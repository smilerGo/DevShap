# 任务基础

## 什么是任务？

任务是 Gradle 构建的基本执行单元。每个任务代表一个构建步骤，如编译代码、运行测试、打包应用等。任务可以依赖其他任务，形成任务图。

## 任务类型

### 内置任务

Gradle 和插件提供了许多内置任务：

```bash
# 查看所有任务
./gradlew tasks

# 常用内置任务
./gradlew compileJava    # 编译 Java 代码
./gradlew test           # 运行测试
./gradlew jar            # 打包 JAR
./gradlew clean          # 清理构建
./gradlew build          # 完整构建
```

### 自定义任务

```kotlin
// build.gradle.kts
tasks.register("hello") {
    doLast {
        println("Hello, Gradle!")
    }
}

// 执行任务
// ./gradlew hello
```

## 创建任务

### 使用 register

```kotlin
// 推荐方式：使用 register
tasks.register("greet") {
    description = "打印问候语"
    group = "custom"
    
    doLast {
        println("Hello from Gradle!")
    }
}
```

**实际应用场景**：

```kotlin
// 自定义任务：生成文档
tasks.register("generateDocs") {
    description = "生成项目文档"
    group = "documentation"
    
    doLast {
        println("正在生成文档...")
        // 文档生成逻辑
        exec {
            commandLine("doxygen", "Doxyfile")
        }
    }
}

// 自定义任务：部署应用
tasks.register("deploy") {
    description = "部署应用到服务器"
    group = "deployment"
    
    // 依赖构建任务
    dependsOn("build")
    
    doLast {
        println("正在部署应用...")
        // 部署逻辑
        exec {
            commandLine("scp", "build/libs/app.jar", "user@server:/app")
        }
    }
}
```

### 使用 create（不推荐）

```kotlin
// 不推荐：使用 create（立即创建）
tasks.create("hello") {
    doLast {
        println("Hello!")
    }
}
```

## 任务配置

### 基本属性

```kotlin
tasks.register("myTask") {
    // 任务描述
    description = "我的自定义任务"
    
    // 任务组
    group = "custom"
    
    // 是否启用
    enabled = true
    
    // 任务超时（秒）
    timeout.set(Duration.ofMinutes(5))
}
```

**实际应用场景**：

```kotlin
// 配置任务属性
tasks.register("longRunningTask") {
    description = "长时间运行的任务"
    group = "custom"
    timeout.set(Duration.ofMinutes(10))
    
    doLast {
        // 长时间运行的操作
    }
}

// 条件启用任务
tasks.register("deployToProduction") {
    description = "部署到生产环境"
    group = "deployment"
    
    // 只在特定条件下启用
    enabled = project.hasProperty("deploy.production")
    
    doLast {
        println("部署到生产环境...")
    }
}
```

### 任务依赖

```kotlin
tasks.register("taskA") {
    doLast {
        println("Task A")
    }
}

tasks.register("taskB") {
    dependsOn("taskA")
    doLast {
        println("Task B")
    }
}

// 执行 taskB 会自动先执行 taskA
// ./gradlew taskB
```

**实际应用场景**：

```kotlin
// 构建流程任务
tasks.register("compile") {
    doLast {
        println("编译代码...")
    }
}

tasks.register("test") {
    dependsOn("compile")
    doLast {
        println("运行测试...")
    }
}

tasks.register("package") {
    dependsOn("test")
    doLast {
        println("打包应用...")
    }
}

tasks.register("build") {
    dependsOn("package")
    doLast {
        println("构建完成！")
    }
}
```

### 任务顺序

```kotlin
tasks.register("taskA") {
    doLast {
        println("Task A")
    }
}

tasks.register("taskB") {
    // taskB 在 taskA 之后执行（但不依赖）
    mustRunAfter("taskA")
    doLast {
        println("Task B")
    }
}

tasks.register("taskC") {
    // taskC 在 taskA 之后执行（如果都执行）
    shouldRunAfter("taskA")
    doLast {
        println("Task C")
    }
}
```

## 任务操作

### doFirst 和 doLast

```kotlin
tasks.register("myTask") {
    doFirst {
        println("任务开始执行")
    }
    
    doLast {
        println("任务执行完成")
    }
}
```

**实际应用场景**：

```kotlin
// 带日志的任务
tasks.register("processData") {
    doFirst {
        println("开始处理数据...")
        println("输入文件: ${project.file("input.txt")}")
    }
    
    doLast {
        println("数据处理完成")
        println("输出文件: ${project.file("output.txt")}")
    }
}
```

### 使用 actions

```kotlin
tasks.register("myTask") {
    // 添加操作
    doLast {
        println("操作 1")
    }
    
    doLast {
        println("操作 2")
    }
    
    // 操作按添加顺序执行
}
```

## 任务类型

### Copy 任务

```kotlin
tasks.register<Copy>("copyFiles") {
    from("src/main/resources")
    into("build/resources")
    include("*.properties")
    exclude("*.tmp")
}
```

**实际应用场景**：

```kotlin
// 复制资源文件
tasks.register<Copy>("copyResources") {
    description = "复制资源文件到构建目录"
    group = "build"
    
    from("src/main/resources") {
        include("**/*.properties")
        include("**/*.xml")
        exclude("**/*.tmp")
    }
    into("build/resources")
    
    // 过滤文件内容
    filter { line ->
        line.replace("${project.version}", "1.0.0")
    }
}
```

### Delete 任务

```kotlin
tasks.register<Delete>("cleanBuild") {
    delete("build", "out", ".gradle")
}
```

### Exec 任务

```kotlin
tasks.register<Exec>("runScript") {
    commandLine("python", "script.py")
    workingDir = file("scripts")
    environment("ENV", "production")
}
```

**实际应用场景**：

```kotlin
// 运行数据库迁移
tasks.register<Exec>("migrateDatabase") {
    description = "运行数据库迁移"
    group = "database"
    
    commandLine("flyway", "migrate")
    workingDir = file("database")
    environment("DB_URL", project.findProperty("db.url") as String?)
    environment("DB_USER", project.findProperty("db.user") as String?)
}
```

### JavaExec 任务

```kotlin
tasks.register<JavaExec>("runApp") {
    classpath = sourceSets["main"].runtimeClasspath
    mainClass.set("com.example.Main")
    args("--port", "8080")
}
```

**实际应用场景**：

```kotlin
// 运行 Spring Boot 应用
tasks.register<JavaExec>("runSpringBoot") {
    description = "运行 Spring Boot 应用"
    group = "application"
    
    classpath = sourceSets["main"].runtimeClasspath
    mainClass.set("org.springframework.boot.loader.JarLauncher")
    
    args("--server.port=8080")
    environment("SPRING_PROFILES_ACTIVE", "dev")
}
```

## 增量构建

### 输入和输出

```kotlin
tasks.register("processFiles") {
    // 输入文件
    inputs.files("src/main/data")
    
    // 输出文件
    outputs.files("build/processed")
    
    doLast {
        // 处理文件
        println("处理文件...")
    }
}
```

**实际应用场景**：

```kotlin
// 代码生成任务（支持增量构建）
tasks.register("generateCode") {
    description = "生成代码"
    group = "code generation"
    
    // 输入：模板文件
    inputs.files(fileTree("src/main/templates") {
        include("**/*.template")
    })
    
    // 输入：配置文件
    inputs.property("version", project.version)
    
    // 输出：生成的代码
    outputs.dir("build/generated")
    
    doLast {
        // 只有输入或输出改变时才执行
        println("生成代码...")
    }
}
```

## 实际项目示例

### 示例 1：构建流程

```kotlin
// build.gradle.kts
tasks.register("cleanBuild") {
    description = "清理并构建项目"
    group = "build"
    
    dependsOn("clean", "build")
}

tasks.register("fullBuild") {
    description = "完整构建（包括测试和检查）"
    group = "build"
    
    dependsOn("clean", "check", "build")
}

tasks.register("quickBuild") {
    description = "快速构建（跳过测试）"
    group = "build"
    
    dependsOn("clean", "assemble")
}
```

### 示例 2：部署任务

```kotlin
tasks.register("deployToDev") {
    description = "部署到开发环境"
    group = "deployment"
    
    dependsOn("build")
    
    doLast {
        println("部署到开发环境...")
        exec {
            commandLine("scp", "build/libs/app.jar", "dev@server:/app")
        }
    }
}

tasks.register("deployToProd") {
    description = "部署到生产环境"
    group = "deployment"
    
    dependsOn("build")
    
    // 需要确认
    doLast {
        val confirm = System.console()?.readLine("确认部署到生产环境？(yes/no): ")
        if (confirm == "yes") {
            println("部署到生产环境...")
            exec {
                commandLine("scp", "build/libs/app.jar", "prod@server:/app")
            }
        } else {
            println("部署已取消")
        }
    }
}
```

### 示例 3：代码质量检查

```kotlin
tasks.register("codeQuality") {
    description = "运行代码质量检查"
    group = "verification"
    
    dependsOn("checkstyleMain", "checkstyleTest", "pmdMain", "pmdTest")
}

tasks.register("allChecks") {
    description = "运行所有检查"
    group = "verification"
    
    dependsOn("test", "codeQuality", "dependencyCheck")
}
```

## 最佳实践

### 1. 使用 register 而不是 create

```kotlin
// ✅ 推荐
tasks.register("myTask") { }

// ❌ 不推荐
tasks.create("myTask") { }
```

### 2. 设置描述和组

```kotlin
// ✅ 推荐
tasks.register("myTask") {
    description = "任务描述"
    group = "custom"
}

// ❌ 不推荐：没有描述
tasks.register("myTask") { }
```

### 3. 使用任务依赖

```kotlin
// ✅ 推荐：明确依赖关系
tasks.register("deploy") {
    dependsOn("build")
}

// ❌ 不推荐：手动执行
// ./gradlew build && ./gradlew deploy
```

### 4. 支持增量构建

```kotlin
// ✅ 推荐：声明输入和输出
tasks.register("process") {
    inputs.files("src")
    outputs.dir("build/processed")
}
```

## 常见问题

### Q: register 和 create 有什么区别？

A: `register` 是延迟创建任务（推荐），`create` 是立即创建任务。使用 `register` 可以提高构建配置阶段的性能。

### Q: 如何查看任务的依赖关系？

A: 使用 `./gradlew tasks --all` 或 `./gradlew taskTree`（需要插件）。

### Q: 如何跳过任务执行？

A: 使用 `-x` 选项，如 `./gradlew build -x test`。

### Q: 如何强制重新执行任务？

A: 使用 `--rerun-tasks` 选项，如 `./gradlew build --rerun-tasks`。

## 总结

- **任务**是构建的基本执行单元
- **创建任务**：使用 `register` 方法
- **任务配置**：描述、组、依赖、顺序
- **任务类型**：Copy、Delete、Exec、JavaExec 等
- **增量构建**：声明输入和输出
- **最佳实践**：使用 register、设置描述、支持增量构建

掌握任务的创建和配置是使用 Gradle 的核心技能，它让你能够灵活控制构建过程。



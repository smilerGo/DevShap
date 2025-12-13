# 二进制插件开发

## 创建插件项目

### 项目结构

```
plugin-project/
├── build.gradle.kts
├── settings.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── com/
                └── example/
                    └── MyPlugin.kt
```

### 插件类实现

```kotlin
// src/main/kotlin/com/example/MyPlugin.kt
package com.example

import org.gradle.api.Plugin
import org.gradle.api.Project

class MyPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        // 插件逻辑
        project.tasks.register("myTask") {
            doLast {
                println("Hello from MyPlugin!")
            }
        }
    }
}
```

**实际应用场景**：

```kotlin
// src/main/kotlin/com/example/CodeGeneratorPlugin.kt
package com.example

import org.gradle.api.Plugin
import org.gradle.api.Project

class CodeGeneratorPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        // 创建扩展
        val extension = project.extensions.create(
            "codeGenerator",
            CodeGeneratorExtension::class.java
        )
        
        // 注册任务
        project.tasks.register("generateCode", CodeGeneratorTask::class.java) {
            it.templateDir.set(extension.templateDir)
            it.outputDir.set(extension.outputDir)
        }
    }
}

// 扩展类
open class CodeGeneratorExtension {
    var templateDir: String = "src/main/templates"
    var outputDir: String = "build/generated"
}

// 任务类
abstract class CodeGeneratorTask : DefaultTask() {
    @get:InputDirectory
    abstract val templateDir: DirectoryProperty
    
    @get:OutputDirectory
    abstract val outputDir: DirectoryProperty
    
    @TaskAction
    fun generate() {
        // 生成代码逻辑
    }
}
```

## 插件配置

### build.gradle.kts

```kotlin
plugins {
    id("java-gradle-plugin")
    id("org.jetbrains.kotlin.jvm") version "1.9.0"
}

gradlePlugin {
    plugins {
        create("myPlugin") {
            id = "com.example.my-plugin"
            implementationClass = "com.example.MyPlugin"
        }
    }
}
```

## 测试插件

### 单元测试

```kotlin
// src/test/kotlin/com/example/MyPluginTest.kt
import org.gradle.testfixtures.ProjectBuilder
import org.junit.Test

class MyPluginTest {
    @Test
    fun `plugin applies successfully`() {
        val project = ProjectBuilder.builder().build()
        project.plugins.apply("com.example.my-plugin")
        
        assert(project.tasks.findByName("myTask") != null)
    }
}
```

## 总结

- **插件开发**：实现 Plugin<Project> 接口
- **插件配置**：在 build.gradle.kts 中配置
- **测试插件**：使用 ProjectBuilder 测试
- **最佳实践**：创建扩展、注册任务、编写测试

掌握二进制插件开发是创建可复用 Gradle 功能的关键。






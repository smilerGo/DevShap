# Gradle Wrapper 基础

## 什么是 Gradle Wrapper？

Gradle Wrapper（包装器）是一个脚本和配置文件，允许你在没有全局安装 Gradle 的情况下运行 Gradle 构建。它确保项目使用特定版本的 Gradle，保证构建的一致性和可重复性。

## Wrapper 的优势

1. **版本一致性**：确保所有开发者使用相同的 Gradle 版本
2. **无需安装**：不需要在系统上安装 Gradle
3. **CI/CD 友好**：CI 服务器不需要预先安装 Gradle
4. **快速上手**：新成员克隆项目后即可构建

## Wrapper 文件结构

当你初始化一个 Gradle 项目时，会生成以下 Wrapper 文件：

```
project-root/
├── gradlew              # Unix/Linux/macOS 执行脚本
├── gradlew.bat          # Windows 执行脚本
└── gradle/
    └── wrapper/
        ├── gradle-wrapper.jar      # Wrapper JAR 文件
        └── gradle-wrapper.properties # Wrapper 配置属性
```

## 初始化 Wrapper

### 方法 1：使用 gradle init

```bash
# 初始化新项目（会自动生成 Wrapper）
gradle init

# 选择项目类型
# 1: basic
# 2: application
# 3: library
# 4: Gradle plugin
```

**实际应用场景**：

```bash
# 创建 Java 应用项目
gradle init --type java-application

# 创建 Kotlin 库项目
gradle init --type kotlin-library

# 创建多项目构建
gradle init --type basic --dsl kotlin
```

### 方法 2：手动生成 Wrapper

```bash
# 如果已安装 Gradle，可以手动生成 Wrapper
gradle wrapper --gradle-version 8.5

# 指定分发类型
gradle wrapper --gradle-version 8.5 --distribution-type all
```

**实际应用场景**：

```bash
# 生成特定版本的 Wrapper
gradle wrapper --gradle-version 8.5

# 生成并指定分发类型（包含源码和文档）
gradle wrapper --gradle-version 8.5 --distribution-type all

# 生成并指定下载 URL（使用镜像）
gradle wrapper --gradle-version 8.5 \
  --gradle-distribution-url https://mirrors.cloud.tencent.com/gradle/gradle-8.5-bin.zip
```

## 使用 Wrapper

### 基本用法

```bash
# Unix/Linux/macOS
./gradlew build

# Windows
gradlew.bat build

# 查看 Gradle 版本
./gradlew --version

# 查看帮助
./gradlew --help
```

**实际应用场景**：

```bash
# 执行构建
./gradlew build

# 运行测试
./gradlew test

# 清理构建
./gradlew clean

# 查看所有任务
./gradlew tasks

# 运行应用
./gradlew run

# 发布到本地仓库
./gradlew publishToMavenLocal
```

## Wrapper 配置文件

### gradle-wrapper.properties

这个文件定义了 Wrapper 使用的 Gradle 版本和分发 URL。

```properties
# gradle/wrapper/gradle-wrapper.properties

distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

**配置说明**：

- `distributionBase`：分发基础目录（GRADLE_USER_HOME 或 PROJECT）
- `distributionPath`：相对于 distributionBase 的路径
- `distributionUrl`：Gradle 分发的下载 URL
- `networkTimeout`：网络超时时间（毫秒）
- `validateDistributionUrl`：是否验证分发 URL
- `zipStoreBase`：ZIP 存储基础目录
- `zipStorePath`：ZIP 存储路径

**实际应用场景**：

```properties
# 使用特定版本的 Gradle
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip

# 使用完整分发（包含源码和文档）
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-all.zip

# 使用国内镜像（加速下载）
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.5-bin.zip
```

## 升级 Wrapper 版本

### 方法 1：使用 wrapper 任务

```bash
# 升级到最新版本
./gradlew wrapper --gradle-version 8.5

# 升级到最新稳定版
./gradlew wrapper --gradle-version latest

# 升级到最新候选版
./gradlew wrapper --gradle-version release-candidate
```

**实际应用场景**：

```bash
# 升级到特定版本
./gradlew wrapper --gradle-version 8.5

# 升级并更新分发类型
./gradlew wrapper --gradle-version 8.5 --distribution-type all

# 验证升级后的版本
./gradlew --version
```

### 方法 2：手动修改配置文件

```properties
# 编辑 gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
```

然后运行：

```bash
./gradlew wrapper
```

## Wrapper 最佳实践

### 1. 提交 Wrapper 文件到版本控制

```bash
# .gitignore 中不应该忽略这些文件
# gradlew
# gradlew.bat
# gradle/wrapper/gradle-wrapper.jar
# gradle/wrapper/gradle-wrapper.properties
```

**原因**：
- 确保所有开发者使用相同的 Gradle 版本
- CI/CD 服务器可以直接使用 Wrapper
- 新成员可以立即开始工作

### 2. 使用固定版本

```properties
# ✅ 推荐：使用固定版本
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip

# ❌ 不推荐：使用 latest（可能导致构建不一致）
distributionUrl=https\://services.gradle.org/distributions/gradle-latest-bin.zip
```

### 3. 定期更新 Wrapper

```bash
# 检查当前版本
./gradlew --version

# 查看可用版本
# 访问 https://gradle.org/releases/

# 升级到新版本
./gradlew wrapper --gradle-version 8.6
```

## 实际项目示例

### 示例 1：标准 Java 项目

```bash
# 初始化项目
gradle init --type java-application --dsl kotlin

# 生成的文件结构
project/
├── gradlew
├── gradlew.bat
├── build.gradle.kts
├── settings.gradle.kts
└── gradle/
    └── wrapper/
        ├── gradle-wrapper.jar
        └── gradle-wrapper.properties
```

### 示例 2：多模块项目

```bash
# 创建多模块项目
gradle init --type basic --dsl kotlin

# 手动创建子模块
mkdir -p app lib

# 在每个子模块中可以使用父项目的 Wrapper
# 从项目根目录运行
./gradlew :app:build
./gradlew :lib:build
```

### 示例 3：CI/CD 集成

```yaml
# GitHub Actions 示例
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Grant execute permission
        run: chmod +x gradlew
      - name: Build
        run: ./gradlew build
      - name: Test
        run: ./gradlew test
```

## 常见问题

### Q: 为什么需要 Wrapper？

A: Wrapper 确保所有开发者和 CI 服务器使用相同的 Gradle 版本，避免"在我机器上能运行"的问题。

### Q: 可以删除 Wrapper 文件吗？

A: 不推荐。删除 Wrapper 文件后，其他开发者需要手动安装 Gradle，增加了项目设置的复杂性。

### Q: 如何更新 Wrapper JAR？

A: 运行 `./gradlew wrapper` 会自动更新 Wrapper JAR 文件。

### Q: Wrapper 文件应该提交到 Git 吗？

A: 是的，应该提交所有 Wrapper 文件（gradlew、gradlew.bat、gradle-wrapper.jar、gradle-wrapper.properties）。

### Q: 如何在不同操作系统上使用 Wrapper？

A: 
- Unix/Linux/macOS：使用 `./gradlew`
- Windows：使用 `gradlew.bat`
- 两者功能相同

## 故障排除

### 问题 1：Wrapper 下载失败

```bash
# 检查网络连接
ping services.gradle.org

# 使用镜像 URL
# 编辑 gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.5-bin.zip
```

### 问题 2：权限错误（Unix/Linux/macOS）

```bash
# 添加执行权限
chmod +x gradlew

# 验证权限
ls -l gradlew
```

### 问题 3：版本不匹配

```bash
# 检查当前版本
./gradlew --version

# 升级到所需版本
./gradlew wrapper --gradle-version 8.5
```

## 总结

- **Gradle Wrapper** 确保构建的一致性和可重复性
- **Wrapper 文件** 应该提交到版本控制系统
- **使用固定版本** 避免构建不一致
- **定期更新** Wrapper 以获得新功能和修复
- **CI/CD 友好** Wrapper 简化了持续集成配置

掌握 Wrapper 的使用是 Gradle 开发的基础，它让项目构建更加可靠和便捷。






# TypeScript 最佳实践和常见模式

本章节介绍 TypeScript 开发中的最佳实践、常见错误和解决方案。

## 1. 类型安全实践

### 避免使用 any

```typescript
// ❌ 不推荐：使用 any 失去类型检查
function processData(data: any): any {
  return data.value;
}

// ✅ 推荐：使用具体类型或泛型
function processData<T>(data: { value: T }): T {
  return data.value;
}

// ✅ 推荐：使用 unknown 代替 any
function processUnknown(data: unknown): void {
  if (typeof data === "string") {
    console.log(data.toUpperCase());
  }
}
```

### 使用 unknown 代替 any

```typescript
// ❌ 不推荐：any 会绕过所有类型检查
function handleError(error: any): void {
  console.log(error.message); // 可能运行时错误
}

// ✅ 推荐：unknown 需要类型检查
function handleError(error: unknown): void {
  if (error instanceof Error) {
    console.log(error.message); // 类型安全
  } else {
    console.log("未知错误");
  }
}
```

### 使用类型守卫

```typescript
// ❌ 不推荐：使用类型断言
function processValue(value: unknown): void {
  const str = value as string;
  console.log(str.toUpperCase()); // 可能运行时错误
}

// ✅ 推荐：使用类型守卫
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: unknown): void {
  if (isString(value)) {
    console.log(value.toUpperCase()); // 类型安全
  }
}
```

### 使用 const 断言

```typescript
// ❌ 不推荐：类型推断为 string[]
const colors = ["red", "green", "blue"];

// ✅ 推荐：使用 const 断言，类型为字面量类型
const colors = ["red", "green", "blue"] as const;
// 类型：readonly ["red", "green", "blue"]

// 实际应用
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
} as const;
```

## 2. 项目配置

### tsconfig.json 关键配置

```json
{
  "compilerOptions": {
    // 目标版本
    "target": "ES2020",
    "module": "ESNext",
    
    // 模块解析
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    
    // 类型检查
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // 额外检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // 装饰器
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    
    // 输出
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,
    
    // 库
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 严格模式配置

```json
{
  "compilerOptions": {
    // 启用所有严格检查
    "strict": true,
    
    // 或者单独配置
    "noImplicitAny": true,           // 禁止隐式 any
    "strictNullChecks": true,         // 严格的 null 检查
    "strictFunctionTypes": true,      // 严格的函数类型检查
    "strictBindCallApply": true,      // 严格的 bind/call/apply 检查
    "strictPropertyInitialization": true, // 严格的属性初始化检查
    "noImplicitThis": true,          // 禁止隐式 this
    "alwaysStrict": true              // 总是使用严格模式
  }
}
```

## 3. 常见错误和解决方案

### 错误 1：类型不匹配

```typescript
// ❌ 错误：类型不匹配
function greet(name: string): void {
  console.log(`Hello, ${name}`);
}

const user = { name: "张三" };
greet(user); // 错误：参数类型不匹配

// ✅ 解决方案 1：使用正确的类型
greet(user.name);

// ✅ 解决方案 2：使用类型断言（谨慎使用）
greet(user.name as string);

// ✅ 解决方案 3：修改函数签名
function greet(user: { name: string }): void {
  console.log(`Hello, ${user.name}`);
}
```

### 错误 2：空值检查

```typescript
// ❌ 错误：可能为 null 或 undefined
function getLength(str: string | null): number {
  return str.length; // 错误：str 可能为 null
}

// ✅ 解决方案：添加空值检查
function getLength(str: string | null): number {
  if (str === null) {
    return 0;
  }
  return str.length;
}

// ✅ 或者使用可选链
function getLength(str: string | null): number {
  return str?.length ?? 0;
}
```

### 错误 3：未初始化的属性

```typescript
// ❌ 错误：属性可能未初始化
class User {
  name: string; // 错误：属性未初始化
}

// ✅ 解决方案 1：在构造函数中初始化
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// ✅ 解决方案 2：使用参数属性
class User {
  constructor(public name: string) {}
}

// ✅ 解决方案 3：使用默认值
class User {
  name: string = "";
}

// ✅ 解决方案 4：使用可选属性
class User {
  name?: string;
}
```

### 错误 4：函数重载问题

```typescript
// ❌ 错误：函数重载签名不匹配
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  return value;
}

// ✅ 解决方案：实现签名必须兼容所有重载
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value * 2;
  }
}
```

### 错误 5：泛型约束问题

```typescript
// ❌ 错误：泛型没有约束
function getProperty<T>(obj: T, key: string): any {
  return obj[key]; // 错误：不能保证 key 是 T 的键
}

// ✅ 解决方案：使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## 4. 性能优化

### 使用 const 枚举

```typescript
// ❌ 普通枚举会生成 JavaScript 代码
enum Status {
  Pending,
  Approved,
  Rejected
}

// ✅ 常量枚举编译时内联，无运行时开销
const enum Status {
  Pending,
  Approved,
  Rejected
}
```

### 避免不必要的类型断言

```typescript
// ❌ 不推荐：不必要的类型断言
function process(data: unknown): void {
  const user = data as User;
  console.log(user.name);
}

// ✅ 推荐：使用类型守卫
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    "email" in data
  );
}

function process(data: unknown): void {
  if (isUser(data)) {
    console.log(data.name); // 类型安全
  }
}
```

### 使用类型导入

```typescript
// ❌ 不推荐：类型和值一起导入
import { User, getUser } from "./user";

// ✅ 推荐：分离类型导入（不会影响运行时）
import type { User } from "./user";
import { getUser } from "./user";

// ✅ 或者使用内联类型导入
import { type User, getUser } from "./user";
```

## 5. 代码组织最佳实践

### 使用接口定义契约

```typescript
// ✅ 推荐：使用接口定义契约
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

class UserRepository implements Repository<User> {
  // 实现接口方法
}
```

### 使用类型别名组织复杂类型

```typescript
// ✅ 推荐：使用类型别名组织复杂类型
type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  timestamp: number;
};

type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product>;
```

### 合理使用工具类型

```typescript
// ✅ 推荐：使用工具类型简化类型定义
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// 创建用户（不需要 id）
type CreateUserInput = Omit<User, "id">;

// 更新用户（所有字段可选）
type UpdateUserInput = Partial<Omit<User, "id">> & { id: number };

// 用户预览（只选择部分字段）
type UserPreview = Pick<User, "id" | "name">;
```

## 6. 错误处理模式

### 使用 Result 类型

```typescript
// ✅ 推荐：使用 Result 类型处理错误
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: new Error("请求失败") };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// 使用
const result = await fetchUser(1);
if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.message);
}
```

### 使用自定义错误类

```typescript
// ✅ 推荐：使用自定义错误类
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

function handleError(error: unknown): void {
  if (error instanceof ValidationError) {
    console.error(`验证错误 - 字段: ${error.field}, 值: ${error.value}`);
  } else if (error instanceof NetworkError) {
    console.error(`网络错误 - 状态码: ${error.statusCode}`);
  } else if (error instanceof Error) {
    console.error(`标准错误: ${error.message}`);
  } else {
    console.error("未知错误");
  }
}
```

## 7. 测试相关

### 类型测试

```typescript
// ✅ 使用类型测试确保类型正确
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

// 测试类型
type Test1 = Expect<Equal<string, string>>; // ✅
// type Test2 = Expect<Equal<string, number>>; // ❌ 类型错误
```

### Mock 类型

```typescript
// ✅ 创建 Mock 类型用于测试
type MockUser = {
  id: number;
  name: string;
  email: string;
};

function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: 1,
    name: "测试用户",
    email: "test@example.com",
    ...overrides
  };
}
```

## 8. 文档和注释

### 使用 JSDoc 注释

```typescript
/**
 * 获取用户信息
 * @param id - 用户 ID
 * @returns 用户对象，如果不存在则返回 null
 * @throws {ValidationError} 当 id 无效时抛出
 * @example
 * ```typescript
 * const user = await getUser(1);
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
async function getUser(id: number): Promise<User | null> {
  if (id <= 0) {
    throw new ValidationError("无效的用户 ID", "id", id);
  }
  // 实现逻辑
  return null;
}
```

### 类型注释

```typescript
// ✅ 推荐：为复杂类型添加注释
/**
 * API 响应类型
 * @template T - 响应数据的类型
 */
type ApiResponse<T> = {
  /** HTTP 状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
};
```

## 总结

- **类型安全**：避免使用 any，使用 unknown 和类型守卫
- **项目配置**：启用严格模式，合理配置 tsconfig.json
- **常见错误**：了解常见错误类型和解决方案
- **性能优化**：使用 const 枚举，避免不必要的类型断言
- **代码组织**：使用接口、类型别名和工具类型
- **错误处理**：使用 Result 类型和自定义错误类
- **测试**：使用类型测试确保类型正确
- **文档**：使用 JSDoc 注释提高代码可读性
- **最佳实践**：
  - 优先使用类型推断，只在必要时添加类型注解
  - 使用 const 断言创建字面量类型
  - 使用工具类型简化类型定义
  - 合理使用泛型提高代码复用性
  - 使用类型守卫确保类型安全



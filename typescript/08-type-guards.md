# TypeScript 类型守卫和类型收窄

类型守卫（Type Guards）是 TypeScript 中用于缩小类型范围的表达式，帮助编译器确定在特定作用域内变量的具体类型。

## 1. typeof 守卫

`typeof` 用于检查基本类型（string、number、boolean、symbol、undefined、object、function）。

### 基本用法

```typescript
function processValue(value: string | number): void {
  if (typeof value === "string") {
    // 在这个分支中，value 的类型被收窄为 string
    console.log(value.toUpperCase()); // ✅ 可以使用 string 的方法
  } else {
    // 在这个分支中，value 的类型被收窄为 number
    console.log(value.toFixed(2)); // ✅ 可以使用 number 的方法
  }
}

// 实际应用：处理多种类型的输入
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "是" : "否";
  }
}
```

### typeof 的限制

```typescript
// typeof null 返回 "object"（JavaScript 的历史遗留问题）
function checkNull(value: string | null): void {
  if (typeof value === "object") {
    // ❌ 这里 value 可能是 string | null
    // console.log(value.toUpperCase()); // 错误：value 可能是 null
  }
  
  // 正确的检查方式
  if (value === null) {
    console.log("值为 null");
  } else {
    console.log(value.toUpperCase()); // ✅ value 被收窄为 string
  }
}
```

## 2. instanceof 守卫

`instanceof` 用于检查对象是否是某个类的实例。

### 基本用法

```typescript
class Dog {
  name: string;
  breed: string;

  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }

  bark(): void {
    console.log("汪汪！");
  }
}

class Cat {
  name: string;
  color: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
  }

  meow(): void {
    console.log("喵喵！");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    // 在这个分支中，animal 的类型被收窄为 Dog
    animal.bark(); // ✅ 可以调用 Dog 的方法
  } else {
    // 在这个分支中，animal 的类型被收窄为 Cat
    animal.meow(); // ✅ 可以调用 Cat 的方法
  }
}
```

### 实际应用场景

```typescript
// 错误处理
class ValidationError extends Error {
  field: string;

  constructor(message: string, field: string) {
    super(message);
    this.field = field;
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "NetworkError";
  }
}

function handleError(error: Error): void {
  if (error instanceof ValidationError) {
    console.error(`验证错误 - 字段: ${error.field}, 消息: ${error.message}`);
  } else if (error instanceof NetworkError) {
    console.error(`网络错误 - 状态码: ${error.statusCode}, 消息: ${error.message}`);
  } else {
    console.error(`未知错误: ${error.message}`);
  }
}
```

## 3. in 操作符守卫

`in` 操作符用于检查对象是否具有某个属性。

### 基本用法

```typescript
interface Dog {
  name: string;
  breed: string;
  bark(): void;
}

interface Cat {
  name: string;
  color: string;
  meow(): void;
}

function makeSound(animal: Dog | Cat): void {
  if ("breed" in animal) {
    // 在这个分支中，animal 的类型被收窄为 Dog
    animal.bark(); // ✅ 可以调用 Dog 的方法
  } else {
    // 在这个分支中，animal 的类型被收窄为 Cat
    animal.meow(); // ✅ 可以调用 Cat 的方法
  }
}
```

### 实际应用场景

```typescript
// 可辨识联合类型
type SuccessResponse = {
  status: "success";
  data: any;
};

type ErrorResponse = {
  status: "error";
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
  if ("data" in response) {
    // response 被收窄为 SuccessResponse
    console.log("数据：", response.data);
  } else {
    // response 被收窄为 ErrorResponse
    console.error("错误：", response.error);
  }
}

// 或者使用可辨识属性
function handleResponse2(response: ApiResponse): void {
  if (response.status === "success") {
    console.log("数据：", response.data);
  } else {
    console.error("错误：", response.error);
  }
}
```

## 4. 自定义类型守卫

自定义类型守卫是返回类型谓词（`parameterName is Type`）的函数。

### 基本语法

```typescript
// 自定义类型守卫函数
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processValue(value: unknown): void {
  if (isString(value)) {
    // value 被收窄为 string
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    // value 被收窄为 number
    console.log(value.toFixed(2));
  }
}
```

### 实际应用场景

```typescript
// 检查对象类型
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  );
}

function processUser(data: unknown): void {
  if (isUser(data)) {
    // data 被收窄为 User
    console.log(`用户: ${data.name} (${data.email})`);
  } else {
    console.error("无效的用户数据");
  }
}

// 检查数组类型
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(item => typeof item === "string")
  );
}

function processStrings(data: unknown): void {
  if (isStringArray(data)) {
    // data 被收窄为 string[]
    data.forEach(str => console.log(str.toUpperCase()));
  }
}
```

### 复杂类型守卫

```typescript
// 检查 API 响应类型
interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: string;
}

type ApiResult<T> = ApiSuccess<T> | ApiError;

function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.success === true;
}

function handleApiResult<T>(result: ApiResult<T>): T | null {
  if (isApiSuccess(result)) {
    // result 被收窄为 ApiSuccess<T>
    return result.data;
  } else {
    // result 被收窄为 ApiError
    console.error(result.error);
    return null;
  }
}
```

## 5. 类型收窄的其他方式

### 相等性检查

```typescript
function processValue(value: string | null | undefined): void {
  // 使用 === 或 !== 进行类型收窄
  if (value === null) {
    console.log("值为 null");
    return;
  }
  
  if (value === undefined) {
    console.log("值为 undefined");
    return;
  }
  
  // 此时 value 被收窄为 string
  console.log(value.toUpperCase());
}

// 检查字面量类型
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): void {
  if (status === "pending") {
    console.log("待处理");
  } else if (status === "approved") {
    console.log("已批准");
  } else {
    // status 被收窄为 "rejected"
    console.log("已拒绝");
  }
}
```

### 真值检查

```typescript
function processValue(value: string | null | undefined): void {
  // 真值检查会收窄类型
  if (value) {
    // value 被收窄为 string（排除了 null 和 undefined）
    console.log(value.toUpperCase());
  } else {
    // value 可能是 null 或 undefined 或空字符串
    console.log("值为空");
  }
}

// 更精确的检查
function processValue2(value: string | null | undefined): void {
  if (value != null) {
    // value 被收窄为 string（排除了 null 和 undefined）
    console.log(value.toUpperCase());
  }
}
```

### 类型断言函数

```typescript
// 抛出异常的类型守卫
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("值必须是字符串");
  }
}

function processValue(value: unknown): void {
  assertIsString(value); // 如果 value 不是 string，会抛出异常
  // 此时 value 被收窄为 string
  console.log(value.toUpperCase());
}

// 断言非空
function assertNotNull<T>(value: T | null): asserts value is T {
  if (value === null) {
    throw new Error("值不能为 null");
  }
}

function processValue2(value: string | null): void {
  assertNotNull(value);
  // 此时 value 被收窄为 string
  console.log(value.toUpperCase());
}
```

## 6. 类型收窄的实际应用

### API 响应处理

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: "网络错误" };
  }
}

async function displayUser(id: number): Promise<void> {
  const result = await fetchUser(id);
  
  if (result.success) {
    // result 被收窄为 { success: true; data: User }
    console.log(`用户: ${result.data.name} (${result.data.email})`);
  } else {
    // result 被收窄为 { success: false; error: string }
    console.error(`错误: ${result.error}`);
  }
}
```

### 表单验证

```typescript
type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; error: string };

function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(email)) {
    return { valid: true, value: email };
  } else {
    return { valid: false, error: "无效的邮箱地址" };
  }
}

function processEmail(email: string): void {
  const result = validateEmail(email);
  
  if (result.valid) {
    // result 被收窄为 { valid: true; value: string }
    console.log(`有效的邮箱: ${result.value}`);
  } else {
    // result 被收窄为 { valid: false; error: string }
    console.error(`验证失败: ${result.error}`);
  }
}
```

### 错误处理

```typescript
class CustomError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }
}

function isCustomError(error: unknown): error is CustomError {
  return error instanceof CustomError;
}

async function riskyOperation(): Promise<void> {
  try {
    // 可能抛出错误的操作
    throw new CustomError("操作失败", "OPERATION_FAILED");
  } catch (error) {
    if (isCustomError(error)) {
      // error 被收窄为 CustomError
      console.error(`自定义错误 [${error.code}]: ${error.message}`);
    } else if (error instanceof Error) {
      // error 被收窄为 Error
      console.error(`标准错误: ${error.message}`);
    } else {
      // error 被收窄为 unknown
      console.error("未知错误");
    }
  }
}
```

## 7. 类型收窄的最佳实践

### 1. 优先使用类型守卫而不是类型断言

```typescript
// ❌ 不推荐：使用类型断言
function processValue(value: unknown): void {
  const str = value as string;
  console.log(str.toUpperCase()); // 可能运行时错误
}

// ✅ 推荐：使用类型守卫
function processValue(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // 类型安全
  }
}
```

### 2. 使用可辨识联合类型

```typescript
// ✅ 使用可辨识联合类型，TypeScript 可以自动收窄
type Result<T> =
  | { type: "success"; data: T }
  | { type: "error"; message: string };

function handleResult<T>(result: Result<T>): void {
  switch (result.type) {
    case "success":
      // result 自动收窄为 { type: "success"; data: T }
      console.log(result.data);
      break;
    case "error":
      // result 自动收窄为 { type: "error"; message: string }
      console.error(result.message);
      break;
  }
}
```

### 3. 创建可复用的类型守卫

```typescript
// ✅ 创建可复用的类型守卫函数
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function processValues(values: (string | null)[]): void {
  const definedValues = values.filter(isDefined);
  // definedValues 的类型是 string[]
  definedValues.forEach(str => console.log(str.toUpperCase()));
}
```

## 总结

- **typeof 守卫**：用于检查基本类型（string、number、boolean 等）
- **instanceof 守卫**：用于检查对象是否是某个类的实例
- **in 操作符守卫**：用于检查对象是否具有某个属性
- **自定义类型守卫**：使用类型谓词创建自定义的类型检查函数
- **类型收窄**：通过条件检查缩小变量的类型范围，提高类型安全性
- **最佳实践**：
  - 优先使用类型守卫而不是类型断言
  - 使用可辨识联合类型提高类型安全性
  - 创建可复用的类型守卫函数
  - 合理使用真值检查和相等性检查



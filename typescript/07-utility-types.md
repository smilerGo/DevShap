# TypeScript 实用工具类型

TypeScript 提供了许多内置的工具类型，帮助我们更方便地操作和转换类型。

## 1. 内置工具类型

### Partial<T>

将所有属性变为可选。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
// }

// 实际应用：更新函数
function updateUser(id: number, updates: Partial<User>): void {
  // 只更新提供的字段
  console.log(`更新用户 ${id}:`, updates);
}

updateUser(1, { name: "新名字" }); // ✅ 只更新 name
updateUser(1, { email: "new@example.com", age: 30 }); // ✅ 更新多个字段
```

### Required<T>

将所有属性变为必需（移除可选标记）。

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// {
//   apiUrl: string;
//   timeout: number;
//   retries: number;
// }

// 实际应用：确保配置完整
function initializeApp(config: RequiredConfig): void {
  // 所有配置项都是必需的
  console.log(config.apiUrl, config.timeout, config.retries);
}
```

### Readonly<T>

将所有属性变为只读。

```typescript
type ReadonlyUser = Readonly<User>;
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
//   readonly age: number;
// }

const user: ReadonlyUser = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
};

// user.name = "李四"; // ❌ 错误：只读属性不能修改
```

### Pick<T, K>

选择对象类型的部分属性。

```typescript
type UserPreview = Pick<User, "id" | "name">;
// {
//   id: number;
//   name: string;
// }

// 实际应用：API 响应简化
interface FullUser extends User {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

type PublicUser = Pick<FullUser, "id" | "name" | "email">;
// 只暴露公开字段，隐藏敏感信息
```

### Omit<T, K>

排除对象类型的部分属性。

```typescript
type UserWithoutId = Omit<User, "id">;
// {
//   name: string;
//   email: string;
//   age: number;
// }

// 实际应用：创建用户（不需要 id）
type CreateUserInput = Omit<User, "id">;

function createUser(input: CreateUserInput): User {
  return {
    id: generateId(),
    ...input
  };
}
```

### Record<K, T>

创建记录类型，键类型为 K，值类型为 T。

```typescript
type UserRecord = Record<string, User>;
// { [key: string]: User }

const users: UserRecord = {
  "user-1": { id: 1, name: "张三", email: "", age: 25 },
  "user-2": { id: 2, name: "李四", email: "", age: 30 }
};

// 实际应用：状态映射
type Status = "pending" | "approved" | "rejected";
type StatusConfig = Record<Status, { color: string; icon: string }>;

const statusConfig: StatusConfig = {
  pending: { color: "yellow", icon: "⏳" },
  approved: { color: "green", icon: "✅" },
  rejected: { color: "red", icon: "❌" }
};
```

### Exclude<T, U>

从类型 T 中排除可以赋值给 U 的类型。

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<string | number | boolean, number>; // string | boolean
type T2 = Exclude<string | (() => void), Function>; // string

// 实际应用：过滤类型
type NonNullable<T> = Exclude<T, null | undefined>;

type T3 = NonNullable<string | null | undefined>; // string
```

### Extract<T, U>

从类型 T 中提取可以赋值给 U 的类型。

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | boolean, number>; // number
type T2 = Extract<string | (() => void), Function>; // () => void

// 实际应用：提取函数类型
type FunctionTypes = Extract<string | number | (() => void), Function>; // () => void
```

### NonNullable<T>

排除 null 和 undefined。

```typescript
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]

// 实际应用：确保值不为空
function processValue<T>(value: NonNullable<T>): void {
  // value 不会是 null 或 undefined
  console.log(value);
}
```

### Parameters<T>

获取函数类型的参数类型元组。

```typescript
function createUser(name: string, age: number, email: string): User {
  return { id: 1, name, email, age };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number, string]

// 实际应用：函数包装
function wrapFunction<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    console.log("调用函数:", args);
    return fn(...args);
  };
}
```

### ReturnType<T>

获取函数类型的返回类型。

```typescript
type CreateUserReturn = ReturnType<typeof createUser>; // User

// 实际应用：异步函数返回类型
async function fetchUser(id: number): Promise<User> {
  return { id, name: "", email: "", age: 0 };
}

type FetchUserReturn = Awaited<ReturnType<typeof fetchUser>>; // User
```

### ConstructorParameters<T>

获取构造函数类型的参数类型元组。

```typescript
class User {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>; // [number, string, string]

// 实际应用：工厂函数
function createInstance<T extends new (...args: any[]) => any>(
  Constructor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new Constructor(...args);
}

const user = createInstance(User, 1, "张三", "zhangsan@example.com");
```

### InstanceType<T>

获取构造函数类型的实例类型。

```typescript
type UserInstance = InstanceType<typeof User>; // User

// 实际应用：类型安全的工厂
function createUserInstance(
  ...args: ConstructorParameters<typeof User>
): InstanceType<typeof User> {
  return new User(...args);
}
```

### Awaited<T>

获取 Promise 的解析类型（TypeScript 4.5+）。

```typescript
type PromiseUser = Promise<User>;
type ResolvedUser = Awaited<PromiseUser>; // User

// 实际应用：处理异步函数返回类型
async function getUser(): Promise<User> {
  return { id: 1, name: "", email: "", age: 0 };
}

type UserResult = Awaited<ReturnType<typeof getUser>>; // User
```

## 2. 自定义工具类型

### 深度操作类型

```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// 深度部分
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// 深度必需
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object
    ? DeepRequired<T[P]>
    : T[P];
};

// 使用示例
interface NestedConfig {
  api: {
    url: string;
    timeout?: number;
  };
  database: {
    host?: string;
    port?: number;
  };
}

type ReadonlyConfig = DeepReadonly<NestedConfig>;
type PartialConfig = DeepPartial<NestedConfig>;
```

### 函数相关类型

```typescript
// 提取函数参数类型（第一个参数）
type FirstParameter<T> = T extends (first: infer F, ...args: any[]) => any
  ? F
  : never;

// 提取函数参数类型（最后一个参数）
type LastParameter<T> = T extends (...args: infer P) => any
  ? P extends [...any[], infer L]
    ? L
    : never
  : never;

// 提取所有参数类型（除了第一个）
type RestParameters<T> = T extends (first: any, ...rest: infer R) => any
  ? R
  : never;
```

### 对象操作类型

```typescript
// 获取所有值的类型
type ValueOf<T> = T[keyof T];

type UserValues = ValueOf<User>; // number | string

// 获取所有键的类型
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type StringKeys = KeysOfType<User, string>; // "name" | "email"

// 提取函数属性
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// 提取非函数属性
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
```

### 条件工具类型

```typescript
// 检查类型是否相同
type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? true
  : false;

// 检查类型是否为 never
type IsNever<T> = [T] extends [never] ? true : false;

// 检查类型是否为 any
type IsAny<T> = 0 extends 1 & T ? true : false;

// 检查类型是否为 unknown
type IsUnknown<T> = IsNever<T> extends false
  ? T extends unknown
    ? unknown extends T
      ? IsAny<T> extends false
        ? true
        : false
      : false
    : false
  : false;
```

### 字符串操作类型

```typescript
// 移除字符串前缀
type RemovePrefix<S extends string, P extends string> = S extends `${P}${infer R}`
  ? R
  : S;

type WithoutOn = RemovePrefix<"onClick", "on">; // "Click"

// 移除字符串后缀
type RemoveSuffix<S extends string, Sf extends string> = S extends `${infer R}${Sf}`
  ? R
  : S;

type WithoutHandler = RemoveSuffix<"clickHandler", "Handler">; // "click"

// 替换字符串
type Replace<S extends string, From extends string, To extends string> = S extends `${infer L}${From}${infer R}`
  ? `${L}${To}${R}`
  : S;

type Replaced = Replace<"hello-world", "-", "_">; // "hello_world"
```

### 数组操作类型

```typescript
// 数组第一个元素
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;

// 数组最后一个元素
type Tail<T extends any[]> = T extends [...any[], infer L] ? L : never;

// 数组除第一个元素外的其余元素
type Rest<T extends any[]> = T extends [any, ...infer R] ? R : [];

// 数组长度
type Length<T extends any[]> = T["length"];

// 连接数组
type Concat<T extends any[], U extends any[]> = [...T, ...U];
```

### 实用组合类型

```typescript
// 创建更新类型（所有属性可选，除了指定的键）
type UpdateType<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UpdateUser = UpdateType<User, "id">;
// {
//   id: number; // 必需
//   name?: string;
//   email?: string;
//   age?: number;
// }

// 创建选择类型（选择部分属性，其余为可选）
type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

type UserWithRequiredName = PartialExcept<User, "name">;
// {
//   name: string; // 必需
//   id?: number;
//   email?: string;
//   age?: number;
// }

// 创建只读选择类型
type ReadonlyPick<T, K extends keyof T> = Readonly<Pick<T, K>>;

type ReadonlyUserInfo = ReadonlyPick<User, "id" | "name">;
```

## 3. 实际应用场景

### API 类型定义

```typescript
// API 请求和响应类型
type ApiRequest<T> = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: T;
};

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

// 创建用户请求（不需要 id）
type CreateUserRequest = Omit<User, "id">;

// 更新用户请求（所有字段可选）
type UpdateUserRequest = Partial<Omit<User, "id">> & { id: number };

// 用户列表响应
type UserListResponse = ApiResponse<User[]>;

// 单个用户响应
type UserResponse = ApiResponse<User>;
```

### 表单类型定义

```typescript
// 表单字段类型
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

// 表单类型
type Form<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// 用户表单
type UserForm = Form<Omit<User, "id">>;

// 表单提交数据
type FormSubmitData<T> = {
  [K in keyof T]: T[K] extends FormField<infer U> ? U : never;
};
```

## 总结

- **内置工具类型**：TypeScript 提供了丰富的内置工具类型，如 Partial、Required、Pick、Omit 等
- **自定义工具类型**：可以根据需求创建自定义工具类型，如深度操作、字符串操作等
- **实际应用**：工具类型在 API 定义、表单处理、状态管理等场景中非常有用
- **最佳实践**：
  - 优先使用内置工具类型
  - 根据项目需求创建可复用的自定义工具类型
  - 使用工具类型提高代码的类型安全性和可维护性
  - 合理组合多个工具类型实现复杂需求



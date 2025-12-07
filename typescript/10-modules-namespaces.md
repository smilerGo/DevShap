# TypeScript 模块和命名空间

模块和命名空间是 TypeScript 中组织代码的两种方式，帮助管理代码的复杂性和避免命名冲突。

## 1. ES 模块

ES 模块是 JavaScript 的标准模块系统，TypeScript 完全支持 ES 模块语法。

### export 导出

```typescript
// math.ts
// 命名导出
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// 默认导出
export default function multiply(a: number, b: number): number {
  return a * b;
}

// 导出类型
export interface Point {
  x: number;
  y: number;
}

export type Status = "pending" | "approved" | "rejected";
```

### import 导入

```typescript
// main.ts
// 命名导入
import { add, subtract, PI } from "./math";

// 默认导入
import multiply from "./math";

// 导入所有（命名空间导入）
import * as MathUtils from "./math";

// 导入类型
import type { Point, Status } from "./math";
// 或者
import { type Point, type Status } from "./math";

// 使用
const sum = add(1, 2);
const product = multiply(3, 4);
const result = MathUtils.subtract(10, 5);
```

### 重新导出

```typescript
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// index.ts（重新导出）
export { formatDate, formatCurrency } from "./utils";
export { add, subtract } from "./math";

// 或者重新导出所有
export * from "./utils";
export * from "./math";

// 使用
import { formatDate, add } from "./index";
```

### 实际应用场景

```typescript
// user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserService {
  async getUser(id: number): Promise<User> {
    // 获取用户逻辑
    return { id, name: "", email: "" };
  }
}

// api.ts
import { User, UserService } from "./user";

export class ApiClient {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async fetchUser(id: number): Promise<User> {
    return this.userService.getUser(id);
  }
}
```

## 2. 命名空间（Namespace）

命名空间是 TypeScript 特有的组织代码的方式，用于组织相关的代码。

### 基本用法

```typescript
// 定义命名空间
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function subtract(a: number, b: number): number {
    return a - b;
  }

  // 私有函数（不导出）
  function internalHelper(): void {
    // 只能在命名空间内部使用
  }

  // 嵌套命名空间
  export namespace Geometry {
    export interface Point {
      x: number;
      y: number;
    }

    export function distance(p1: Point, p2: Point): number {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
}

// 使用命名空间
const sum = MathUtils.add(1, 2);
const point1: MathUtils.Geometry.Point = { x: 0, y: 0 };
const point2: MathUtils.Geometry.Point = { x: 3, y: 4 };
const dist = MathUtils.Geometry.distance(point1, point2);
```

### 命名空间合并

```typescript
// 第一次声明
namespace MyNamespace {
  export interface User {
    id: number;
    name: string;
  }
}

// 第二次声明（自动合并）
namespace MyNamespace {
  export interface Product {
    id: number;
    name: string;
    price: number;
  }

  export function getUser(id: number): User {
    return { id, name: "" };
  }
}

// 使用合并后的命名空间
const user: MyNamespace.User = { id: 1, name: "张三" };
const product: MyNamespace.Product = { id: 1, name: "商品", price: 99 };
```

### 命名空间与类合并

```typescript
class MyClass {
  constructor(public name: string) {}
}

namespace MyClass {
  export function create(name: string): MyClass {
    return new MyClass(name);
  }

  export interface Config {
    timeout: number;
    retries: number;
  }
}

// 使用
const instance = MyClass.create("实例");
const config: MyClass.Config = { timeout: 5000, retries: 3 };
```

### 命名空间与函数合并

```typescript
function buildUrl(path: string): string {
  return `https://api.example.com${path}`;
}

namespace buildUrl {
  export function withVersion(path: string, version: string): string {
    return `https://api.example.com/v${version}${path}`;
  }
}

// 使用
const url1 = buildUrl("/users");
const url2 = buildUrl.withVersion("/users", "2");
```

### 命名空间与枚举合并

```typescript
enum Color {
  Red,
  Green,
  Blue
}

namespace Color {
  export function getHex(color: Color): string {
    switch (color) {
      case Color.Red:
        return "#FF0000";
      case Color.Green:
        return "#00FF00";
      case Color.Blue:
        return "#0000FF";
    }
  }
}

// 使用
const redHex = Color.getHex(Color.Red); // "#FF0000"
```

## 3. 模块解析

TypeScript 支持两种模块解析策略：`node` 和 `classic`。

### Node 模块解析（推荐）

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}

// 导入示例
import { something } from "my-module";
// TypeScript 会按以下顺序查找：
// 1. ./node_modules/my-module.ts
// 2. ./node_modules/my-module.tsx
// 3. ./node_modules/my-module.d.ts
// 4. ./node_modules/my-module/package.json (types 字段)
// 5. ./node_modules/my-module/index.ts
// 6. ../node_modules/my-module/...
```

### 路径映射

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"],
      "@components/*": ["src/components/*"]
    }
  }
}

// 使用路径映射
import { formatDate } from "@utils/date";
import { Button } from "@components/Button";
```

### 类型声明文件

```typescript
// types.d.ts
declare module "my-module" {
  export interface Config {
    apiUrl: string;
    timeout: number;
  }

  export function initialize(config: Config): void;
}

// 使用
import { initialize, Config } from "my-module";

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

initialize(config);
```

## 4. 模块 vs 命名空间

### 使用模块的场景

```typescript
// ✅ 推荐：使用 ES 模块
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// main.ts
import { add } from "./math";

// 优势：
// 1. 标准 JavaScript 语法
// 2. 更好的 tree-shaking
// 3. 更好的代码分割
// 4. 运行时支持
```

### 使用命名空间的场景

```typescript
// ✅ 适合：组织相关代码，避免全局污染
namespace Validation {
  export interface Validator {
    validate(value: string): boolean;
  }

  export class EmailValidator implements Validator {
    validate(value: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  }
}

// 优势：
// 1. 避免全局命名冲突
// 2. 可以合并声明
// 3. 组织相关代码
```

### 混合使用

```typescript
// 在模块中使用命名空间
// validation.ts
export namespace Validation {
  export interface Validator {
    validate(value: string): boolean;
  }

  export class EmailValidator implements Validator {
    validate(value: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  }
}

// main.ts
import { Validation } from "./validation";

const validator = new Validation.EmailValidator();
```

## 5. 实际应用场景

### 工具库组织

```typescript
// utils/string.ts
export namespace StringUtils {
  export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  export function reverse(str: string): string {
    return str.split("").reverse().join("");
  }
}

// utils/date.ts
export namespace DateUtils {
  export function format(date: Date, format: string): string {
    // 格式化逻辑
    return date.toISOString();
  }

  export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

// index.ts
export * from "./utils/string";
export * from "./utils/date";

// 使用
import { StringUtils, DateUtils } from "./utils";

const capitalized = StringUtils.capitalize("hello");
const formatted = DateUtils.format(new Date(), "YYYY-MM-DD");
```

### 类型定义组织

```typescript
// types/api.d.ts
declare namespace Api {
  interface Response<T> {
    code: number;
    message: string;
    data: T;
  }

  interface User {
    id: number;
    name: string;
    email: string;
  }
}

// 使用
function fetchUser(id: number): Promise<Api.Response<Api.User>> {
  // 实现
  return Promise.resolve({
    code: 200,
    message: "成功",
    data: { id, name: "", email: "" }
  });
}
```

### 第三方库类型扩展

```typescript
// 扩展第三方库类型
declare namespace Express {
  interface Request {
    user?: {
      id: number;
      name: string;
    };
  }
}

// 使用
import { Request } from "express";

function handler(req: Request): void {
  if (req.user) {
    console.log(req.user.name);
  }
}
```

## 6. 最佳实践

### 1. 优先使用 ES 模块

```typescript
// ✅ 推荐：使用 ES 模块
export function add(a: number, b: number): number {
  return a + b;
}

// ❌ 不推荐：使用命名空间（除非有特殊需求）
namespace Math {
  export function add(a: number, b: number): number {
    return a + b;
  }
}
```

### 2. 使用路径别名

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// ✅ 使用路径别名
import { User } from "@/types/user";
import { formatDate } from "@/utils/date";
```

### 3. 合理组织导出

```typescript
// ✅ 推荐：使用 index.ts 统一导出
// utils/index.ts
export { formatDate, formatCurrency } from "./date";
export { capitalize, reverse } from "./string";

// main.ts
import { formatDate, capitalize } from "./utils";
```

### 4. 使用类型导入

```typescript
// ✅ 推荐：使用类型导入（不会影响运行时）
import type { User } from "./types/user";
import { type User, getUser } from "./types/user";
```

## 总结

- **ES 模块**：标准 JavaScript 模块系统，推荐使用，支持 tree-shaking 和代码分割
- **命名空间**：TypeScript 特有，用于组织代码和避免命名冲突
- **模块解析**：TypeScript 支持 node 和 classic 两种解析策略
- **路径映射**：使用 `paths` 配置简化导入路径
- **实际应用**：工具库组织、类型定义组织、第三方库类型扩展
- **最佳实践**：
  - 优先使用 ES 模块
  - 使用路径别名简化导入
  - 合理组织导出
  - 使用类型导入提高性能



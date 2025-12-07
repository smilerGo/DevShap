# TypeScript 枚举

枚举（Enums）是 TypeScript 提供的一种组织相关常量的方式，可以创建一组有名字的常量。

## 1. 数字枚举

数字枚举是默认的枚举类型，成员的值是数字。

### 基本用法

```typescript
// 数字枚举（默认从 0 开始）
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// 使用枚举
const direction = Direction.Up;
console.log(direction); // 0
console.log(Direction[0]); // "Up"（反向映射）

// 手动指定值
enum Status {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

// 部分手动指定（后续值自动递增）
enum Status2 {
  Pending = 1,
  Approved,  // 2
  Rejected  // 3
}
```

### 实际应用场景

```typescript
// HTTP 状态码
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500
}

function handleResponse(status: HttpStatus): void {
  switch (status) {
    case HttpStatus.OK:
      console.log("请求成功");
      break;
    case HttpStatus.NotFound:
      console.log("资源未找到");
      break;
    case HttpStatus.InternalServerError:
      console.log("服务器错误");
      break;
  }
}

// 用户角色
enum UserRole {
  Guest = 0,
  User = 1,
  Moderator = 2,
  Admin = 3
}

function checkPermission(role: UserRole): boolean {
  return role >= UserRole.Moderator;
}
```

## 2. 字符串枚举

字符串枚举的每个成员都是字符串字面量。

### 基本用法

```typescript
// 字符串枚举
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

// 使用枚举
const direction = Direction.Up;
console.log(direction); // "UP"

// 注意：字符串枚举没有反向映射
// console.log(Direction["UP"]); // ❌ 错误
```

### 实际应用场景

```typescript
// API 端点
enum ApiEndpoint {
  Users = "/api/users",
  Products = "/api/products",
  Orders = "/api/orders"
}

function fetchData(endpoint: ApiEndpoint): void {
  console.log(`请求 ${endpoint}`);
}

fetchData(ApiEndpoint.Users); // "请求 /api/users"

// 主题类型
enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto"
}

function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

setTheme(Theme.Dark);

// 事件类型
enum EventType {
  Click = "click",
  Change = "change",
  Submit = "submit"
}

function addEventListener(type: EventType, handler: () => void): void {
  document.addEventListener(type, handler);
}
```

## 3. 异构枚举

异构枚举混合了数字和字符串成员（不推荐使用）。

```typescript
// 异构枚举（不推荐）
enum MixedEnum {
  No = 0,
  Yes = "YES"
}

// 使用
const value = MixedEnum.Yes; // "YES"
```

## 4. 常量枚举

常量枚举使用 `const enum` 关键字，在编译时会被内联，不会生成 JavaScript 代码。

### 基本用法

```typescript
// 常量枚举
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 使用（编译后直接使用值）
const direction = Direction.Up; // 编译后：const direction = 0;

// 注意：常量枚举不能有计算成员
// const enum Status {
//   Pending = getValue() // ❌ 错误：不能有计算成员
// }
```

### 性能优势

```typescript
// 普通枚举会生成 JavaScript 对象
enum RegularEnum {
  A = 1,
  B = 2
}
// 编译后生成：
// var RegularEnum;
// (function (RegularEnum) {
//     RegularEnum[RegularEnum["A"] = 1] = "A";
//     RegularEnum[RegularEnum["B"] = 2] = "B";
// })(RegularEnum || (RegularEnum = {}));

// 常量枚举直接内联值
const enum ConstEnum {
  A = 1,
  B = 2
}
// 编译后：直接使用 1 或 2，不生成对象
```

### 使用场景

```typescript
// 常量枚举适合用于不会改变的常量集合
const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

function makeRequest(method: HttpMethod, url: string): void {
  console.log(`${method} ${url}`);
}

makeRequest(HttpMethod.GET, "/api/users");
```

## 5. 枚举成员类型

枚举成员可以作为类型使用。

```typescript
enum Status {
  Pending,
  Approved,
  Rejected
}

// 枚举成员作为类型
type PendingStatus = Status.Pending;
type ApprovedStatus = Status.Approved;

// 使用
const pending: PendingStatus = Status.Pending;
// const invalid: PendingStatus = Status.Approved; // ❌ 错误

// 枚举类型
type StatusType = Status;
const status: StatusType = Status.Pending;
```

## 6. 枚举与联合类型

枚举可以转换为联合类型。

```typescript
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

// 枚举值联合类型
type ColorValue = `${Color}`; // "red" | "green" | "blue"

// 或者直接使用枚举
type ColorType = Color; // Color.Red | Color.Green | Color.Blue

function setColor(color: Color): void {
  console.log(`设置颜色为: ${color}`);
}
```

## 7. 枚举的实际应用

### 状态管理

```typescript
// 订单状态
enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled"
}

interface Order {
  id: number;
  status: OrderStatus;
  items: string[];
}

function updateOrderStatus(order: Order, newStatus: OrderStatus): void {
  // 状态转换验证
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.Pending]: [OrderStatus.Processing, OrderStatus.Cancelled],
    [OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
    [OrderStatus.Shipped]: [OrderStatus.Delivered],
    [OrderStatus.Delivered]: [],
    [OrderStatus.Cancelled]: []
  };

  const allowedStatuses = validTransitions[order.status];
  if (allowedStatuses.includes(newStatus)) {
    order.status = newStatus;
  } else {
    throw new Error(`不能从 ${order.status} 转换到 ${newStatus}`);
  }
}
```

### 配置选项

```typescript
// 日志级别
enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3
}

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.Info) {
    this.level = level;
  }

  debug(message: string): void {
    if (this.level <= LogLevel.Debug) {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  info(message: string): void {
    if (this.level <= LogLevel.Info) {
      console.info(`[INFO] ${message}`);
    }
  }

  error(message: string): void {
    if (this.level <= LogLevel.Error) {
      console.error(`[ERROR] ${message}`);
    }
  }
}

const logger = new Logger(LogLevel.Debug);
logger.debug("调试信息");
logger.info("普通信息");
logger.error("错误信息");
```

### API 版本控制

```typescript
// API 版本
enum ApiVersion {
  V1 = "v1",
  V2 = "v2",
  V3 = "v3"
}

function buildApiUrl(version: ApiVersion, endpoint: string): string {
  return `/api/${version}${endpoint}`;
}

const url = buildApiUrl(ApiVersion.V2, "/users");
console.log(url); // "/api/v2/users"
```

## 8. 枚举 vs 常量对象

### 枚举的优势

```typescript
// 使用枚举
enum Status {
  Pending,
  Approved,
  Rejected
}

// 优势：
// 1. 类型安全
function processStatus(status: Status): void {
  // status 只能是 Status 的成员
}

// 2. 反向映射（数字枚举）
const name = Status[0]; // "Pending"

// 3. 命名空间
// Status 既是类型又是值
```

### 常量对象的优势

```typescript
// 使用常量对象
const Status = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected"
} as const;

type Status = typeof Status[keyof typeof Status]; // "pending" | "approved" | "rejected"

// 优势：
// 1. 更灵活的值类型
// 2. 可以添加方法
const StatusWithMethods = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
  isValid(value: string): boolean {
    return Object.values(this).includes(value);
  }
} as const;
```

### 选择建议

- **使用枚举**：当需要数字枚举的反向映射，或者需要简单的常量集合时
- **使用常量对象**：当需要更灵活的值类型，或者需要添加方法时

## 9. 枚举的最佳实践

### 1. 优先使用字符串枚举

```typescript
// ✅ 推荐：字符串枚举（更清晰，便于调试）
enum Status {
  Pending = "pending",
  Approved = "approved"
}

// ❌ 不推荐：数字枚举（除非需要反向映射）
enum Status {
  Pending,  // 0
  Approved  // 1
}
```

### 2. 使用常量枚举提高性能

```typescript
// ✅ 推荐：常量枚举（编译时内联，无运行时开销）
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 仅在需要反向映射时使用普通枚举
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

### 3. 避免异构枚举

```typescript
// ❌ 不推荐：异构枚举
enum Mixed {
  A = 1,
  B = "b"
}

// ✅ 推荐：使用字符串枚举或常量对象
enum Status {
  Pending = "pending",
  Approved = "approved"
}
```

### 4. 使用枚举作为类型

```typescript
// ✅ 推荐：使用枚举作为类型
function processStatus(status: Status): void {
  // 类型安全
}

// ❌ 不推荐：使用字符串字面量
function processStatus(status: "pending" | "approved"): void {
  // 需要手动维护类型
}
```

## 总结

- **数字枚举**：默认从 0 开始，支持反向映射，适合需要数字值的场景
- **字符串枚举**：每个成员都是字符串，更清晰易读，便于调试
- **常量枚举**：编译时内联，无运行时开销，适合性能敏感的场景
- **枚举成员类型**：枚举成员可以作为类型使用
- **实际应用**：状态管理、配置选项、API 版本控制等
- **最佳实践**：
  - 优先使用字符串枚举
  - 使用常量枚举提高性能
  - 避免异构枚举
  - 使用枚举作为类型提高类型安全性



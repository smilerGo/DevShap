# TypeScript 面向对象编程

## 1. 类（Class）

类是面向对象编程的基础，用于创建具有属性和方法的对象。

### 基本类定义

```typescript
// 基本类定义
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): string {
    return `我是${this.name}，今年${this.age}岁`;
  }
}

// 创建实例
const person = new Person("张三", 25);
console.log(person.introduce()); // "我是张三，今年25岁"
```

### 访问修饰符

TypeScript 提供了三种访问修饰符来控制类成员的可见性。

#### public（公共，默认）

```typescript
class User {
  public name: string; // public 是默认的，可以省略
  public email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  public getInfo(): string {
    return `${this.name} <${this.email}>`;
  }
}

const user = new User("张三", "zhangsan@example.com");
console.log(user.name); // ✅ 可以访问
console.log(user.getInfo()); // ✅ 可以访问
```

#### private（私有）

```typescript
class BankAccount {
  private balance: number; // 私有属性，只能在类内部访问
  public accountNumber: string;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  // 公共方法访问私有属性
  public getBalance(): number {
    return this.balance;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount; // ✅ 类内部可以访问
    }
  }

  public withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount; // ✅ 类内部可以访问
      return true;
    }
    return false;
  }
}

const account = new BankAccount("123456", 1000);
// console.log(account.balance); // ❌ 错误：私有属性不能访问
console.log(account.getBalance()); // ✅ 通过公共方法访问
account.deposit(500);
```

**实际应用场景**：

```typescript
// API 客户端类
class ApiClient {
  private apiKey: string; // 私有的 API 密钥
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private buildHeaders(): Headers {
    return new Headers({
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    });
  }

  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders()
    });
    return response.json();
  }
}
```

#### protected（受保护）

```typescript
class Animal {
  protected name: string; // 受保护属性，子类可以访问
  private species: string; // 私有属性，只有当前类可以访问

  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
  }

  protected makeSound(): void {
    console.log(`${this.name} 发出声音`);
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, breed: string) {
    super(name, "犬类");
    this.breed = breed;
  }

  public bark(): void {
    // ✅ 可以访问父类的 protected 成员
    this.makeSound();
    console.log(`${this.name} 在叫：汪汪！`);
  }

  public getInfo(): string {
    return `${this.name} 是一只${this.breed}`;
    // return this.species; // ❌ 错误：不能访问父类的 private 成员
  }
}

const dog = new Dog("旺财", "金毛");
dog.bark();
// dog.makeSound(); // ❌ 错误：protected 方法不能在类外部访问
```

### 构造函数

```typescript
class Product {
  name: string;
  price: number;
  category: string;

  // 构造函数
  constructor(name: string, price: number, category: string = "未分类") {
    this.name = name;
    this.price = price;
    this.category = category;
  }

  // 构造函数重载
  constructor();
  constructor(name: string, price: number);
  constructor(name: string, price: number, category: string);
  constructor(name?: string, price?: number, category?: string) {
    this.name = name || "未命名商品";
    this.price = price || 0;
    this.category = category || "未分类";
  }
}
```

### 参数属性（简写语法）

TypeScript 支持在构造函数参数中直接声明属性。

```typescript
// 传统写法
class User {
  name: string;
  age: number;
  email: string;

  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }
}

// 使用参数属性（简写）
class User {
  constructor(
    public name: string,
    public age: number,
    public email: string
  ) {
    // 自动创建并初始化属性
  }
}

// 可以混合使用
class Product {
  private id: number; // 传统声明

  constructor(
    id: number,
    public name: string,
    public price: number
  ) {
    this.id = id;
  }
}
```

### 静态成员

静态成员属于类本身，而不是类的实例。

```typescript
class MathUtils {
  // 静态属性
  static readonly PI = 3.14159;
  static readonly E = 2.71828;

  // 静态方法
  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }

  // 实例方法
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// 访问静态成员（通过类名）
console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.add(5, 3)); // 8

// 创建实例访问实例方法
const utils = new MathUtils();
console.log(utils.multiply(4, 5)); // 20
// console.log(utils.PI); // ❌ 错误：不能通过实例访问静态成员
```

**实际应用场景**：

```typescript
// 单例模式
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionString: string;

  private constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  public static getInstance(connectionString?: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      if (!connectionString) {
        throw new Error("首次创建需要提供连接字符串");
      }
      DatabaseConnection.instance = new DatabaseConnection(connectionString);
    }
    return DatabaseConnection.instance;
  }

  public connect(): void {
    console.log(`连接到：${this.connectionString}`);
  }
}

// 使用单例
const db1 = DatabaseConnection.getInstance("mongodb://localhost:27017");
const db2 = DatabaseConnection.getInstance(); // 返回同一个实例
console.log(db1 === db2); // true
```

### 只读属性

```typescript
class User {
  readonly id: number; // 只读属性，初始化后不能修改
  name: string;

  constructor(id: number, name: string) {
    this.id = id; // ✅ 构造函数中可以赋值
    this.name = name;
  }

  updateName(newName: string): void {
    this.name = newName; // ✅ 普通属性可以修改
    // this.id = 999; // ❌ 错误：只读属性不能修改
  }
}

const user = new User(1, "张三");
// user.id = 2; // ❌ 错误：只读属性不能修改
```

## 2. 继承

继承允许一个类继承另一个类的属性和方法。

### extends 关键字

```typescript
// 父类（基类）
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  eat(): void {
    console.log(`${this.name} 在吃东西`);
  }

  sleep(): void {
    console.log(`${this.name} 在睡觉`);
  }
}

// 子类（派生类）
class Dog extends Animal {
  breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // 调用父类构造函数
    this.brege = breed;
  }

  bark(): void {
    console.log(`${this.name} 在叫：汪汪！`);
  }

  // 重写父类方法
  eat(): void {
    super.eat(); // 调用父类方法
    console.log(`${this.name} 正在吃狗粮`);
  }
}

const dog = new Dog("旺财", 3, "金毛");
dog.eat(); // 调用重写后的方法
dog.sleep(); // 调用继承的方法
dog.bark(); // 调用子类特有的方法
```

### super 关键字

`super` 用于访问父类的属性和方法。

```typescript
class Vehicle {
  protected speed: number;
  protected brand: string;

  constructor(brand: string) {
    this.brand = brand;
    this.speed = 0;
  }

  accelerate(amount: number): void {
    this.speed += amount;
    console.log(`${this.brand} 加速到 ${this.speed} km/h`);
  }

  getInfo(): string {
    return `${this.brand} 当前速度：${this.speed} km/h`;
  }
}

class Car extends Vehicle {
  private model: string;

  constructor(brand: string, model: string) {
    super(brand); // 调用父类构造函数
    this.model = model;
  }

  // 重写方法并调用父类方法
  getInfo(): string {
    return `${super.getInfo()}，型号：${this.model}`;
  }

  // 扩展父类方法
  accelerate(amount: number): void {
    super.accelerate(amount);
    if (this.speed > 120) {
      console.log("警告：超速行驶！");
    }
  }
}

const car = new Car("丰田", "凯美瑞");
car.accelerate(130);
console.log(car.getInfo());
```

### 方法重写

子类可以重写父类的方法，提供自己的实现。

```typescript
class Shape {
  protected color: string;

  constructor(color: string) {
    this.color = color;
  }

  getArea(): number {
    return 0; // 基类默认实现
  }

  describe(): string {
    return `这是一个${this.color}的图形`;
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }

  // 重写父类方法
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  // 重写并扩展父类方法
  describe(): string {
    return `${super.describe()}，是一个半径为${this.radius}的圆形`;
  }
}

class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(color: string, width: number, height: number) {
    super(color);
    this.width = width;
    this.height = height;
  }

  // 重写父类方法
  getArea(): number {
    return this.width * this.height;
  }
}

const circle = new Circle("红色", 5);
const rectangle = new Rectangle("蓝色", 4, 6);

console.log(circle.getArea()); // 78.54...
console.log(rectangle.getArea()); // 24
```

## 3. 抽象类

抽象类不能直接实例化，只能被继承。抽象方法必须在子类中实现。

### abstract 关键字

```typescript
// 抽象类
abstract class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // 普通方法
  eat(): void {
    console.log(`${this.name} 在吃东西`);
  }

  // 抽象方法（必须在子类中实现）
  abstract makeSound(): void;
  abstract move(): void;
}

// ❌ 错误：不能直接实例化抽象类
// const animal = new Animal("动物");

// 实现抽象类
class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  // 必须实现抽象方法
  makeSound(): void {
    console.log(`${this.name} 在叫：汪汪！`);
  }

  move(): void {
    console.log(`${this.name} 在跑`);
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }

  // 必须实现抽象方法
  makeSound(): void {
    console.log(`${this.name} 在叫：喵喵！`);
  }

  move(): void {
    console.log(`${this.name} 在走`);
  }
}

const dog = new Dog("旺财");
const cat = new Cat("咪咪");

dog.makeSound(); // "旺财 在叫：汪汪！"
cat.makeSound(); // "咪咪 在叫：喵喵！"
```

**实际应用场景**：

```typescript
// 数据访问层抽象类
abstract class Repository<T> {
  protected abstract tableName: string;

  // 抽象方法，子类必须实现
  abstract findAll(): Promise<T[]>;
  abstract findById(id: number): Promise<T | null>;
  abstract create(entity: T): Promise<T>;
  abstract update(id: number, entity: Partial<T>): Promise<T>;
  abstract delete(id: number): Promise<void>;

  // 通用方法
  protected log(message: string): void {
    console.log(`[${this.tableName}] ${message}`);
  }
}

// 实现具体的数据访问类
class UserRepository extends Repository<User> {
  protected tableName = "users";

  async findAll(): Promise<User[]> {
    this.log("查询所有用户");
    // 实际数据库查询逻辑
    return [];
  }

  async findById(id: number): Promise<User | null> {
    this.log(`查询用户 ID: ${id}`);
    // 实际数据库查询逻辑
    return null;
  }

  async create(user: User): Promise<User> {
    this.log(`创建用户: ${user.name}`);
    // 实际数据库插入逻辑
    return user;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    this.log(`更新用户 ID: ${id}`);
    // 实际数据库更新逻辑
    return {} as User;
  }

  async delete(id: number): Promise<void> {
    this.log(`删除用户 ID: ${id}`);
    // 实际数据库删除逻辑
  }
}
```

## 4. 接口实现

类可以使用 `implements` 关键字实现接口。

### implements 关键字

```typescript
// 定义接口
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

// 实现单个接口
class Bird implements Flyable {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  fly(): void {
    console.log(`${this.name} 在飞`);
  }
}

// 实现多个接口
class Duck implements Flyable, Swimmable {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  fly(): void {
    console.log(`${this.name} 在飞`);
  }

  swim(): void {
    console.log(`${this.name} 在游泳`);
  }
}

const bird = new Bird("小鸟");
const duck = new Duck("鸭子");

bird.fly();
duck.fly();
duck.swim();
```

### 接口与类的结合

```typescript
// 接口定义契约
interface Drawable {
  draw(): void;
}

interface Resizable {
  resize(width: number, height: number): void;
}

// 抽象类提供部分实现
abstract class Shape implements Drawable {
  protected x: number;
  protected y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  abstract draw(): void; // 抽象方法，子类必须实现

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}

// 具体类实现接口和抽象类
class Rectangle extends Shape implements Resizable {
  private width: number;
  private height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  draw(): void {
    console.log(`在 (${this.x}, ${this.y}) 绘制矩形 ${this.width}x${this.height}`);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
```

**实际应用场景**：

```typescript
// 服务接口
interface PaymentService {
  processPayment(amount: number): Promise<boolean>;
  refund(transactionId: string): Promise<boolean>;
}

interface NotificationService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendSMS(phone: string, message: string): Promise<void>;
}

// 实现服务
class StripePaymentService implements PaymentService {
  async processPayment(amount: number): Promise<boolean> {
    // Stripe 支付逻辑
    console.log(`处理 Stripe 支付：${amount}`);
    return true;
  }

  async refund(transactionId: string): Promise<boolean> {
    // Stripe 退款逻辑
    console.log(`Stripe 退款：${transactionId}`);
    return true;
  }
}

class EmailNotificationService implements NotificationService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`发送邮件到 ${to}: ${subject}`);
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    console.log(`发送短信到 ${phone}`);
  }
}

// 使用服务
class OrderService {
  constructor(
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  async completeOrder(orderId: string, amount: number, email: string): Promise<void> {
    const paid = await this.paymentService.processPayment(amount);
    if (paid) {
      await this.notificationService.sendEmail(
        email,
        "订单确认",
        `您的订单 ${orderId} 已支付成功`
      );
    }
  }
}
```

## 5. Getter 和 Setter

Getter 和 Setter 允许以属性的方式访问和设置值。

```typescript
class Temperature {
  private _celsius: number = 0;

  // Getter
  get celsius(): number {
    return this._celsius;
  }

  // Setter
  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("温度不能低于绝对零度");
    }
    this._celsius = value;
  }

  // Getter（计算属性）
  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }

  // Setter（计算属性）
  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5 / 9;
  }
}

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77

temp.fahrenheit = 86;
console.log(temp.celsius); // 30
```

**实际应用场景**：

```typescript
// 用户类使用 Getter 和 Setter
class User {
  private _email: string = "";

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("无效的邮箱地址");
    }
    this._email = value;
  }

  // 只读属性（只有 Getter）
  get domain(): string {
    return this._email.split("@")[1] || "";
  }
}

const user = new User();
user.email = "zhangsan@example.com"; // ✅ 有效邮箱
console.log(user.domain); // "example.com"
// user.email = "invalid-email"; // ❌ 抛出错误
```

### 只读 Getter

只有 Getter 没有 Setter 的属性是只读的。

```typescript
class Circle {
  private _radius: number;

  constructor(radius: number) {
    this._radius = radius;
  }

  // 只读属性
  get radius(): number {
    return this._radius;
  }

  // 计算属性（只读）
  get area(): number {
    return Math.PI * this._radius * this._radius;
  }

  get circumference(): number {
    return 2 * Math.PI * this._radius;
  }

  // 提供方法来修改半径
  setRadius(radius: number): void {
    if (radius <= 0) {
      throw new Error("半径必须大于0");
    }
    this._radius = radius;
  }
}

const circle = new Circle(5);
console.log(circle.area); // 78.54...
console.log(circle.circumference); // 31.42...
// circle.radius = 10; // ❌ 错误：没有 Setter
circle.setRadius(10); // ✅ 通过方法修改
```

## 6. 类表达式

类也可以使用表达式的方式定义。

```typescript
// 类表达式
const Person = class {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): string {
    return `我是${this.name}，今年${this.age}岁`;
  }
};

const person = new Person("张三", 25);
```

## 7. 类与接口的区别

| 特性 | 类（Class） | 接口（Interface） |
|------|------------|------------------|
| 实例化 | 可以实例化 | 不能实例化 |
| 实现 | 可以有实现 | 只有声明 |
| 构造函数 | 有构造函数 | 没有构造函数 |
| 访问修饰符 | 支持 public/private/protected | 所有成员都是公共的 |
| 静态成员 | 支持静态成员 | 不支持 |
| 继承 | 使用 extends | 使用 extends（接口继承） |
| 实现 | 使用 implements | 使用 implements |

## 总结

- **类（Class）**：用于创建对象实例，支持访问修饰符、继承、抽象类等特性
- **访问修饰符**：`public`（默认）、`private`、`protected` 控制成员可见性
- **继承**：使用 `extends` 实现类继承，`super` 访问父类成员
- **抽象类**：使用 `abstract` 定义不能实例化的基类，强制子类实现抽象方法
- **接口实现**：使用 `implements` 实现接口，一个类可以实现多个接口
- **Getter/Setter**：提供属性访问控制，可以添加验证逻辑和计算属性
- **最佳实践**：
  - 优先使用接口定义契约
  - 使用抽象类提供通用实现
  - 合理使用访问修饰符保护内部状态
  - 使用 Getter/Setter 进行数据验证和封装
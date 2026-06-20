---
layout: default
title: Golang Development Guidelines
---

# Introduction

This document outlines the coding conventions and practices for the project, specifically tailored for golang development. Adhering to these standards ensures code consistency, readability, and maintainability across the project.

---

# General Coding Standards

## Naming Conventions

### Variables and Functions

Use `camelCase` for variable.

- Additional words can be added to disambiguate similar names, for example userCount and projectCount.
- Do not simply drop letters to save typing. For example `sandbox` is preferred over `Sbx`, particularly for exported names.
- Omit types and type-like words from most variable names.
  - For a number, `userCount` is a better name than `numUsers` or `usersInt`.
  - For a slice, `users` is a better name than `userSlice`.
- Omit words that are clear from the surrounding context. For example, in the implementation of a `UserCount` method, a local variable called `userCount` is probably redundant; `count`, `users` are just as readable.
- Use `camelCase` for function names if they are not exported, and `PascalCase` if they are exported. For example, `getUserByID` is a private function, and `GetUserByID` is a public function. All that is not exported should be added after the // private comment.

### Structs

Use `PascalCase` for struct names.

**Good Example**:

```go
type User struct {
    ID   int
    Name string
}

users := []User{
    {ID: 1, Name: "Alice"},
    {ID: 2, Name: "Bob"},
}

var userCount int

func GetUserByID(userID int) {
    // Implementation
}

// private
func getUserByID(userID int) {
    // Implementation
}
```

**Bad Example**:

```go
type UserStruct struct {
    UserID   int
    UserName string
}

userSlice := []UserStruct{
    {UserID: 1, UserName: "Alice"},
    {UserID: 2, UserName: "Bob"},
}

var user_count int

func getUserByID(userID int) {
    // Implementation
}

// private
func GetUserByID(userID int) {
    // Implementation
}
```

---

### Interfaces

Name interfaces after what they do, not what they are. Single-method interfaces follow the Go convention of using the method name plus an `-er` suffix (e.g., `Reader`, `Writer`, `Stringer`). For broader interfaces, use a descriptive noun (`UserRepository`, `PaymentMethod`). Never prefix with `I` — that is a C# convention and is not idiomatic Go.

**Good Example:**

```go
type UserRepository interface {
    FindByID(id int) (*User, error)
}

type Reader interface {
    Read(p []byte) (n int, err error)
}
```

**Bad Example:**

```go
type IUserRepository interface {
    FindByID(id int) (*User, error)
}

type IReader interface {
    Read(p []byte) (n int, err error)
}
```

---

### Constants

Use MixedCaps for constants.

- **MixedCaps**: For example, a constant is MaxLength (not MAX_LENGTH) if exported and maxLength (not max_length) if unexported.

**Good Example:**

```go
const MaxLength = 10
const minPasswordLength = 8
```

**Bad Example:**

```go
const MAX_LENGTH = 10
const MIN_PASSWORD_LENGTH = 8
```

### Packages

Go package names should be short and contain only lowercase letters. A package name composed of multiple words should be left unbroken in all lowercase. For example, the package tabwriter is not named `tabWriter`, `TabWriter`, or `tab_writer`. Additionally the packages must be self-explanative and should not be named `common`, `utils`, `helpers`, etc.

To avoid the code duplication, functions inside the packages must not be named the same as the package name.

**Good Example:**

```go
package user

func GetByID(id int) (*User, error) {
    // Implementation
}
```

```go
package main

import "github.com/username/project/user"

func main() {
    user.GetByID(1)
}
```

**Bad Example:**

```go
package user

func GetUserByID(id int) (*User, error) {
    // Implementation
}
```

```go
package main

import "github.com/username/project/user"

func main() {
    user.GetUserByID(1)
}
```
### One-letter variable names:

Avoid using one-letter variable names except in cases like loop indices or maths (`i`, `j`, `k`).

**Good Example:**

```go
func calculateArea(length, width int) int {
    return length * width
}
```

**Bad Example:**

```go
func calculateArea(l, w int) int {
    return l * w
}
```

---

## Code Structure

### File Naming

Use descriptive names, and separate words with underscores (e.g., `user.go`, `user_validations.go`).

### Folder Structure

Organize code into meaningful packages and folders (e.g., `controller/`, `service/`, `repository/`, `model/`, `pkg/`)

### Test Files

Name test files with `_test.go` suffix (e.g., `user_test.go`).

**Good Example:**

```
project/
    ├── controller/
    │   ├── user.go
    |   ├── user_test.go
    │   └── ...
    ├── service/
    │   ├── user.go
    |   ├── user_test.go
    │   └── ...
    ├── repository/
    │   ├── user.go
    |   ├── user_test.go
    │   └── ...
    |── model/
    |   ├── user.go
    └── main.go
```

**Bad Example:**

```
project/
    ├── controllers/
    │   ├── controller_user.go
    |   ├── controller_userTest.go
    │   └── ...
    ├── services/
    │   ├── userService.go
    |   ├── userService_test.go
    │   └── ...
    ├── repositories/
    │   ├── userRepository.go
    |   ├── userRepositorytest.go
    │   └── ...
    |── models/
    |   ├── user_model.go
    └── main.go
```

---

## Formatting

### Newlines

Ensure there is a newline after `}` when there is a `return` or new `var` and before `var` or any other line following a closing brace. 

Also, include a newline after each `case` in a `switch` statement.

**Good Example:**

```go
func example() {
    if condition {
        return
    }

    var x int
    x = 10
    if x > 5 {
        fmt.Println("x is greater than 5")
    }

    switch x {
    case 1:
        fmt.Println("x is 1")

    case 2:
        fmt.Println("x is 2")

    default:
        fmt.Println("x is neither 1 nor 2")
    }

    return x
}
```

**Bad Example:**

```go
func example() {
    if condition {
        return
    }
    var x int
    x = 10
    if x > 5 {
        fmt.Println("x is greater than 5")
    }
    switch x {
    case 1:
        fmt.Println("x is 1")
    case 2:
        fmt.Println("x is 2")
    default:
        fmt.Println("x is neither 1 nor 2")
    }
    return x
}
```

### Commenting

Add comments to explain complex logic or non-obvious code.

---

## Error Handling

### Error return

Prefer returning errors explicitly instead of using panic.

**Good Example:**

```go
func getUserByID(userID int) (*User, error) {
    user, err := userRepository.FindByID(userID)
    if err != nil {
        return nil, fmt.Errorf("finding user by ID failed: %w", err)
    }

    return user, nil
}
```

**Bad Example:**

```go
func getUserByID(userID int) *User {
    user, err := userRepository.FindByID(userID)
    if err != nil {
        panic(err)
    }

    return user
}
```

---

### Error Messages

Provide meaningful error messages when returning errors. Use `%w` instead of `%v` to wrap errors so callers can inspect the chain with `errors.Is` and `errors.As`.

**Good Example:**

```go
func getUserByID(userID int) (*User, error) {
    user, err := userRepository.FindByID(userID)
    if err != nil {
        return nil, fmt.Errorf("finding user by ID failed: %w", err)
    }

    return user, nil
}
```

**Bad Example:**

```go
func getUserByID(userID int) (*User, error) {
    user, err := userRepository.FindByID(userID)
    if err != nil {
        return nil, err
    }

    return user, nil
}
```

---

### Error shorthand

Use the `err` shorthand for error variables.

**Good Example:**

```go
if err := someFunction(); err != nil {
    return err
}
```

**Bad Example:**

```go
err := someFunction()
if err != nil {
    return err
}
```
---

## Enumerations

Enumerations as part of data structure must be defined within the `model` layer to ensure that they are easily accessible and reusable across the application.

**Good Example:**

```go
package enum

type Coverage string

const (
	CoverageMostSegments      Coverage = "MOST_SEGMENTS"
	CoverageAtLeastOneSegment Coverage = "AT_LEAST_ONE_SEGMENT"
	CoverageAllSegments       Coverage = "ALL_SEGMENTS"
)

var Coverages = []string{
	string(CoverageMostSegments),
	string(CoverageAtLeastOneSegment),
	string(CoverageAllSegments),
}
```

**Bad Example:**

```go
package enum

const (
    MostSegments      = "MOST_SEGMENTS"
    AtLeastOneSegment = "AT_LEAST_ONE_SEGMENT"
    AllSegments       = "ALL_SEGMENTS"
)

var Coverages = []string{
    MostSegments,
    AtLeastOneSegment,
    AllSegments,
}
```

---
# Common Code Smells

## Type `any`

Avoid using `any` or empty interfaces as a type, unless it's absolutely necessary. `any` types can be used in case of formatting or marshalling, but should be avoided in other cases.

In bad example we can see, that the type safety which is propagated by Go is lost. The function can accept any type, and the code inside the function must use type assertions to determine the actual type of the argument.

**Good Example:**
```go
func encodeToJSON(data any) ([]byte, error) {
    return json.Marshal(data)
}

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func main() {
    user := User{ID: 1, Name: "John"}
    jsonData, err := encodeToJSON(user)
    if err != nil {
        log.Fatalf("Failed to encode: %v", err)
    }
    fmt.Println(string(jsonData))
}
```

**Bad Example:**
```go
func processData(data any) {
    // Process data with type assertions
    switch v := data.(type) {
    case string:
        fmt.Println("String:", v)
    case int:
        fmt.Println("Int:", v)
    default:
        fmt.Println("Unknown type")
    }
}

func main() {
    processData("hello")
    processData(42)
    processData(true)
}
```



## Variable Shadowing

Try to avoid variable shadowing. If check is needed for the outcome of variable, it's better to either assign a value for the variable or create new variable within the check block.

**Good Example:**
```go
func processUser(user User) error {
    // Outer scope variable
    id := user.ID

    if user.IsActive {
        // Update existing variable instead of shadowing
        // This clearly shows we're intentionally replacing the original ID value
        id = getUserRoleID(user)
        log.Printf("Processing active user with role ID: %d", id)
    }

    // The saveUserActivity function receives the ID that was potentially modified
    // If user was active, this is now the role ID, otherwise it's the original user ID
    return saveUserActivity(id)
}
```

**Bad Example:**
```go
func processUser(user User) error {
    // Outer scope variable
    id := user.ID
    
    if user.IsActive {
        // Inner scope shadows outer 'id' variable
        id := getUserRoleID(user)
        // Here 'id' refers to the role ID, not the user ID
        log.Printf("Processing active user with role ID: %d", id)
        
        // The outer 'id' is completely inaccessible here
    }
    
    // Here 'id' is the user ID again
    return saveUserActivity(id)
}
```
---
## Less `else` statements

Avoid else statements in if condition to avoid the complexity of the code. Use [KISS](https://www.geeksforgeeks.org/kiss-principle-in-software-development/) principle when writing condition checks.

### Simple Example

**Good Example**
```go
func GetStatus(user *User) bool {
    if user.IsActive {
        return true
    }

    return false
}
```

**Bad Example:**
```go
func GetStatus(user *User) bool {
    if user.IsActive {
        return true
    } else {
        return false
    }
}
```

### Complex Example

**Good Example**
```go
func join(s1,s2 string, max int) (string, error) {
    if s1 == "" {
        return "", errors.New("s1 is empty")
    }

    if s2 == "" {
        return "", errors.New("s2 is empty")
    }

    concat, err := concatenate(s1,s2)
    if err != nil {
        return "", err
    }

    if len(concat) > max {
        return concat[:max], nil
    }

    return concat, nil
}
```

**Bad Example**
```go
func join(s1,s2 string, max int) (string, error) {
    if s1 == "" {
        return "", errors.New("s1 is empty")
    } else {
        if s2 == "" {
            return "", errors.New("s2 is empty")
        } else {
            concat, err := concatenate(s1, s2)
            if err != nil {
                return "", err
            } else {
                if len(concat) > max {
                    return concat[:max], nil
                } else {
                    return concat, nil
                }
            }
        }
    }
}
```

## Getters & Setters

Even though in Golang Getters and Setters are not a common practice, they are used in some cases.

Getters never use `Get` prefix due to:

- It's more concise and idiomatic to Go's philosophy
- Rob Pike (Go's creator) has stated this is the preferred style
- It follows the principle of least surprise in Go

While Setters use `Set` prefix due to:

- We need to distinguish them from getters
- The action of setting needs to be explicit
- It makes it clear the method modifies state

**Good Example**
```go
package model

type User struct {
    name    string
    address string
}

// Getter - no "Get" prefix
func (u *User) Name() string {
    return u.name
}

func (u *User) Address() string {
    return u.address
}

// Setter - uses "Set" prefix
func (u *User) SetName(name string) {
    u.name = name
}

func (u *User) SetAddress(address string) {
    u.address = address
}

```
```go
package main

import (
    "fmt"
    "github.com/username/project/model"
)

func main() {
    user := &model.User{}
    user.SetName("Alice")
    fmt.Println(user.Name())
    fmt.Println(user.Address())
}
```

**Bad Example**
```go
package model

type Customer struct {
    Name    string
    Address string
}

// Bad: Using "Get" prefix for getters
func (c *Customer) GetName() string {
    return c.Name
}

func (c *Customer) GetAddress() string {
    return c.Address
}

// Bad: Inconsistent naming
func (c *Customer) UpdateName(name string) {
    c.Name = name
}

func (c *Customer) ChangeAddress(address string) { 
    c.Address = address
}
```
```go
func main() {
    customer := &Customer{}
    customer.UpdateName("Bob")
    fmt.Println(customer.GetName())
    fmt.Println(customer.GetAddress())
}
```

## Interfaces

### Interfaces must be on consumers side

Interfaces should use the consumer side of the code. This means that the interface should be defined in the package where it is needed to use, not in the package where it is implemented. There are some exceptions, but in those exceptions developer MUST be sure, that it will be needed for other packages (ex: `context.Context` interface from context package)

**Good Example:**
```go
package service

import "github.com/username/project/model"

// UserRepository interface is defined in the consumer package
type UserRepository interface {
    FindByID(id int) (*model.User, error)
    Create(user *model.User) error
    Update(user *model.User) error
}

// UserService depends on the interface, not the concrete implementation
type UserService struct {
    repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) GetUserByID(id int) (*model.User, error) {
    return s.repo.FindByID(id)
}
```

**Bad Example:**
```go
// In provider package (e.g., repository/user_repository.go)
package repository

import "github.com/username/project/model"

// Interface defined in the provider package - bad practice
type UserRepository interface {
    FindByID(id int) (*model.User, error)
    Create(user *model.User) error
    Update(user *model.User) error
}

// Implementation in the same package as the interface
type PostgresUserRepository struct {
    db *sql.DB
}

func (r *PostgresUserRepository) FindByID(id int) (*model.User, error) {
    // Implementation
    return &model.User{}, nil
}

// In service/user_service.go - now dependent on repository package for the interface
package service

import "github.com/username/project/repository"

type UserService struct {
    repo repository.UserRepository
}
```

### Pollution

Interface pollution occurs when an interface has too many methods or is too broad, making it difficult to implement and understand. This can lead to confusion and make it harder to maintain the codebase.

The good example follows the Interface Segregation Principle by:
- Creating small, focused interfaces
- Allowing composition when needed
- Making implementations simpler and more maintainable


The bad example shows interface pollution by:
- Combining too many methods into one interface
- Forcing implementations to provide unnecessary methods
- Making the codebase harder to maintain and test

**Good Example:**
```go
// Small, focused interfaces that are easy to implement
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Compose interfaces when needed
type ReadWriter interface {
    Reader
    Writer
}

// Implementation only needs to implement what it uses
type FileHandler struct{}

func (f *FileHandler) Read(p []byte) (n int, err error) {
    // Read implementation
    return len(p), nil
}
```

**Bad Example:**
```go
// Interface pollution - too many methods in one interface
type FileSystem interface {
    Read(p []byte) (n int, err error)
    Write(p []byte) (n int, err error)
    Create(name string) error
    Delete(name string) error
    Rename(oldpath, newpath string) error
    Chmod(mode os.FileMode) error
    Chown(uid, gid int) error
    Stat() (os.FileInfo, error)
    Close() error
}

// Implementation forced to implement all methods
type SimpleFileHandler struct{}

func (f *SimpleFileHandler) Read(p []byte) (n int, err error) {
    return len(p), nil
}

// Must implement all other methods even if not needed
func (f *SimpleFileHandler) Write(p []byte) (n int, err error) {
    return 0, errors.New("not implemented")
}

func (f *SimpleFileHandler) Create(name string) error {
    return errors.New("not implemented")
}

// ... and so on for all other methods
```

## Generics

In Golang generics were created to allow developers to write more flexible and reusable code. However, they can also lead to complexity and confusion if not used properly.
To avoid this, it's important to use generics judiciously and only when necessary.

Keep KISS principle in mind when using generics. If a function or type can be implemented without generics, it's often better to do so. This keeps the code simpler and easier to understand.

**Good Example:**
```go
// Custom constraint
type number interface {
    // Either int or float64 can be used
    int | float64
}

// Generic function that works with any type that satisfies the Number constraint
func universalAdd[T number](a, b T) T {
    return a + b
}

func main() {
    // Works
    fmt.Println(universalAdd[int](1, 2))
    fmt.Println(universalAdd[float64](1.5, 2.3))

    // Will not compile and will give error
    fmt.Println(universalAdd[string]("Hello", "World"))
}
```

**Bad Example:**
```go
func universalAdd[T any](a, b T) string {
    // Convert everything to string and concatenate, then try to parse back
    aStr := fmt.Sprintf("%v", a)
    bStr := fmt.Sprintf("%v", b)
    
    // Try to handle different types with type assertions and string parsing
    if aInt, err1 := strconv.Atoi(aStr); err1 == nil {
        if bInt, err2 := strconv.Atoi(bStr); err2 == nil {
            return fmt.Sprintf("%v", aInt + bInt)
        }
    }
    
    if aFloat, err1 := strconv.ParseFloat(aStr, 64); err1 == nil {
        if bFloat, err2 := strconv.ParseFloat(bStr, 64); err2 == nil {
            return fmt.Sprintf("%v", aFloat + bFloat)
        }
    }
    
    // Fall back to string concatenation for everything else
    return aStr + bStr
}

func main() {
    // Works but inefficient and error-prone
    fmt.Println(universalAdd(1, 2))        // "3"
    fmt.Println(universalAdd(1.5, 2.3))    // "3.8"
    
    // Leads to unexpected results with string concatenation
    fmt.Println(universalAdd("Hello", "World"))  // "HelloWorld"
    
    // And completely breaks type safety
    fmt.Println(universalAdd(true, false))  // "truefalse"
    fmt.Println(universalAdd([]int{1}, []int{2}))  // "[1][2]" or runtime error
}
```

## Embed Types

Go's struct embedding allows one struct to include another struct's fields and methods directly, enabling composition over inheritance. When used correctly, embedding creates cleaner code with better encapsulation.

**Good Example:**
```go
// Base types with focused responsibilities
type logger struct{}

func (l logger) Log(message string) {
    fmt.Println("LOG:", message)
}

type authenticator struct{}

func (a authenticator) Authenticate(token string) bool {
    // Authentication logic
    return token != ""
}

// UserService composes functionality through embedding
type userService struct {
    // Embedded types
    logger
    authenticator
    
    // Service-specific fields
    users []user
}

func (s *userService) CreateUser(name string, token string) error {
    // Uses embedded Authenticator's method
    if !s.Authenticate(token) {
        // Uses embedded Logger's method
        s.Log("Authentication failed")
        return errors.New("unauthorized")
    }
    
    // Service-specific logic
    s.users = append(s.users, user{Name: name})
    s.Log("User created")
    return nil
}
```

**Bad Example:**
```go
// Overloaded type containing too many concerns
type userManager struct {
    users []user
}

// Adding logging functionality through embedding but with name conflicts
type loggingUserManager struct {
    userManager
    logger
    
    // Duplicate field that shadows the embedded one
    users map[string]user
}

func (l *loggingUserManager) CreateUser(name string) {
    // Ambiguous - which users collection are we using?
    user := user{Name: name}
    
    // Awkward workaround for field collision
    l.UserManager.users = append(l.UserManager.users, user)
    l.users[name] = user // Using the shadowed field
    
    // Method name collision if Logger also has a CreateUser method
    // Would need explicit qualification: l.Logger.CreateUser()
}

// Multiple layers of embedding make it unclear where methods come from
type adminManager struct {
    loggingUserManager
    authService
    configManager
    // More embedded types...
}

func (a *adminManager) DoSomething() {
    // Where is each method coming from? Hard to tell at a glance
    a.Log("Starting operation")
    a.Authenticate()
    a.LoadConfig()
    a.CreateUser("admin")
}
```


---

# Software Design

There are many software design principles available (e.g Builder, Factory, Singleton).
Kindly use [this website](https://refactoring.guru/design-patterns/catalog) to check all the patterns and find the one that fits your needs.

## SOLID

At Wisepace we're using SOLID development principles to ensure the maintainability of the code.

### 1. Single Responsibility Principle (SRP)
Each module or class should have one, and only one, reason to change.

In Go, this means that a function or struct should only do one thing.

**Bad Example:**
```go
type Report struct {
    Title string
    Data  []string
}

func (r *Report) Generate() string {
    return "Report Title: " + r.Title
}

func (r *Report) SaveToFile(filename string) error {
    // Saving logic here...
    return nil
}
```

Here, the Report struct handles both generating the report and saving it to a file. These are two separate responsibilities.

**Good Example:**

```go
type Report struct {
    Title string
    Data  []string
}

func (r *Report) Generate() string {
    return "Report Title: " + r.Title
}

type FileSaver struct {}

func (fs *FileSaver) SaveToFile(filename string, content string) error {
    // Saving logic here...
    return nil
}
```

Now, Report is responsible for generating reports, while FileSaver is responsible for file-saving logic.

### 2. Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

In Go, this means you should design your code to allow new functionality to be added without changing existing code.

**Bad Example:**
```go
type PaymentProcessor struct {}

func (p *PaymentProcessor) Process(paymentType string) {
    if paymentType == "credit" {
        // Process credit payment
    } else if paymentType == "paypal" {
        // Process PayPal payment
    }
}
```
Adding a new payment type requires modifying Process.

**Good Example:**

```go
type PaymentMethod interface {
    Pay()
}

type CreditPayment struct {}

func (c *CreditPayment) Pay() {
    // Process credit payment
}

type PayPalPayment struct {}

func (p *PayPalPayment) Pay() {
    // Process PayPal payment
}

type PaymentProcessor struct {}

func (p *PaymentProcessor) Process(method PaymentMethod) {
    method.Pay()
}
```

Now, to add a new payment type, you just implement the PaymentMethod interface.

### 3. Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types without altering the correctness of the program.

In Go, this means you should ensure that implementations of an interface adhere to its contract.

**Bad Example:**

```go
type Bird interface {
    Fly()
}

type Sparrow struct {}

func (s *Sparrow) Fly() {
    // Sparrow flies
}

type Ostrich struct {}

func (o *Ostrich) Fly() {
    panic("Ostriches can't fly!")
}
```

Here, Ostrich violates the principle because it doesn’t conform to the expected behavior of Bird.

**Good Example:**

```go
type Bird interface {
    Move()
}

type Sparrow struct {}

func (s *Sparrow) Move() {
    fmt.Println("Sparrow flies!")
}

type Ostrich struct {}

func (o *Ostrich) Move() {
    fmt.Println("Ostrich runs!")
}
```

Now both Sparrow and Ostrich adhere to the behavior defined by the Bird interface.

### 4. Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use.

In Go, this means creating smaller, more focused interfaces.

**Bad Example:**

```go
type Printer interface {
    Print()
    Scan()
    Fax()
}

type BasicPrinter struct {}

func (p *BasicPrinter) Print() {
    fmt.Println("Printing...")
}

func (p *BasicPrinter) Scan() {
    panic("Scan not supported!")
}

func (p *BasicPrinter) Fax() {
    panic("Fax not supported!")
}
```

A BasicPrinter doesn’t need to implement Scan or Fax.

**Good Example:**

```go
type Printer interface {
    Print()
}

type Scanner interface {
    Scan()
}

type Faxer interface {
    Fax()
}

type BasicPrinter struct {}

func (p *BasicPrinter) Print() {
    fmt.Println("Printing...")
}
```

Now BasicPrinter only implements what it needs.

### 5. Dependency Inversion Principle (DIP)

Depend on abstractions, not concretions.

In Go, this means your code should depend on interfaces, not specific implementations.

**Bad Example:**

```go
type Database struct {}

func (d *Database) Save(data string) {
    fmt.Println("Saving data:", data)
}

type UserService struct {
    DB Database
}

func (us *UserService) StoreUser(name string) {
    us.DB.Save(name)
}
```
Here, UserService is tightly coupled to Database.

**Good Example:**

```go
type Storage interface {
    Save(data string)
}

type Database struct {}

func (d *Database) Save(data string) {
    fmt.Println("Saving data:", data)
}

type UserService struct {
    Storage Storage
}

func (us *UserService) StoreUser(name string) {
    us.Storage.Save(name)
}
```

Now, UserService depends on the Storage interface, so you can easily replace Database with another implementation.

### Recap

SRP: One responsibility per module.
OCP: Add new features without modifying existing code.
LSP: Subtypes should behave as their base type expects.
ISP: Create focused interfaces.
DIP: Depend on interfaces, not implementations.
Using these principles, your Go code will become easier to maintain, extend, and understand!

# Code Review

Code reviews are main part of software delivery process, where product development team is responsible for the changes reaching the production.

## Code Review Checklist

Use the checklist below to self-review your changes before requesting review from teammates.

Checklist:

```
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I've performed/added tests/lints that prove my fix is effective or that my feature works
```

## 4-Eye Principle

All code changes must be reviewed at least by two team members before merging into the main branch. If no resources are available, the code can be reviewed by one senior team member or mentor.

Team members must test the code locally to ensure that it works as expected. If not possible, the reviewer should ask the author to provide a demo or test environment, where the feature can be tested.

## Draft PR

Before creating a PR and assigning to team member, create a draft PR and check that code follows the guidelines mentioned on this page.

## Commit Messages

Commit messages should be clear and descriptive. 

Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to maintain consistency across the project if any other process is not used.

**Good Example:**

```
feature: add user registration endpoint
```

**Bad Example:**

```
Added new feature
```

# Observability

## Logging

Use [golog](https://github.com/klabs-hq/golog) — the KLabs structured logger — instead of the stdlib `log` package. It provides leveled, structured logging out of the box and integrates with the logging types described below.

## Common Design

### Naming Convention

Every log entry must follow the same structure so that logs are machine-parseable and human-scannable across all services:

```
<timestamp> <service> <action> [fields...]
```

- **timestamp** — ISO 8601 / RFC 3339, always in UTC.
- **service** — the name of the service emitting the log (e.g., `user-service`, `payment-api`).
- **action** — what was happening when the log was emitted (e.g., `GetUserByID`, `ProcessPayment`).
- **fields** — structured key-value pairs relevant to the event (user ID, request ID, error type, etc.).

Consistent naming makes it possible to filter, alert on, and correlate logs across services without custom parsing rules per service.

### Log Levels

Always attach a log level to every entry. Never use plain `fmt.Println` or `log.Print` in production code.

- **DEBUG**: Detailed information, typically of interest only when diagnosing problems.
- **INFO**: Confirmation that things are working as expected.
- **WARN**: Something unexpected happened but the application is still functioning correctly.
- **ERROR**: A serious problem prevented a specific operation from completing.
- **FATAL**: A critical error that results in the application being unable to function.

### Logging Types

Logging types standardise error classification so it is immediately clear which part of the system is at fault. Prefix every error log message with the appropriate type.

- **DatabaseError** — errors related to database transactions, query timeouts, or integrity violations.
- **QueueError** — failures in message queues (e.g., SQS, RabbitMQ), such as message processing failures or delivery delays.
- **ValidationError** — any input validation failure.
- **ServerError** — unexpected internal failures such as unhandled panics or logic errors.
- **ClientError** — errors caused by incorrect API requests or missing fields from the caller.
- **InternalCommunicationError** — issues between microservices or between a service and its backend (network failures, DNS issues, database connection problems).

**Good Example:**

```go
_, err := db.Exec("DROP TABLE users")
if err != nil {
    log.Printf("DatabaseError: Permission denied %v", err)
}
```

```go
svc := sqs.New(session.Must(session.NewSession()))
_, err := svc.GetQueueUrl(&sqs.GetQueueUrlInput{
    QueueName: aws.String("my-queue"),
})
if err != nil {
    log.Printf("QueueError: Failed to retrieve the URL for queue 'my-queue' %v", err)
}
```

```go
func validateEmail(email string) {
    if !isValidEmail(email) {
        log.Printf("ValidationError: Invalid email format: %s", email)
    }
}
```

```go
func main() {
    err := startServer()
    if err != nil {
        log.Fatalf("ServerError: Failed to start the server %v", err)
    }
}
```

```go
func validateEmail(email string) {
    if !isValidEmail(email) {
        log.Printf("ClientError: Invalid email format received from client: %s", email)
    }
}
```

```go
var err error
DB, err = database.NewDBConnection()
if err != nil {
    log.Printf("InternalCommunicationError: Couldn't connect to database %v", err)
}
```

**Bad Example:**

```go
func validateEmail(email string) {
    if !isValidEmail(email) {
        log.Printf(err) // missing error type prefix, bare error, no context
    }
}
```

---

## REST API

### Middlewares

Every REST API service must have a logger middleware that captures request and response metadata. The middleware must always log the fields listed below for every request.

Logger middleware **must** log:
- **Request method**
- **Request URI**
- **Request latency** (time until the response starts being sent)
- **Request Round-Trip Time (RTT)**
- **`X-Request-ID`** header for request tracing
- **Response status code**

Logger middleware **should** log (only for error responses — see below):
- **Request body** with sensitive fields redacted
- **Response body** with sensitive fields redacted
- **Request headers**
- **Response headers**
- **Custom fields** such as user ID, tenant ID, etc.

#### Body logging policy

Request and response bodies **must only be logged for HTTP 401, 403, and 5xx responses**. Do not log bodies for successful (2xx) or redirect (3xx) responses. Logging bodies on every request generates unnecessary data ingestion costs and risks leaking sensitive information.

```go
func loggingMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        blw := &bodyLogWriter{body: new(bytes.Buffer), ResponseWriter: c.Writer}
        c.Writer = blw

        c.Next()

        status := c.Writer.Status()
        entry := log.WithFields(log.Fields{
            "method":     c.Request.Method,
            "uri":        c.Request.RequestURI,
            "status":     status,
            "request_id": c.GetHeader("X-Request-ID"),
        })

        // Only capture bodies for auth failures and server errors
        if status == http.StatusUnauthorized ||
            status == http.StatusForbidden ||
            status >= http.StatusInternalServerError {
            entry = entry.WithField("response_body", blw.body.String())
        }

        entry.Info("request completed")
    }
}
```

# Testing

Tests are first-class citizens in Go. Every package should have tests that verify its behaviour, and test files live alongside the code they test (e.g., `user_test.go` next to `user.go`).

## Structure: Given / When / Then

Structure every test case using the **Given / When / Then** pattern so that the intent is immediately clear to any reader, regardless of their familiarity with the code.

- **Given** — set up the preconditions and inputs.
- **When** — call the code under test.
- **Then** — assert the expected outcome.

Use table-driven tests to cover multiple scenarios without repeating boilerplate. Name each test case so that failure output is self-explanatory.

**Good Example:**

```go
func TestGetUserByID(t *testing.T) {
    tests := []struct {
        name        string
        given       int
        wantUser    *User
        wantErr     bool
    }{
        {
            name:     "valid user ID returns user",
            given:    1,
            wantUser: &User{ID: 1, Name: "Alice"},
            wantErr:  false,
        },
        {
            name:    "unknown user ID returns error",
            given:   999,
            wantErr: true,
        },
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            // Given
            repo := newMockUserRepository()

            // When
            user, err := repo.GetUserByID(tc.given)

            // Then
            if tc.wantErr {
                assert.Error(t, err)
                return
            }

            assert.NoError(t, err)
            assert.Equal(t, tc.wantUser, user)
        })
    }
}
```

**Bad Example:**

```go
func TestGetUser(t *testing.T) {
    repo := newMockUserRepository()
    user, err := repo.GetUserByID(1)
    if err != nil {
        t.Fatal(err)
    }
    if user.ID != 1 {
        t.Errorf("expected ID 1, got %d", user.ID)
    }
}
```

The bad example has no clear structure, tests only the happy path, and produces an opaque failure message if it breaks.

---

# Context Propagation

## Use `context.Context` consistently

Go's `context.Context` is the standard mechanism for carrying deadlines, cancellation signals, and request-scoped values across API boundaries and goroutines. Pass it as the **first argument** to any function that performs I/O, calls external services, or may need to be cancelled.

Never mix `context.Context` from the standard library with framework-specific contexts. When using frameworks (e.g Gin), pass the context (e.g `*gin.Context`) directly as `context.Context` into your service and repository layers — it implements the interface and preserves framework's request lifecycle.

**Good Example:**

```go
// controller/user.go
func (c *UserController) GetUser(ginCtx *gin.Context) {
    userID := ginCtx.Param("id")

    // Pass gin.Context as context.Context — it implements the interface and
    // preserves Gin's request lifecycle, avoiding race conditions on context state.
    user, err := c.userService.GetUserByID(ginCtx, userID)
    if err != nil {
        handleContextError(ginCtx, err)
        return
    }

    ginCtx.JSON(http.StatusOK, user)
}

// service/user.go — depends only on context.Context, not on *gin.Context
func (s *UserService) GetUserByID(ctx context.Context, id string) (*model.User, error) {
    return s.repo.FindByID(ctx, id)
}
```

**Bad Example:**

```go
// controller/user.go
func (c *UserController) GetUser(ginCtx *gin.Context) {
    ctx := ginCtx.Request.Context()
    userID := ginCtx.Param("id")

    user, err := c.userService.GetUserByID(ctx, userID)
    if err != nil {
        handleContextError(ginCtx, err)
        return
    }

    ginCtx.JSON(http.StatusOK, user)
}

// service/user.go — receives a stripped context, missing Gin's lifecycle signals
func (s *UserService) GetUserByID(ctx context.Context, id string) (*model.User, error) {
    return s.repo.FindByID(ctx, id)
}
```

## Handling context errors

Always check for context cancellation and deadline errors and map them to the appropriate HTTP status codes.

| Context error | HTTP status | Meaning |
|---|---|---|
| `context.Canceled` | 499 | Client closed the request |
| `context.DeadlineExceeded` | 504 | Gateway timeout |

```go
func handleContextError(c *gin.Context, err error) {
    switch {
    case errors.Is(err, context.Canceled):
        c.JSON(499, gin.H{"error": "request cancelled by client"})

    case errors.Is(err, context.DeadlineExceeded):
        c.JSON(http.StatusGatewayTimeout, gin.H{"error": "request timed out"})

    default:
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    }
}
```

Log context errors with the appropriate type before responding:

```go
if errors.Is(err, context.Canceled) {
    log.Printf("ClientError: request cancelled by client for user %s", id)
    c.JSON(499, gin.H{"error": "request cancelled"})
    return
}

if errors.Is(err, context.DeadlineExceeded) {
    log.Printf("ServerError: deadline exceeded fetching user %s", id)
    c.JSON(http.StatusGatewayTimeout, gin.H{"error": "request timed out"})
    return
}
```

---

# Defer

`defer` schedules a function call to run when the surrounding function returns, regardless of how it returns. It is the idiomatic way to handle cleanup (closing files, releasing locks, ending spans).

## Use defer for cleanup

```go
func writeReport(path string, data []byte) error {
    f, err := os.Create(path)
    if err != nil {
        return fmt.Errorf("creating report file: %w", err)
    }
    defer f.Close()

    _, err = f.Write(data)
    return err
}
```

## Avoid defer inside loops

`defer` runs when the function returns, not when the loop iteration ends. Deferring inside a loop means all deferred calls pile up until the function exits, which can exhaust resources.

**Bad Example:**

```go
func processFiles(paths []string) error {
    for _, path := range paths {
        f, err := os.Open(path)
        if err != nil {
            return err
        }
        defer f.Close() // deferred until processFiles returns, not each iteration
        // process f...
    }
    return nil
}
```

**Good Example:**

```go
func processFiles(paths []string) error {
    for _, path := range paths {
        if err := processFile(path); err != nil {
            return err
        }
    }
    return nil
}

func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()
    // process f...
    return nil
}
```

## Defer executes in LIFO order

Multiple defers in the same function execute in last-in, first-out order — the last `defer` statement runs first. This mirrors how you'd manually unwind resources (open A, open B → close B, close A).

```go
func example() {
    defer fmt.Println("first defer — runs last")
    defer fmt.Println("second defer — runs first")
}
// Output:
// second defer — runs first
// first defer — runs last
```

---

# Named Return Values

Named return values declare the return variables in the function signature. Avoid them in most cases — they reduce readability by making it unclear where a value is assigned.

**Acceptable use: `defer`-based error enrichment**

The one case where named returns are idiomatic is when a `defer` needs to modify the returned error:

```go
func queryUser(id int) (user *User, err error) {
    defer func() {
        if err != nil {
            err = fmt.Errorf("queryUser %d: %w", id, err)
        }
    }()

    user, err = db.FindUser(id)
    return
}
```

**Avoid naked returns**

Even with named returns, always list the values explicitly in `return` statements. Naked `return` (a bare `return` with no values) hides what the function is actually returning and should never be used.

**Bad Example:**

```go
func divide(a, b float64) (result float64, err error) {
    if b == 0 {
        err = errors.New("division by zero")
        return // naked return — unclear what result is
    }
    result = a / b
    return // naked return
}
```

**Good Example:**

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
```

---

# Conclusion

By following these coding conventions and best practices, we aim to maintain a high standard of code quality, readability, and maintainability across the project. 

Consistency in coding style and structure will help streamline development and collaboration among team members. 

For any questions or suggestions regarding these practices, please reach out to the team.


# References

- [Effective Go](https://golang.org/doc/effective_go)
- [100 Go Mistakes and How to Avoid Them by Teiva Harsanyi](https://www.amazon.com/100-Mistakes-How-Avoid-Them/dp/1617299596)
- [Learning Go: An Idiomatic Approach to Real-World Go Programming by Jon Bodner](https://www.amazon.com/Learning-Go-Idiomatic-Real-World-Programming/dp/1492077216)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Semantic Versioning](https://semver.org/)
- [Gin Gonic](https://gin-gonic.com/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Twelve Factor App](https://12factor.net/)

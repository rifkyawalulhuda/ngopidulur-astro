---
title: "Functions dan OOP Python: Lambda, Decorator, Class, dan Inheritance"
description: Panduan lengkap Functions dan OOP Python — mendefinisikan fungsi,
  parameter *args dan **kwargs, lambda, map/filter/reduce, decorator, class,
  constructor __init__, inheritance, encapsulation, polymorphism, dan magic
  methods. Dilengkapi contoh kode praktis dari dasar hingga menengah.
pubDate: 2026-06-29T18:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - Functions
  - OOP
  - Lambda
  - Class
  - Inheritance
  - BelajarPython
series: "Python Dasar"
seriesOrder: 5
---

**Functions dan OOP** adalah dua pilar pemrograman Python modern. Fungsi membuat kode modular dan reusable, sementara OOP memungkinkan kamu memodelkan dunia nyata dalam kode.

## Functions (Fungsi)

### Mendefinisikan Fungsi

```python
# Fungsi dasar
def greet():
    print("Hello, World!")

greet()  # Hello, World!

# Fungsi dengan parameter
def greet_name(name):
    print(f"Hello, {name}!")

greet_name("Budi")  # Hello, Budi!

# Fungsi dengan return value
def add(a, b):
    return a + b

result = add(3, 5)  # 8
```

### Parameter dan Argumen

```python
# Default parameter
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Budi")              # Hello, Budi!
greet("Siti", "Selamat Pagi")  # Selamat Pagi, Siti!

# Keyword arguments
def person_info(name, age, city):
    print(f"{name}, {age} tahun, dari {city}")

person_info(age=25, city="Jakarta", name="Budi")  # urutan bebas

# *args — menerima banyak argumen posisional
def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))        # 6
print(total(1, 2, 3, 4, 5))  # 15

# **kwargs — menerima banyak keyword arguments
def display(**info):
    for key, val in info.items():
        print(f"{key}: {val}")

display(name="Budi", age=25, city="Jakarta")

# Kombinasi
def mixed(a, b, *args, **kwargs):
    print(a, b, args, kwargs)

mixed(1, 2, 3, 4, x=10, y=20)
# 1 2 (3, 4) {'x': 10, 'y': 20}
```

### Return Multiple Values

```python
def min_max(numbers):
    return min(numbers), max(numbers)  # return tuple

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(lo, hi)  # 1 9
```

### Scope: Local vs Global

```python
x = 10  # global variable

def func():
    x = 20  # local variable (tidak ubah global)
    print(x)  # 20

func()
print(x)  # 10 (global tetap)

# Pakai global keyword untuk ubah global dari dalam fungsi
def change_global():
    global x
    x = 99

change_global()
print(x)  # 99
```

---

## Lambda Function

Lambda adalah **anonymous function** satu baris — cocok untuk operasi sederhana.

```python
# Syntax: lambda parameter: ekspresi

# Fungsi biasa
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2
print(square(5))  # 25

# Lambda dengan multiple parameter
add = lambda a, b: a + b
print(add(3, 4))  # 7

# Lambda dengan kondisi
classify = lambda x: "genap" if x % 2 == 0 else "ganjil"
print(classify(4))  # genap
```

### map(), filter(), reduce()

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map() — terapkan fungsi ke setiap elemen
squares = list(map(lambda x: x**2, numbers))
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# filter() — filter elemen berdasarkan kondisi
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4, 6, 8, 10]

# reduce() — akumulasi nilai
from functools import reduce
total = reduce(lambda acc, x: acc + x, numbers)
# 55 (1+2+3+...+10)

product = reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5])
# 120 (1*2*3*4*5)

# Sorting dengan lambda
students = [('Budi', 85), ('Siti', 92), ('Andi', 78)]
students.sort(key=lambda s: s[1], reverse=True)
# [('Siti', 92), ('Budi', 85), ('Andi', 78)]
```

---

## Decorator

Decorator adalah fungsi yang **membungkus fungsi lain** untuk menambah behavior tanpa mengubah kode aslinya.

```python
# Decorator dasar
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Sebelum fungsi dipanggil")
        result = func(*args, **kwargs)
        print("Setelah fungsi dipanggil")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("Budi")
# Sebelum fungsi dipanggil
# Hello, Budi!
# Setelah fungsi dipanggil

# Decorator untuk timing
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} selesai dalam {end-start:.4f} detik")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "done"

slow_function()
# slow_function selesai dalam 1.0012 detik
```

---

## OOP: Object Oriented Programming

### Class dan Object

```python
# Mendefinisikan class
class Person:
    # Class variable (shared oleh semua instance)
    species = "Homo sapiens"

    # Constructor
    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age

    # Instance method
    def greet(self):
        print(f"Hi, saya {self.name}, {self.age} tahun")

    def __str__(self):
        return f"Person({self.name}, {self.age})"

    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age})"

# Membuat object (instance)
p1 = Person("Budi", 25)
p2 = Person("Siti", 22)

p1.greet()              # Hi, saya Budi, 25 tahun
print(p1.name)          # Budi
print(Person.species)   # Homo sapiens
print(p1)               # Person(Budi, 25)
```

### Encapsulation

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # private (name mangling)

    # Getter
    @property
    def balance(self):
        return self.__balance

    # Setter dengan validasi
    @balance.setter
    def balance(self, amount):
        if amount < 0:
            raise ValueError("Saldo tidak boleh negatif")
        self.__balance = amount

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Deposit {amount}. Saldo: {self.__balance}")

    def withdraw(self, amount):
        if amount > self.__balance:
            print("Saldo tidak cukup")
            return
        self.__balance -= amount
        print(f"Tarik {amount}. Saldo: {self.__balance}")

acc = BankAccount("Budi", 1000000)
acc.deposit(500000)    # Deposit 500000. Saldo: 1500000
acc.withdraw(200000)   # Tarik 200000. Saldo: 1300000
print(acc.balance)     # 1300000
# acc.__balance        # AttributeError - tidak bisa akses langsung
```

### Inheritance

```python
# Parent class
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        print(f"{self.name} berkata: {self.sound}")

    def __str__(self):
        return f"Animal({self.name})"

# Child class
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Woof")  # panggil parent constructor
        self.breed = breed

    def fetch(self):
        print(f"{self.name} mengambil bola!")

    # Override method parent
    def speak(self):
        print(f"{self.name} ({self.breed}) menggonggong: {self.sound}!")

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")

    def purr(self):
        print(f"{self.name} mendengkur...")

dog = Dog("Rex", "German Shepherd")
cat = Cat("Kitty")

dog.speak()   # Rex (German Shepherd) menggonggong: Woof!
cat.speak()   # Kitty berkata: Meow
dog.fetch()   # Rex mengambil bola!

# isinstance & issubclass
print(isinstance(dog, Dog))     # True
print(isinstance(dog, Animal))  # True (inheritance)
print(issubclass(Dog, Animal))  # True
```

### Polymorphism

```python
class Shape:
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14159 * self.r ** 2

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h
    def area(self):
        return self.w * self.h

# Polymorphism — fungsi yang sama, perilaku berbeda
shapes = [Circle(5), Rectangle(4, 6), Circle(3)]
for shape in shapes:
    print(f"{shape.__class__.__name__}: area = {shape.area():.2f}")
# Circle: area = 78.54
# Rectangle: area = 24.00
# Circle: area = 28.27
```

### Magic Methods (Dunder Methods)

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):          # str(obj)
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):         # repr(obj)
        return f"Vector(x={self.x}, y={self.y})"

    def __add__(self, other):   # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):          # len(obj)
        return int((self.x**2 + self.y**2) ** 0.5)

    def __eq__(self, other):    # v1 == v2
        return self.x == other.x and self.y == other.y

v1 = Vector(3, 4)
v2 = Vector(1, 2)
print(v1)           # Vector(3, 4)
print(v1 + v2)      # Vector(4, 6)
print(len(v1))      # 5
print(v1 == v2)     # False
```

---

## Ringkasan

| Konsep | Kegunaan |
|--------|---------|
| `def func()` | Fungsi standar |
| `lambda x: x*2` | Fungsi anonim singkat |
| `*args, **kwargs` | Fungsi fleksibel |
| `@decorator` | Tambah behavior tanpa ubah fungsi |
| `class` | Blueprint object |
| `__init__` | Constructor |
| `self.__var` | Encapsulation (private) |
| `class Child(Parent)` | Inheritance |
| `super()` | Akses parent class |

## Kesimpulan

Functions dan OOP adalah fondasi Python modern. Lambda dan map/filter/reduce cocok untuk functional programming style, sementara Class dan Inheritance membantu kamu membangun sistem yang terstruktur dan mudah di-maintain.

---

*Referensi: Python Tutorial — Jupyter Notebook by Asif Bhat, Functions, OOP.*

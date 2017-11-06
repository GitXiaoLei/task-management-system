function foo(obj) {
  with (obj) { // 创建了一个新的词法作用域
    a = 2 // 使用LHS查询a
  }
}
var o1 = { a: 3 }
var o2 = { b: 3 }
foo(o1)
console.log(o1.a) // 2

foo(o2)
console.log(o2.a) // undefined o2中，没有a属性
console.log(a) // 2 由于使用了LHS查询a，而在with创建的全新的词法作用域中没有找到a这个变量，就会在全局环境中创建一个变量a，
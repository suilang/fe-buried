# 词法作用域及作用域链

当JavaScript代码执行一段可执行代码\(executable code\)时，会创建对应的执行上下文\(execution context\)。

对于每个执行上下文，都有三个重要属性：

* 变量对象\(Variable object，VO\)
* 作用域链\(Scope chain\)
* this

前面已经讲解了[this](https://juejin.im/post/5eac13735188256d51476f59)，今天来讲讲作用域及作用域链。

## 作用域

作用域是指程序源代码中定义变量的区域。

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

JavaScript 采用词法作用域\(lexical scoping\)，也就是静态作用域。

> 所谓的词法作用域，就是代码在编写过程就体现出来的作用范围。代码一旦写好，不用执行， 作用范围就已经确定好了，这个就是所谓的词法作用域。

词法作用域的规则：

1. 函数允许访问函数外的数据 \(也有就近原则）
2. 整个代码结构中只有函数可以限定作用域
3. 作用域内首先使用变量提升分析
4. 如果当前作用域找到所需变量，则停止查找

> \*与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar(); // 1
```

分析下执行过程：

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

> 假设JavaScript采用动态作用域，让我们分析下执行过程：
>
> 执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

看一个《JavaScript权威指南》中的例子：

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

两段代码都会打印：`local scope`。因为JavaScript采用的是词法作用域，函数的作用域基于函数创建的位置。

引用《JavaScript权威指南》的回答就是：

> JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 `f()` 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 `f()`，这种绑定在执行 `f()` 时依然有效。

## 作用域链

当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

这里不具体介绍函数的`[[scope]]`属性，只介绍一下怎么简单的分析作用域链。

作用域链绘制规则如下：

1. 全局变量，函数声明都是属于0级链，每个对象占一个位置
2. 遇到函数声明就延伸一个链出来，一级级展开
3. 访问变量时首先从当前函数内部查找，如果当前作用域没有定义，往上级链中检查
4. 如此往复，直到0级链，如果0级没有，则这个变量为undefined

以代码为例:

```javascript
function func1(){
   alert(num);  
}

function func2(){
   var num=456;
   function func3(){
       func1();
   }
   func3();  
}

func2();//结果显示:num is not defined
```

上述代码作用域链如下：

![](/img/gaitubao-ping-mu-kuai-zhao-20200503-xia-wu-5.22.33.png)

分析下代码执行流程：

1. 当程序执行到func2时，进入func2的执行环境
2. 当程序执行到func3时，在func3上下文中没有找到func1
3. 回到1级作用域，即func3声明位置所在的1级作用域寻找，没有找到
4. 回到func2声明时所在0级作用域寻找，找到后进入func1的上下文环境
5. func1归属于0级作用域，内部只能访问func1内部作用域及0级作用域，在func1作用域内没有找到num，回到0级作用域，也没有找到，抛出错误

请注意：

1. 只有函数声明会延伸下级链，调用只会查找，不会展开下级链
2. 所有链都能访问到0级链，0级链只能访问0级链



## 参考文章：

1. [**JavaScript深入之词法作用域和动态作用域**](https://github.com/mqyqingfeng/Blog/issues/3)
2. [**JavaScript深入之作用域链**](https://github.com/mqyqingfeng/Blog/issues/6)
3. [**JS-词法作用域 作用域链**](https://www.cnblogs.com/xixiaijunjun/p/10085078.html)


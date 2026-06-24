# 前端模块化

在NodeJS之前，由于没有过于复杂的开发场景，前端是不存在模块化的。NodeJS诞生之后，它使用`CommonJS`的模块化规范。从此，js模块化开始快速发展。

模块化的开发方式可以提供代码复用率，方便进行代码的管理。通常来说，**一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数**。

## CommonJS

NodeJS是`CommonJS`规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

```
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
```

上面代码中，变量`x`和函数`addX`，是当前文件`example.js`私有的，其他文件不可见。

如果想在多个文件分享变量，必须定义为`global`对象的属性。

```
global.warning = true;
```

上面代码的`warning`变量，可以被所有文件读取。当然，这样写法是不推荐的。

CommonJS规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。

```
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

上面代码通过`module.exports`输出变量`x`和函数`addX`。

`require`方法用于加载模块。

```
var example = require('./example.js');

console.log(example.x); // 5
console.log(example.addX(1)); // 6
```

CommonJS模块的特点如下。

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

### Module对象
Node内部提供一个Module构建函数。所有模块都是Module的实例。

每个模块内部，都有一个`module`对象，代表当前模块。它有以下属性。

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
- `module.filename` 模块的文件名，带有绝对路径。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 表示模块对外输出的值。

如果在命令行下调用某个模块，比如node something.js，那么module.parent就是null。如果是在脚本之中调用，比如require('./something.js')，那么module.parent就是调用它的模块。利用这一点，可以判断当前模块是否为入口脚本。

### module.exports属性
module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。
```
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```
```
var example = require('./example.js');

console.log(example.x); // 5
console.log(example.addX(1)); // 6
```

### exports变量

为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令。
```
var exports = module.exports;
```
因此，在对外输出模块接口时，可以向exports对象添加方法。
```
exports.area = function (r) {
  return Math.PI * r * r;
};
```
注意，因为`exports`持有的是`module.exports`的引用，所以，不能直接将exports变量指向一个值，因为这样等于切断了exports与module.exports的联系。
```
exports = function(x) {console.log(x)};
```
上面这样的写法是无效的，因为exports不再指向module.exports了。

下面的写法也是无效的。因为也切段了`exports`对`module.exports`的引用
```
exports.hello = function() {
  return 'hello';
};

module.exports = 'Hello world';
```
上面代码中，hello函数是无法对外输出的，因为module.exports被重新赋值了。

如果一个模块的对外接口，就是一个单一的值，不能使用exports输出，只能使用module.exports输出。
```
module.exports = function (x){ console.log(x);};
```

### 加载模式

CommonJS规范加载模块是同步的，在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。也就是说，只有加载完成，才能执行后面的操作。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，读取非常快，所以这样做不会有问题。

### 加载机制

CommonJS模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

下面是一个模块文件`lib.js`。

```
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量`counter`和改写这个变量的内部方法`incCounter`。

然后，加载上面的模块。

```
// main.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，`counter`输出以后，`lib.js`模块内部的变化就影响不到`counter`了。

## AMD规范

AMD规范是非同步加载模块，允许指定回调函数。浏览器环境下，要从服务器端加载模块，就必须采用非同步模式，因此浏览器端一般采用AMD规范。

AMD规范使用define方法定义模块，如果我们定义的模块本身也依赖其他模块,那就需要将它们放在[]中作为define()的第一参数。下面就是一个例子：

```
define(['package/lib'], function(lib){
  function foo(){
lib.log('hello world!');
  }

  return {
foo: foo
  };
});
```

引用模块的时候，我们将模块名放在[]中作为reqiure()的第一参数；所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

```
// 引用模块，将模块放在[]内
require(['jquery', 'math'],function($, math){
  var sum = math.add(10,20);
  $("#sum").html(sum);
});
```

## require

### 加载规则

require命令用于加载文件，后缀名默认为.js。
```
var foo = require('foo');
//  等同于
var foo = require('foo.js');
```

根据参数的不同格式，`require`命令去不同路径寻找模块文件。

1. 如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，`require('/home/marco/foo.js')`将加载`/home/marco/foo.js`。

2. 如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，`require('./circle')`将加载当前脚本同一目录的`circle.js`。

3. 如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）。

举例来说，脚本`/home/user/projects/foo.js`执行了`require('bar.js')`命令，Node会依次搜索以下文件。
```
/usr/local/lib/node/bar.js
/home/user/projects/node_modules/bar.js
/home/user/node_modules/bar.js
/home/node_modules/bar.js
/node_modules/bar.js
```
4. 如果参数字符串不以“./“或”/“开头，而且是一个路径，比如require('example-module/path/to/file')，则将先找到example-module的位置，然后再以它为参数，找到后续路径。

5. 如果指定的模块文件没有发现，Node会尝试为文件名添加.js、.json、.node后，再去搜索。.js件会以文本格式的JavaScript脚本文件解析，.json文件会以JSON格式的文本文件解析，.node文件会以编译后的二进制文件解析。

6. 如果想得到require命令加载的确切文件名，使用require.resolve()方法。

### 目录加载规则

在package.json文件中，将入口文件写入main字段。让require方法可以通过这个入口文件，加载整个目录下面是一个例子。
```
// package.json
{ 
"name" : "some-library",
  "main" : "./lib/some-library.js" 
}
```
require发现参数字符串指向一个目录以后，会自动查看该目录的package.json文件，然后加载main字段指定的入口文件。如果package.json文件没有main字段，或者根本就没有package.json文件，则会加载该目录下的index.js文件或index.node文件。

### 模块的缓存

第一次加载某个模块时，Node会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的module.exports属性。
```
require('./example.js');
require('./example.js').message = "hello";
require('./example.js').message
// "hello"
```
连续三次使用require命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个message属性。但是第三次加载的时候，这个message属性依然存在，这就证明require命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以让该模块输出一个函数，然后每次require这个模块的时候，重新执行一下输出的函数。

require函数及其辅助方法主要如下。

- require(): 加载外部模块
- require.resolve()：将模块名解析到一个绝对路径
- require.main：指向主模块
- require.cache：指向所有缓存的模块
- require.extensions：根据文件的后缀名，调用不同的执行函数

## CMD
AMD的实现者require.js在申明依赖的模块时，会在第一时间加载并执行模块内的代码：
```
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
    // 等于在最前面声明并初始化了要用到的所有模块
if (false) {
  // 即便没用到某个模块 b，但 b 还是提前执行了。**这就CMD要优化的地方**
  b.foo()
} 
});
```
CMD是另一种js模块化方案，它与AMD很类似，不同点在于：AMD推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。
```
define(function (require, exports, module){
  var someModule = require("someModule");
  var anotherModule = require("anotherModule");

  someModule.doTehAwesome();
  anotherModule.doMoarAwesome();

  exports.asplode = function (){
someModule.doTehAwesome();
anotherModule.doMoarAwesome();
  };
});
```

## UMD

umd是一种思想，就是一种兼容 commonjs,AMD,CMD 的兼容写法，define.amd / define.cmd / module 等判断当前支持什么方式，

UMD先判断支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。都不行就挂载到 window 全局对象上面去

(function (root, factory) {
if (typeof define === 'function' && (define.amd || define.cmd)) {
    //AMD,CMD
    define(['b'], function(b){
      return (root.returnExportsGlobal = factory(b))
    });
} else if (typeof module === 'object' && module.exports) {
    //Node, CommonJS之类的
    module.exports = factory(require('b'));
} else {
    //公开暴露给全局对象
    root.returnExports = factory(root.b);
}
}(this, function (b) {
  return {};
}));

## ES6 Module

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。
```
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
ele.textContent = add(99 + basicNum);
}
```

ES6还提供了export default命令，为模块指定默认输出，对应的import语句不需要使用大括号。这也更趋近于ADM的引用写法。

ES6 模块的特征：

- 严格模式：ES6 的模块自动采用严格模式
- import read-only特性： import的属性是只读的，不能赋值，类似于const的特性
- export/import提升： import/export必须位于模块顶级，不能位于作用域内；其次对于模块内的import/export会提升到模块顶部，这是在编译阶段完成的

## 加载机制
ES6 模块的运行机制与 CommonJS 不一样。ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个**只读引用**。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。模块内部引用的变化，会反应在外部。

在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。


## 参考文档：

1. [CommonJS规范](https://javascript.ruanyifeng.com/nodejs/module.html)
2. [[前端模块化——彻底搞懂AMD、CMD、ESM和CommonJS](https://www.cnblogs.com/chenwenhao/p/12153332.html)]


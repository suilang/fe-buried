# 事件机制/EventLoop

javascript是一门**单线程**语言，在最新的HTML5中提出了Web-Worker，但javascript是单线程这一核心仍未改变，不管谁写的代码，都得一句一句的来执行。

当我们打开网站时，网页的渲染过程包括了一大堆任务，比如页面元素的渲染。script脚本的执行，通过网络请求加载图片音乐之类。如果一个一个的顺序执行，遇上任务耗时过长，就会发生卡顿现象。于是，事件循环\(Event Loop\)应运而生。

### 什么是 Event Loop？

**事件循环**，可以理解为实现异步的一种方式。[event loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop)在**HTML Standard**中的定义：

> 为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用本节所述的`event loop`。

`JavaScript` 有一个主线程 `main thread`，和调用栈 `call-stack` 也称之为执行栈。所有的任务都会放到调用栈中等待主线程来执行。待执行的任务就是流水线上的原料，只有前一个加工完，后一个才能进行。event loops就是把原料放上流水线的工人，协调**用户交互，脚本，渲染，网络**这些不同的任务。

将待执行任务分为两类：

* 同步任务 
* 异步任务 

主线程自上而下执行所有代码

* 同步任务直接进入到主线程被执行，而异步任务则进入到 `Event Table` 并注册相对应的回调函数
* 满足指定条件\(异步任务完成\)后，`Event Table` 会将这个函数移入 `Event Queue`
* 主线程任务执行完了以后，会从`Event Queue`中读取任务，进入到主线程去执行。
* 不断重复的上述过程就是所谓的Event Loop\(事件循环\)。

### 任务队列\(task queue\)

> 一个event loop有一个或者多个task队列。当用户代理安排一个任务，必须将该任务增加到相应的event loop的一个tsak队列中。

task也被称为macrotask\(宏任务\)，是一个先进先出的队列，由指定的任务源去提供任务。

task任务源非常宽泛，总结来说task任务源包括：

* setTimeout
* setInterval
* setImmediate
* I/O
* UI rendering
* 整体代码script

所以 `Task Queue` 就是承载任务的队列。而 `JavaScript` 的 `Event Loop` 就是会不断地过来找这个 `queue`，问有没有 `task` 可以运行运行。

### 微任务\(microtask\)

> 每一个event loop都有一个microtask队列，一个microtask会被排进microtask队列而不是task队列。

microtask 队列和task 队列有些相似，都是先进先出的队列，由指定的任务源去提供任务，不同的是一个 event loop里只有一个microtask 队列。

通常认为是microtask任务源有：

* process.nextTick
* promise
* Object.observe
* MutationObserver

> [**在Promises/A+规范的Notes 3.1**](https://promisesaplus.com/#notes)**中提及了promise的then方法可以采用“宏任务（macro-task）”机制或者“微任务（micro-task）”机制来实现**。所以不同浏览器对promise的实现可能存在差异。

### 浏览器环境下的 Event Loop

事件循环的顺序，决定js代码的执行顺序。进入整体代码\(宏任务\)后，开始第一次循环。接着执行所有的微任务。然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。

> 执行完`microtask`队列里的任务，有**可能**会渲染更新。（浏览器很聪明，在一帧以内的多次dom变动浏览器不会立即响应，而是会积攒变动以最高60HZ的频率更新视图）

![](/img/image%20%2812%29.png)



### setTimeout

如下面代码，`setTimeout` 就是一个异步任务，

```javascript
console.log('start')
setTimeout(()=>{
  console.log('setTimeout')
});
console.log('end');
```

* 主线程执行同步任务：`console.log('start');`
* 遇到 `setTimeout` 发现是一个异步任务，就先注册了一个异步的回调
* 执行语句`console.log('end')`
* 主线程任务执行完毕，看`Event Queue`是否有待执行的 task，只要主线程的`task queue`没有任务执行了，主线程就一直在这等着
* 等异步任务等待的时间到了以后，在执行`console.log('setTimeout')`。

> js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去Event Queue那里检查是否有等待被调用的函数。

注意，只有等主线程执行完毕，才会检查`Event Queue`是否有待执行的 task，因此可能会出现另一种情况。

```javascript
console.log('start')

setTimeout(()=>{
  console.log('setTimeout')
}, 3000);

todo(); // 假定这里是一个耗时10秒的操作
```

正常情况下，控制台输出应该是这样的

```javascript
start
// 等待3秒
setTimeout
```

而实际上，输出大概是这样的：

```javascript
start
// 等待10秒
setTimeout
```

重新分析一下执行流程：

* 主线程执行同步任务：`console.log('start');`
* 遇到 `setTimeout` 发现是一个异步任务，就先注册了一个异步的回调
* 执行语句 `todo()`
* 3秒到了，计时事件`timeout`完成，打印任务进入Event Queue
* 主线程任务执行完毕，看`Event Queue`是否有待执行的 task，
* 执行`console.log('setTimeout')`。

`setTimeout`这个函数，是经过指定时间后，把要执行的任务加入到Event Queue中，与上一个栗子不同，当计时事件完成后，主线程任务并没有执行完毕。只有等主线程执行完本轮代码后，才会查询`Event Queue。`所以，等待大约10秒后控制台才有第二次输出。

#### `setTimeout(fn,0)`

`setTimeout(fn,0)`的含义是，指定某个任务在主线程最早可得的空闲时间执行，意思就是只要主线程执行栈内的同步任务全部执行完成，栈为空就马上执行。

> 即便主线程为空，0毫秒实际上也是达不到的。根据HTML的标准，最低是4毫秒。

### setInterval

`setInterval`会每隔指定的时间将注册的函数置入Event Queue，如果前面的任务耗时太久，那么同样需要等待。

与`setTimeout`相似，对于`setInterval(fn,ms)`来说，不是每过`ms`秒会执行一次`fn`，而是每过`ms`秒，会有`fn`进入Event Queue。一旦**`setInterval`的回调函数`fn`执行时间由于主线程繁忙超过了延迟时间`ms`，那么就完全看不出来有时间间隔，而是会连续执行。**

### Promise与process.nextTick\(callback\)

`process.nextTick(callback)`类似node.js版的"setTimeout"，在事件循环的下一次循环中调用 callback 回调函数。

以一段代码为例：

```javascript
setTimeout(function() {
    console.log('setTimeout');
})

new Promise(function(resolve) {
    console.log('promise');
}).then(function() {
    console.log('then');
})

console.log('console');
```

主线程自上而下执行所有代码

* 先遇到`setTimeout`，那么将其回调函数注册后分发到宏任务Event Queue。
* 接下来遇到了`Promise`，`new Promise`立即执行，`then`函数分发到微任务Event Queue。
* 遇到`console.log()`，立即执行。
* 整体代码script作为第一个宏任务执行结束，看看有哪些微任务？我们发现了`then`在微任务Event Queue里面，执行。
* ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务Event Queue开始。我们发现了宏任务Event Queue中`setTimeout`对应的回调函数，立即执行。
* 结束。

### 宏任务和微任务嵌套

> 执行完一个宏任务后，会执行所有的微任务，然后再执行一个宏任务

```javascript
console.log('start');
Promise.resolve()
  .then(function promise1() {  // then1
    console.log('promise1');
  })
  .then(function () {          // then2
    console.log('promise2')
  })
  
setTimeout(function setTimeout1() {  // setTimeout1
  console.log('setTimeout1')
  Promise.resolve().then(function promise2() {  // then3
    console.log('promise3');
  })
}, 0)

setTimeout(function setTimeout2() {  // setTimeout1
  console.log('setTimeout2')
}, 0)
console.log('end')
```

分析下执行流程：

* 遇到`console.log()`，立即执行， 输出 start。
* 遇到`Promise`，`then`被分发到微任务Event Queue中。我们记为`then1`。
* 遇到`setTimeout`，其回调函数被分发到宏任务Event Queue中。我们暂且记为`setTimeout1`。
* 又遇到了`setTimeout`，其回调函数被分发到宏任务Event Queue中，我们记为`setTimeout2`。
* 遇到`console.log()`，立即执行， 输出 end。

第一轮执行结束，控制台输出 stert，end，此时，任务队列如下：

| 宏任务Event Queue | 微任务Event Queue |
| :--- | :--- |
| setTimeout1 | then1 |
| setTimeout2 |  |

执行微任务：

* 执行then1，输出 promise1，then被分发到微任务，记为 then2
* 此时为微任务循环， 执行 hten2， 输出 promise2

微任务执行完毕，第二轮循环开始，转入宏任务 setTimeout1：

* 遇到`console.log()`，立即执行， 输出 setTimeout1。
* 遇到`Promise`，`then`被分发到微任务Event Queue中。我们记为`then3`。

执行微任务 then3：

* 遇到`console.log()`，立即执行， 输出 promise3。

第三轮循环开始，执行宏任务setTimeout2

* 遇到`console.log()`，立即执行， 输出 setTimeout2

最后，控制台输出结果为

```javascript
stert
end
promise1
promise2
setTimeout1
promise3
setTimeout2
```



### Node 环境下的 Event Loop

Node中的`Event Loop`是基于`libuv`实现的，而`libuv`是 Node 的新跨平台抽象层，`libuv`使用异步，事件驱动的编程方式，核心是提供`i/o`的事件循环和异步回调。`libuv`的`API`包含有时间，非阻塞的网络，异步文件操作，子进程等等。

Node 的 Event Loop 分为 6 个阶段：

* timers：执行`setTimeout()` 和 `setInterval()`中到期的callback。
* pending callback: 上一轮循环中有少数的`I/O` callback会被延迟到这一轮的这一阶段执行
* idle, prepare：仅内部使用
* poll: 最为重要的阶段，执行`I/O` callback，在**适当的条件下**会阻塞在这个阶段
* check: 执行`setImmediate`的callback
* close callbacks: 执行`close`事件的callback，例如`socket.on('close'[,fn])`、`http.server.on('close, fn)`

> 上面六个阶段都不包括 process.nextTick\(\)

![](/img/image%20%284%29.png)

#### timers 阶段

timers 阶段会执行 `setTimeout` 和 `setInterval` 回调，并且是由 poll 阶段控制的。

在 timers 阶段其实使用一个最小堆而不是队列来保存所有的元素，因为timeout的callback是按照超时时间的顺序来调用的，并不是先进先出的队列逻辑）。而为什么 timer 阶段在第一个执行阶梯上其实也不难理解。在 Node 中定时器指定的时间也是不准确的，而这样，就能尽可能的准确了，让其回调函数尽快执行。

#### pending callbacks 阶段

pending callbacks 阶段其实是 `I/O` 的 callbacks 阶段。比如一些 TCP 的 error 回调等。

#### poll 阶段

poll 阶段主要有两个功能：

* 执行 `I/O` 回调
* 处理 poll 队列（poll queue）中的事件

当时Event Loop 进入到 poll 阶段并且 timers 阶段没有任何可执行的 task 的时候（也就是没有定时器回调），将会有以下两种情况

* 如果 poll queue 非空，则 Event Loop就会执行他们，直到为空或者达到system-dependent\(系统相关限制\)
* 如果 poll queue 为空，则会发生以下一种情况
  * 如果setImmediate\(\)有回调需要执行，则会立即进入到 check 阶段
  * 检查timer 阶段的任务。如果有的话，则会回到 timer 阶段执行回调。
  * 如果没有setImmediate\(\)需要执行，则 poll 阶段将等待 callback 被添加到队列中再立即执行，这也是为什么我们说 poll 阶段可能会阻塞的原因。

#### check 阶段

check 阶段在 poll 阶段之后，`setImmediate()`的回调会被加入check队列中，他是一个使用`libuv API` 的特殊的计数器。

通常在代码执行的时候，Event Loop 最终会到达 poll 阶段，然后等待传入的链接或者请求等，但是如果已经指定了setImmediate\(\)并且这时候 poll 阶段已经空闲的时候，则 poll 阶段将会被中止然后开始 check 阶段的执行。  


#### close callbacks 阶段

如果一个 socket 或者事件处理函数突然关闭/中断\(比如：`socket.destroy()`\),则这个阶段就会发生 `close` 的回调执行。

#### setImmediate\(\) vs setTimeout\(\)

* `setImmediate`在 poll 阶段后执行，即check 阶段
* `setTimeout` 在 poll 空闲时且设定时间到达的时候执行，在 timer 阶段

计时器的执行顺序将根据调用它们的上下文而有所不同。 如果两者都是从主模块中调用的，则时序将受到进程性能的限制。

如果不在`I / O`周期（即主模块）内，则两个计时器的执行顺序是不确定的，因为它受进程性能的约束：

```javascript
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

```javascript
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

如果在一个`I/O` 周期内移动这两个调用，则始终首先执行立即回调：

```javascript
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
复制代码
```

```javascript
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

与`setTimeout（）`相比，使用`setImmediate（）`的主要优点是，如果在`I / O`周期内安排了任何计时器，则`setImmediate（）`将始终在任何计时器之前执行，而与存在多少计时器无关。

#### nextTick queue

`process.nextTick（）`从技术上讲不是Event Loop的一部分。 相反，无论当前事件循环的当前阶段如何，如果存在 `nextTickQueue`，都将在当前操作完成之后处理`nextTickQueue,`优先于其他 `microtask` 。

```javascript
setTimeout(() => {
 console.log('timer1')
 Promise.resolve().then(function() {
   console.log('promise1')
 })
}, 0)
process.nextTick(() => {
 console.log('nextTick')
 process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
     })
   })
 })
})
// nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
```

### Node与浏览器的 Event Loop 差异

**浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。**  




### 参考文章：

1. [**这一次，彻底弄懂 JavaScript 执行机制**](https://juejin.im/post/59e85eebf265da430d571f89)
2. [**从event loop规范探究javaScript异步及浏览器更新渲染时机**](https://github.com/aooy/blog/issues/5)
3. [**彻底吃透 JavaScript 执行机制**](https://juejin.im/post/5d901418518825539312f587)




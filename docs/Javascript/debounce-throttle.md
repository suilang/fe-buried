# 防抖和节流

在进行窗口的`resize`、`scroll`，输入框内容校验等操作时，如果事件处理函数调用的频率无限制，会加重浏览器的负担，导致用户体验非常糟糕。此时我们可以采用`debounce`（防抖）和`throttle`（节流）的方式来减少调用频率，同时又不影响实际效果。 

通常情况下，我们习惯于使用`lodash`提供的工具函数，简单，方便，但是，码农总是要面试的么～

## 函数防抖

当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。

一起来实现个简单的debounce~

```js
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null;
    }, ms);
  }
}
```
请务必记得，debounce函数在装饰对应函数时，应该在只执行一次的位置被调用，例如class里的`constructor`。

## 函数节流

当持续触发事件时，保证一定时间段内只调用一次事件处理函数。

```js
function throttle(fn, ms) {            
    let timer;        
    return function(...args) {                
        if (timer) return;
        canRun = false;
        timer = setTimeout(() => { 
            fn(...args);
            timer = null;
        }, ms);          
    }        
}        
```
请务必记得，throttle函数在装饰对应函数时，应该在只执行一次的位置被调用，例如class里的`constructor`。

函数节流和函数防抖的原理其实很简单
- 防抖： 维护一个计时器，规定在delay时间后触发函数，但是在delay时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。
- 节流：  维护一个计时器，规定在delay时间后触发函数，但是在delay时间内再次触发的话，会判断是否有延迟调用函数未执行，有则返回，没有则设定在delay时间后触发函数

下面升个级，react hook里函数防抖及节流怎么实现？

## Hook防抖

简单的类推下，大概有一个这样的函数

```js
function useDebounce(fn, time) {
  return debounce(fn, time);
}
```
完美，写个函数试试
```js
export default function() {
  const [counter, setCounter] = useState(0);

  const handleClick = useDebounce(function() {
    setCounter(counter + 1)
  }, 1000)

::: v-pre
  return <div style={{ padding: 30 }}>
    <Button
:::
      onClick={handleClick}
    >click</Button>
    <div>{counter}</div>
  </div>
}
```
点两下试试，诶，挺好用的，不错，就是感觉哪里不太对劲的样子。。。

来换个样例
```js
export default function() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const handleClick = useDebounce(function() {
    setCounter1(counter1 + 1)
  }, 500)
 // 补充一个函数，加载后会自动更新counter2的数值 
  useEffect(function() {
    const t = setInterval(() => {
      setCounter2(x => x + 1)
    }, 500);
    return () => clearInterval(t)
  }, [])


::: v-pre
  return <div style={{ padding: 30 }}>
    <Button
:::
      onClick={function() {
        handleClick()
      }}
    >click</Button>
    <div>{counter1}</div>
    <div>{counter2}</div>
  </div>
}
```
不就是加了个自动更新么，点两下...噫。。。防抖不管用了

还记得上面那句话么，防抖函数必须在只执行一次的位置调用。在类组件中，放在`constructor`里或者变量函数生成的时候都可以，因为类组件只会初始化一次，后续组件中绑定的函数永远是不变的，因此依据闭包原理保存下来的状态会起作用。

而在函数式组件中，每次`render`时，内部函数会重新生成并绑定到组件上去。当组件只有一个`state`会影响`render`时，我们
1. 狂点按钮，
2. 只会触发点击事件，不会重新渲染，
3. 当前组件绑定的事件函数没有变化，防抖函数是同一个，因此防抖起作用

但是当有其他`state`影响渲染后
1. 狂点按钮
2. 触发事件，不重新渲染
3. `count2`发生变化，重新渲染
4. `handleClick`重新生成并绑定到组件，
5. 原有函数失效，防抖失效，原有函数延迟一定后执行
5. `counter1`发生变化

流程的对比就是这样了，现在你明白为什么正常的防抖函数不能用在 `reack hook` 里了么？

那么，怎么实现`react hook`防抖呢？核心思想就是，保证每次渲染时，绑定到组件上的函数是同一个防抖函数。

我们逐步类推一下，首先，既然要保证是同一个防抖函数，那么试试`useCallback`或者`useMemo`吧，这个`hook`可以保证依赖不变时，返回同一个值。

来，让我们加一层包装，依赖传入空数组，保证`useCallback`永远返回同一个函数
```js
function useDebounce(fn, delay) {
  return useCallback(debounce(fn, delay), [])
}

export default function() {
  const [counter, setCounter] = useState(0);

  const handleClick = useDebounce(function() {
    setCounter(counter + 1)
  }, 1000)

::: v-pre
  return <div style={{ padding: 30 }}>
    <Button
:::
      onClick={handleClick}
    >click</Button>
    <div>{counter}</div>
  </div>
}
```
本次使用单个counter进行调试，猜猜结果？

counter从0变到1后就不会改变了。why？如果你理解[闭包的原理](https://juejin.im/post/5eb2ad59e51d454def226a3f)，那你应该能理解快照的概念。

由于我们的`useCallback`依赖为空数组，所以组件初始化完成后，`handleClick`函数永远为初始化时的函数快照，也就是后续组件重新渲染时不会更新`handleClick`，同时，`handleClick`持有的`counter`也为本次函数创建时的快照，即永远为`0`,所以，哪怕防抖函数保持不变，也没法使程序正常运行。  

当然，你可以通过` setCounter(x => x + 1)`来得到正确的`counter`值，但其他场景就不适用了。

还有什么能保证数据唯一性呢？`useRef`～
上面方法的问题在于，要么没法保证防抖函数唯一，致使timer失去效果，要么没法保证调用函数是最新的，使调用函数失去效果，中和一下两种方法，结果就出来了。
```js
function useDebounce(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep)
}
```
大功告成～现在你有一个可直接拿走的hook防抖函数了

改造下节流函数

```js
function useThrottle(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
}
```
## 结语

接触到 react hook 后，大部分组件我都是直接使用hook形式的函数式组件，但是，值得注意的一点是，我们使用hook是为了更好更方便的实现组件，例如
- 不需要考虑props变化时如何更新state，
- 不需要考虑使用`getDerivedStateFromProps`更新数据之后如何触发一些操作，
- 又或者不需要专门考虑如何通过`shouldComponentUpdate`去写复杂的判断逻辑来减少不必要的渲染。

但请不要强求一定要写函数式组件，尤其是当函数式组件的内部函数会传递到下一层组件或者函数间相互调用关系非常复杂时，如何保证函数的唯一性，如何处理依赖关系会让你疯狂。这个时候，重新使用类组件不失为一种好的选择。




参考文档
1. [React hooks 怎样做防抖？](https://juejin.im/post/5ea04691e51d4547126400c7)
2. [js防抖和节流](https://www.cnblogs.com/momo798/p/9177767.html)







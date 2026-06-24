# CSS百分比

## width height 百分比

当元素的height、width设置为百分比时，分别基于包含它的块级对象的高度、宽度。这个是常规百分比的含义。

```html
<div class="container">
  <div class="inner">注意这里</div>
  <div class="divider">我是分割线</div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
}

.inner{
  background: lightblue;
  text-align: center;
  width: 50%;
  height: 50%;
}
.divider{
  border-top: 1px solid lightblue;
  text-align: center;
}
```
<div  style="{width: '500px', height: '300px', border: '1px solid grey'}}">
  <div style="{width: '50%', height: '50%', background: 'lightblue', textAlign: 'center'}}">注意这里</div>
  <div style="{borderTop: '1px solid lightblue', textAlign: 'center'}}">我是分割线</div>
</div>


## margin 百分比

假设一个块级容器，宽 500px，高 300px，块级子元素定义 `margin:10% 5%;`，你觉得 margin 的 top, right, bottom, left 计算值最终是多少？

我们来实际看一下
```html
<div class="container">
  <div class="inner">注意这里</div>
  <div class="divider">我是分割线</div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
}

.inner{
  margin: 10% 10%;
  background: lightblue;
  text-align: center;
}
.divider{
  border-top: 1px solid lightblue;
  text-align: center;
}
```
<div style="{width: '500px', height: '300px', border: '1px solid grey'}}">
  <div style="{margin: '10% 10%', background: 'lightblue', textAlign: 'center'}}">注意这里</div>
  <div style="{borderTop: '1px solid lightblue', textAlign: 'center'}}">我是分割线</div>
</div>


结果出来了，**50px 50px 50px 50px**，并不是`50px 30px 50px 30px`

**为什么**

> CSS权威指南中的解释：
>
> 我们认为，正常流中的大多数元素都会足够高以包含其后代元素（包括外边距），如果一个元素的上下外边距是父元素的height的百分数，就可能导致一个无限循环，父元素的height会增加，以适应后代元素上下外边距的增加，而相应的，上下外边距因为父元素height的增加也会增加。

 `margin` 的百分比值参照其包含块的宽度进行计算。

当书写模式变成纵向的时候，其参照将会变成包含块的高度。我们改变一下上面例子中的 CSS 书写模式：
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
  writing-mode: vertical-lr;
}
```
<div style="{width: '500px', height: '300px', border: '1px solid grey', writingMode: 'vertical-lr'}}">
  <div style="{margin: '10% 10%', background: 'lightblue', textAlign: 'center'}}">注意这里</div>
  <div style="{borderLeft: '1px solid lightblue', textAlign: 'center'}}">我是分割线</div>
</div>


这时的结果为：**30px 30px 30px 30px**

也就是说**书写模式影响 margin 百分比的参照对象**。

## padding 百分比

同上 Î 

举个例子看看效果。注意，这是纵向排列的例子。

<div style="{width: '500px', height: '300px', border: '1px solid grey', writingMode: 'vertical-lr'}}">
  <div style="{padding: '10% 10%', background: 'lightblue', textAlign: 'center'}}">注意这里</div>
  <div style="{borderLeft: '1px solid lightblue', textAlign: 'center'}}">我是分割线</div>
</div>

同上一个例子相比， 左侧元素占位区域并没有扩大，仅仅是由于`margin` 改为`padding` 导致背景区域扩大而已。

因此，padding的百分比不是相对于自身，而是当书写模式为默认**横向排列**时，相对**最近父元素的宽度**，书写模式为`writing-mode: vertical-lr;` 纵向排列时，百分比相对于父元素高度

## width、padding 联合百分比

单用一个很简单，但如果联合，可能就会有问题了。这里我不禁要问一句：

> 兄弟，你听过盒模型么？

- W3C的标准盒模型
    `box-sizing: content-box`，默认属性
     设置的width或height是对 实际内容（content）的width或height进行设置，内容周围的border和padding另外设置

- 怪异盒模型
    `box-sizing: border-box`
    设置的width或height是对 实际内容（content）+内边距（padding）+边框（border）之和

现在，我们来看个栗子，其中内部元素`width`设为`100%`， `padding`设为`10%`

```html
<div class="container">
  <div class="inner"><div class="text">注意这里</div></div>
  <div class="divider">我是分割线</div>
</div>
```

```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
}
.inner{
  background: lightblue;
  text-align: center;
  width: 100%;
  padding: 10% 10%;
  box-sizing: content-box; // 补上这里是因为有些环境默认不是标准盒模型
}
.divider{
  border-top: 1px solid lightblue;
  text-align: center;
}
.text{
  background: yellow;
}
```
<div style="{width: '500px', height: '300px', border: '1px solid grey'}}">
  <div style="{width:' 100%',padding: '10% 10%', background: 'lightblue',boxSizing: 'content-box', textAlign: 'center'}}">
    <div style="{background: 'yellow'}}">注意这里</div>
  </div>
  <div style="{borderTop: '1px solid lightblue', textAlign: 'center'}}">我是分割线</div>
</div>



在标准盒模型下，` width: 100%; padding: 10% 10%;` 会导致内部元素溢出，如果遇到这种情况，一般都会使用怪异盒模型，即设置`box-sizing: border-box`，这时候`width`的值是会包含`padding`的距离的。你可以自己打开控制台试试，这里就不举例了。

## top、left、right、bottom 百分比

还是看图说话


```html
<div class="container">
  <div class="inner"></div>
</div>
```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
  position: relative;
}

.inner{
  width: 200px;
  height: 100px;
  background: lightblue;
  top:10%;
  left: 10%;
  position: absolute;
}
```
<div style="{width: '500px', height: '300px', border: '1px solid grey', position: 'relative'}}">
  <div style="{ width: '200px', height: '100px', background: 'lightblue', top:'10%', left: '10%', position: 'absolute'}}"></div>
</div>


可以很明显的看出，left相对于父元素宽度，top相对于父元素高度。同理可推出right相对于父元素宽度，bottom相对于父元素高度。

## translate百分比

在translate 函数当中使用百分比是以该元素自身的宽高作为基准。

当子元素的width和height未知时，无法通过设置`margin-left:-width/2`和`margin-top:-height/2`来实现，这时候可以设置子元素的`transform: translate(-50%,-50%)`。

```html
<div class="container">
  <div class="inner"></div>
</div>

```
```css
.container{
  width: 500px;
  height: 300px;
  border: 1px solid grey;
  position: relative;
}

.inner{
  width: 50%;
  height: 50%;
  background: lightblue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
```
<div style="{width: '500px', height: '300px', border: '1px solid grey', position: 'relative'}}">
  <div style="{width: '50%',
  height: '50%',
  background: 'lightblue',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)'}}"></div>
</div>

translate 属性和绝对定位、相对定位属性加上 top、left 数值都可以使元素产生位移，但存在细微差别，表现在offsetLeft 和 offsetTop 属性。

使用绝对定位、相对定位属性加上 top、left ，会影响offsetTop和 offsetLeft 的值；

使用 translate 的offsetTop和 offsetLeft 与没有产生位移的元素没有区别，即无论translate 的值为多少，offsetTop和 offsetLeft 的值都是固定不变的。

## margin为负值

1. margin-left,margin-right为负值
- 元素本身没有宽度，会增加元素宽度

```html
<div class="container">
  <div class="inner">里层的元素设置了margin-left:-100px</div>
</div>
```

```css
.container{
  width: 500px;
  height: 200px;
  border: 1px solid grey;
  margin-left: 100px;
}

.inner{
  height: 100px;
  background: lightblue;
  margin-left: -100px;
}
```
<div style="{width: '500px',marginLeft: '100px', height: '200px', border: '1px solid grey'}}">
  <div  style="{height: '100px', background: 'lightblue', marginLeft: '-100px'}}">里层的元素设置了margin-left:-100px</div>
</div>



- 元素本身有宽度，会产生位移。补充`inner`元素宽度属性
```css
.inner{
  height: 100px;
  background: lightblue;
  margin-left: -100px;
  width: 100%;
}
```
<div style="{width: '500px',marginLeft: '100px', height: '200px', border: '1px solid grey', marginBottom: '20px'}}">
  <div style="{height: '100px',  background: 'lightblue',width: '100%', marginLeft: '-100px'}}">里层的元素设置了margin-left:-100px</div>
</div>

2. margin-top为负值，不管是否设置高度，都不会增加高度，而是会产生向上的位移

```css
.inner{
  height: 100px;
  background: lightblue;
  margin-left: -100px;
  width: 100%;
}
```
<div style="{width: '500px',marginTop: '100px', height: '200px', border: '1px solid grey', marginBottom: '20px'}}">
  <div style="{height: '100px', background: 'lightblue', width: '100%',  marginTop: '-100px'}}">里层的元素设置了margin-top:-100px</div>
</div>

3. margin-bottom为负值的时候不会位移,而是会减少自身供css读取的高度.

```html
<div class="container">
  <div class="inner">里层的元素设置了margin-bottom:-100px</div>
  <div>这里是下一个元素</div>
</div>
```

```css
.inner{
  height: 150px; // 此处height变为150px
  background: lightblue;
  margin-bottom: -100px;
  width: 100%;
}
```
<div style="{width: '500px', height: '200px', border: '1px solid grey'}}">
  <div style="{height: '150px', background: 'lightblue',width: '100%', marginBottom: '-100px'}}">里层的元素设置了margin-bottom:-100px</div>
    <div>这里是下一个元素</div>
</div>



那么，你觉得负值改为负百分比又是什么情况呢？欢迎留言

## padding 为负值

很遗憾，padding不允许指定为负，指定了也无效～





参考文档：

1. [CSS margin 百分比](https://www.runoob.com/note/30218)
2. [margin为负值详解](https://blog.csdn.net/weixin_38912024/article/details/88837111)


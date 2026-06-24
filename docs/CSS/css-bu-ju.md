# 常用布局

本篇文章仅整理常用的水平居中、垂直居中及多列布局，不求全部涉及，只考虑常用并且可以顺手拿来使用。

## 水平居中

### text-align: center;

适用于行内内容\(文字、行内元素、行内块级元素\)

```html
<div class="container">
  this is inner text
  <div classs="ele1">
    this is a block element
  </div>
  <div classs="ele2">
      this is another block element
  </div>
</div>
```

```css
.container{
  width: 300px;
  border: 1px solid grey;
  text-align: center;
}
.ele2{
  border: 1px solid grey;
  width: 200px;
}
```
**示例如下：**

<div style="{width: '300px', border: '1px solid grey', textAlign: 'center', marginBottom: '20px'}}">
  this is inner text
  <div>
    this is a block element
  </div>
  <div style="{border: '1px solid grey', width: '200px'}}">
      this is another block element
  </div>
</div>


**注意：** 该属性会被继承，影响到后代元素行内内容；

* ele1的块级元素显示文字居中是因为其宽度默认100%，与container一致，
* ele2内部文字居中是因为继承了container的属性，若想要ele2本身居中，设置 `display: inline-block` 转为行内块或设置  `margin: 0 auto` 

如果子元素宽度大于父元素宽度则无效

### margin: 0 auto;

要求目标元素**宽度固定**，并且与父元素左右`margin`有空余。

> 适用于父元素内有多个块级元素上下排列的情况

```html
<div class="container">
  this is inner text
  <div classs="ele2">
      this is another block element
  </div>
</div>
```

```css
.container{
  width: 300px;
  border: 1px solid grey;
  text-align: center;
}
.ele2{
  border: 1px solid grey;
  width: 200px;
  margin:0 auto;
}
```

<div style="{width: '300px', border: '1px solid grey', textAlign: 'center', marginBottom: '20px'}}">
  this is inner text
  <div style="{border: '1px solid grey', width: '200px', margin: '0 auto'}}">
      this is another block element
  </div>
</div>

> 如果上下的margin设置了auto，其计算值为0

### 绝对定位

> 绝对定位会导致元素不在文档流中，需要处理父元素的高度，防止高度塌陷

top、right、bottom、left的值是相对于父元素尺寸的，

#### absolute + transform

transform设置百分比参数是相对于自身尺寸的

```html
<div class="container">
   this is inner text
  <div class="ele1">
    this is a block element
  </div>
</div>
```

```css
.container{
    height: 100px;
    width: 200px;
    position: relative;
    border: 1px solid grey;
      text-align: center;
}
.ele1{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);  
    width: 100px; // 此处可以不设置，默认为父元素一半宽度
    border: 1px solid #888;
}
```
<div style="{height: '120px', width: '200px', position: 'relative', border: '1px solid grey', textAlign: 'center', marginBottom: '20px'}}">
   this is inner text
  <div style="{position: 'absolute',left: '50%',transform: 'translateX(-50%)', width: '100px',border: '1px solid #888'}}">
    this is a block element
  </div>
</div>


> ele1可以不设定width的值，此时ele1的宽度会被计算为 `父元素的一半 - 左右边框的宽度`

#### absolute + margin

margin设置百分比参数是相对于父元素的，所以，此方法需要子元素**固定宽度**，并且值设为自身宽度的一半；

html代码同上，替换 `ele1` 元素样式中 `transform: translateX(-50%)` 为 `margin-left: -50px;`

```css
.ele1{
    position: absolute;
    left: 50%;
    margin-left: -50px; // 负值，设为元素自身宽度的一半
    width: 100px; // 此处必须设置
    border: 1px solid #888;
}
```

 <div style="{height: '120px', width: '200px', position: 'relative', border: '1px solid grey', textAlign: 'center', marginBottom: '20px'}}">
   this is inner text
  <div style="{position: 'absolute',left: '50%',marginLeft: '-50px', width: '100px',border: '1px solid #888'}}">
    this is a block element
  </div>
</div>

### flex

flex默认水平轴为主轴，设置当前主轴对齐方式为居中

```html
<div class="container">
  <div class="ele1">
    this is a block element
  </div>
</div>
```

```css
.container{
    height: 200px;
    width: 220px;
    display: flex;
    justify-content: center;
    border: 1px solid grey;
}
.ele1{
    width: 100px;
    height: 100px;
    border: 1px solid #888;
}
```
**示例如下**

<div style="{height:' 200px', width: '220px', display: 'flex', justifyContent: 'center', border: '1px solid grey',}}">
  <div style="{width: '100px',height: '100px',border: '1px solid #888'}}">
    this is a block element
  </div>
</div>

 ele1未设置宽高时，子元素宽度会自动适配内容的大小，高度会填满父元素 

## 垂直居中 

### vertical-align 

- 使行内元素盒模型与其行内元素容器垂直对齐。例如，用于垂直对齐一行文本内的图片 
- 垂直对齐表格单元内容。仅用于同一行内的元素水平对齐，不用于相对父元素的垂直居中，如下面示例 

```html
<div class="container">
  <div class="ele1">this is inner text</div>
  <div class="ele">inline-block</div>
</div>
``` 

```css 
.container{ 
  width: 220px; 
  height: 50px; 
  vertical-align: middle; 
  border: 1px solid grey; 
} 
.ele1{ 
  border: 1px solid grey; 
  height :30px; 
  display: inline-block; 
} 
.ele{ 
  vertical-align: middle; 
  display: inline-block; 
}
```

**示例如下**

<div style="{width: '220px', height: '50px', verticalAlign: 'middle', border: '1px solid grey' }}">
  <div style="{border: '1px solid grey', height: '30px', display: 'inline-block'}}" >this is inner text</div>
  <div style="{verticalAlign: 'middle',  display: 'inline-block' }}">inline-block</div>
</div>


`ele1` 通过设置高度撑起了一行，`ele` 元素设置 `vertical-align: middle` 来与 `ele1` 对齐 。但是整行元素并未相对父元素对齐。

> 如果父元素未设置高度或高度与行内最高元素高度一致，则会表现为本行与父元素相对垂直居中。
>
> 也可以设置父元素 `display: table-cell`来使用 `vertical-align` 作用于表格对齐的特性，但是并不推荐此方法

### line-height

适用于 单行文本、行内元素、行内块级元素

> 多行文本建议使用span包裹成一个子元素

```html
<div class="container">
    this is inner text
</div>
```

```css
.container{
    width: 220px;
    height: 50px;
    line-height: 50px;
    border: 1px solid grey;
}
```

<div style="{width: '220px',height: '50px',lineHeight: '50px',border: '1px solid grey', marginBottom: '20px'}}">
    this is inner text
</div>

**小贴士：**

通常情况下，如果一个未设置高度的`div`内部有文字，div的高度就会是文字的高度，可能有人会跟认为是：文字撑开的！文字占据空间，自然将div撑开。但实际上，根本不是文字撑开了div的高度，而是`line-height`！

> 如果一个标签没有定义`height`属性\(包括百分比高度\)，那么其最终表现的高度一定是由`line-height`起作用

换种理解方式，如果一个有文字的div，不设置高度，并将其行高设置0，div将不会被撑开。

```html
<div class="container">
  <div class="ele">
    this is inner text
  </div>
  <div class="ele1">
    this is inner text
  </div>
</div>
```

```css
.container{
    width: 220px;
    height:100px;
    border: 1px solid grey;
}
div{
   margin-top: 20px;
   border: 1px solid grey;
}
.ele{
 line-height:0;
}
```
<div style="{width: '220px',height:'100px',border: '1px solid grey'}}">
  <div style="{marginTop: '20px',border: '1px solid grey'}}">
    this is inner text
  </div>
  <div style="{lineHeight: 0}}">
    this is inner text
  </div>
</div>

因此，对于本节最开始的栗子，去掉 `container`的 `height`属性，不会产生任何影响。可以打开控制台自己尝试一下。

### 绝对定位

> 绝对定位会导致元素不在文档流中，需要处理父元素的高度，防止高度塌陷

top、right、bottom、left的值是相对于父元素尺寸的，

#### absolute + transform

transform设置百分比参数是相对于自身尺寸的 代码同水平居中，css替换为

```css
top: 50%;
transform: translateY(-50%);
```

#### absolute + margin

同水平居中，css替换为

```css
top: 50%;
margin-top: -50px; // 负值，设为元素自身高度的一半
```

#### absolute + margin: auto

前面说过，如果上下的margin设置了auto，其计算值为0。这是子元素未设置绝对定位的情况。

将子元素设置绝对定位，top、right、bottom、left都设为0

```html
 <div class="container">
  <div class="ele">
    this is block element<
  /div>
</div>
```

```css
.container{
    width: 200px;
    height: 100px;
    position: relative;
    border: 1px solid grey;
}
.ele{
    width: 70px;
    height: 70px;
    border: 1px solid grey;
    position: absolute;;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```
 <div style="{width: '200px',height: '100px', position: 'relative',border: '1px solid grey', marginBottom: '20px'}}">
  <div style="{width: '70px', height: '70px',border: '1px solid grey',position: 'absolute',top: 0,left: 0,right: 0,bottom: 0,margin: 'auto'}}">
    this is block element
  </div>
</div>

> 子元素必须定高定宽

### flex

flex默认水平轴为主轴，设置当前纵轴对齐方式为居中

```html
<div class="container">
  <div class="ele1">
    this is a block element
  </div>
</div>
```

```css
.container{
    height: 200px;
    width: 220px;
    display: flex;
    align-items: center;
    border: 1px solid grey;
}
.ele1{
    width: 100px;
    height: 100px;
    border: 1px solid #888;
}
```

若ele1未设置宽高，子元素宽度与高度会自动适配内容的大小，可以直接打开控制台试试。

### writing-mode 

定义了文本水平或垂直排布以及在块级元素中文本的行进方向。 通过writing-mode让文字的显示变为垂直方向，可以使水平方向上的css属性，变为垂直方向上的属性 

```html 
<div class="container">
  <div class="ele1">
   block element
  </div>
</div>
```
```css 
.container{
    height: 200px;
    width: 200px;
    writing-mode: vertical-lr;
    border: 1px solid grey;
    text-align: center;
}
.ele1{
    display: inline-block;
    border: 1px solid #888;
}
```
<div style="{height: '200px',
    width: '200px',
    writingMode: 'vertical-lr',
    border: '1px solid grey',
    textAlign: 'center'}}">
  <div style="{display: 'inline-block',
    border: '1px solid #888'}}">
   block element
  </div>
</div>

## 水平垂直居中

这个就不用讲了吧

## 多列布局

### 仿window文件夹布局

适用于内部item定宽，多个item平铺于父元素。

* 内部子元素宽度固定
* 超出自动换行
* 自适应父元素宽度

```html
<div class="parent">
  <div class="container">
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
    <div class="ele">
     element
    </div>
  </div>
</div>
```

```css
.parent{
  box-sizing: border-box;
  border: 1px solid grey;
  width: 392px;
}
.container{
    box-sizing: border-box;
    display: flex;  
    flex-wrap: wrap;
    margin-right: -10px;
}
.ele{
    box-sizing: border-box;
    background: #ccc;
    width: 90px;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
    margin-bottom: 10px;
}
```
<div style="{boxSizing: 'border-box', border: '1px solid grey', width: '392px', marginBottom: '20px'}}">
  <div style="{boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', marginRight: '-10px'}}">
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
    <div style="{boxSizing: 'border-box', background: '#ccc', width: '90px', height: '40px', lineHeight: '40px', marginRight: '10px', marginBottom: '10px'}}">
     element
    </div>
  </div>
</div>

上面示例中，多个ele水平排列，每一行显示个数与parent的宽度有关，增加或减少parent的宽度，每行显示个数会自动改变。可以选中元素打开控制台试试。

**解释：**

1. container使用flex布局，设置 `flex-wrap: wrap;` 超出折行显示
2. parent宽度为 `(ele.width + ele.marginRight) * 4 - ele.marginRight` 时，每行刚好显示4个子元素。
3. 上一条的参数可以实现 `justify-content: space-between` 效果，但又不会导致某一行不够4个时的样式错位
4. container 本身不设置宽度，利用内部元素撑开，同时设置 `margin-right: -10px` 会使 container在原有宽度的基础上增加10px的大小，刚好包容每行最后一个 `ele` 的 `marginRight` 

## 小知识：

1. margin的left、right为负值时，若元素本身没有宽度，则会增加元素宽度
2. 元素本身有宽度，会产生位移
3. `margin-top` 为负值，不管是否设置高度，都不会增加高度，而是会产生向上的位移
4. `margin-bottom` 为负值的时候不会位移,而是会减少自身供css读取的高度

* 若需要两列或多列布局，可以视具体情况通过改变 `parent` 和 `ele` 的宽度来调整

## 参考文章： 
1. [CSS实现水平垂直居中的10种方式（史上最全）](https://juejin.im/post/5b9a4477f265da0ad82bf921#heading-5) 
2. [干货!各种常见布局实现+知名网站实例分析](https://juejin.im/post/5aa252ac518825558001d5de#heading-85) 
3. [css行高line-height的一些深入理解及应用](https://www.zhangxinxu.com/wordpress/2009/11/css%E8%A1%8C%E9%AB%98line-height%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8F%8A%E5%BA%94%E7%94%A8/)


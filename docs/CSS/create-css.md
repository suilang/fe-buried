# 创建css

当读到一个样式表时，浏览器会根据它来格式化 HTML 文档。

## 如何插入样式表
插入样式表的方法有三种:

- 外部样式表(External style sheet)
- 内部样式表(Internal style sheet)
- 内联样式(Inline style)

## 外部样式表
当样式需要应用于很多页面时，外部样式表将是理想的选择。在使用外部样式表的情况下，你可以通过改变一个文件来改变整个站点的外观。每个页面使用 `<link>` 标签链接到样式表。 `<link>` 标签在（文档的）头部：
```html
<head>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```

## 内部样式表
当单个文档需要特殊的样式时，就应该使用内部样式表。你可以使用 `<style>` 标签在文档头部定义内部样式表，就像这样:
```html
<head>
    <style>
        hr {color:sienna;}
        p {margin-left:20px;}
        body {background-image:url("images/back40.gif");}
    </style>
</head>
```

## 内联样式
由于要将表现和内容混杂在一起，内联样式会损失掉样式表的许多优势。

当样式仅需要在一个元素上应用一次时。可以使用内联样式。Style 属性可以包含任何 CSS 属性。本例展示如何改变段落的颜色和左外边距：

```html
<p style="color:sienna;margin-left:20px">这是一个段落。</p>
```

# 多重样式
如果某些属性在不同的样式表中被同样的选择器定义，那么属性值将从更具体的样式表中被继承过来。 

例如，外部样式表拥有针对 h3 选择器的三个属性：
```css
h3
{
    color:red;
    text-align:left;
    font-size:8pt;
}
```
而内部样式表拥有针对 h3 选择器的两个属性：
```css
h3
{
    text-align:right;
    font-size:20pt;
}
```

假如拥有内部样式表的这个页面同时与外部样式表链接，那么 h3 得到的样式是：

```css
color:red;
text-align:right;
font-size:20pt;
```

即颜色属性将被继承于外部样式表，而文字排列（text-alignment）和字体尺寸（font-size）会被内部样式表中的规则取代。

## 多重样式优先级

一般情况下，优先级如下：

（内联样式）Inline style > （内部样式）Internal style sheet 和（外部样式）External style sheet > 浏览器默认样式

**注意：** 如果外部样式放在内部样式的后面，则外部样式将覆盖内部样式（由顺序决定）

优先级是浏览器是通过判断哪些属性值与元素最相关以决定并应用到该元素上的。优先级仅由选择器组成的匹配规则决定的。


### 优先级顺序
下列是一份优先级逐级增加的选择器列表：

- 通用选择器（*）
- 元素(类型)选择器
- 类选择器
- 属性选择器
- 伪类
- ID 选择器
- 内联样式
!important 规则例外。当 !important 规则被应用在一个样式声明中时,该样式声明会覆盖CSS中任何其他的声明, 无论它处在声明列表中的哪里.

**权重计算逻辑**
[](/img/css-youxianji.png)

 1. 内联样式表的权值最高 1000；
 2. ID 选择器的权值为 100
 3. Class 类选择器的权值为 10
 4. HTML 标签选择器的权值为 1


**CSS 优先级法则：**
 A 选择器都有一个权值，权值越大越优先；
 B 当权值相等时，后出现的样式表设置要优于先出现的样式表设置；
 C 创作者的规则高于浏览者：即网页编写者设置的CSS 样式的优先权高于浏览器所设置的样式；
 D 继承的CSS 样式不如后来指定的CSS 样式；

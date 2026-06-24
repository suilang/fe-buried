# 简介

CSS (Cascading Style Sheets，层叠样式表），是一种用来为结构化文档（如 HTML 文档或 XML 应用）添加样式（字体、间距和颜色等）的计算机语言，CSS 文件扩展名为 .css。

一个简单的css语法如下：

```css
body {
    background-color:#d0e4fe;
}
h1 {
    color:orange;
    text-align:center;
}
p {
    font-family:"Times New Roman";
    font-size:20px;
}
```

推荐三本参考列表：

- [css属性参考](https://www.runoob.com/cssref/css-reference.html)
- [css选择器参考](https://www.runoob.com/cssref/css-selectors.html)
- [css单位参考](https://www.runoob.com/cssref/css-units.html)

## css语法

CSS 规则由两个主要的部分构成：选择器，以及一条或多条声明:
![](/img/css-yufa.jpeg)

每条声明由一个属性和一个值组成。SS声明总是以分号 ; 结束，声明总以大括号 {} 括起来:

为了让CSS可读性更强，你可以每行只描述一个属性:

实例
```css
p
{
    color:red;
    text-align:center;
}
```

## css注释

注释以 /* 开始, 以 */ 结束, 实例如下:

实例
```css
/*这是个注释*/
p
{
    text-align:center;
    /*这是另一个注释*/
    color:black;
    font-family:arial;
}
```

## id 和 class 选择器
如果你要在HTML元素中设置CSS样式，你需要在元素中设置"id" 和 "class"选择器。

### id 选择器
id 选择器可以为标有特定 id 的 HTML 元素指定特定的样式。

HTML元素以id属性来设置id选择器,CSS 中 id 选择器以 "#" 来定义。

以下的样式规则应用于元素属性 id="para1":

实例
```css
#para1
{
    text-align:center;
    color:red;
}
```

### class 选择器
class 选择器用于描述一组元素的样式，class 选择器有别于id选择器，class可以在多个元素中使用。

class 选择器在 HTML 中以 class 属性表示, 在 CSS 中，类选择器以一个点 . 号显示：

在以下的例子中，所有拥有 center 类的 HTML 元素均为居中。

实例
```css
.center {text-align:center;}
```

也可以指定特定的 HTML 元素使用 class。

在以下实例中, 所有的 p 元素使用 class="center" 让该元素的文本居中:

实例
```css
p.center {text-align:center;}
```

多个 class 选择器可以使用空格分开：

实例
```css
.center { text-align:center; }
.color { color:#ff0000; }
```

类名的第一个字符不能使用数字！
# html 语义化

## 什么是语义元素？

语义元素可以清楚地向浏览器和开发者描述其意义。即元素本身传达了关于标签所包含内容类型的一些信息。例如，当浏览器解析到标签时，它将该标签解释为包含这一块内容的最重要的标题。

_非语义_元素：div 和 span - 无法提供关于其内容的信息。

_语义_元素：form、table 以及 img - 清晰地定义其内容。

## 为什么要语义化？

1. 页面结构: 使页面没有css的情况下，也能够呈现出很好的内容结构
2. 有利于SEO: 爬虫依赖标签来确定关键字的权重，因此可以帮助爬虫抓取更多的有效信息 
3. 提升用户体验： 例如title、alt可以用于解释名称或者解释图片信息，以及label标签的灵活运用。 
4. 便于团队开发和维护: 语义化使得代码更具有可读性，让其他开发人员更加理解你的html结构，减少差异化。 
5. 方便其他设备解析: 如屏幕阅读器、盲人阅读器、移动设备等，以有意义的方式来渲染网页。

大约有100多个[HTML语义元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)可供选择。

常用的语义元素如下：

- h1
- h2
- h3
- p
- ul
- ol
- li
- blockquote
- a
- strong
- em
- q
- abbr
- small

## HTML5 中新的语义元素

许多网站包含了指示导航、页眉以及页脚的 HTML 代码，例如这些：`<div id="nav">` `<div class="header">` `<div id="footer">`。

如果使用 HTML4 的话，开发者会使用他们喜爱的属性名来设置页面元素的样式：

header, top, bottom, footer, menu, navigation, main, container, content, article, sidebar, topnav, ...

如此，浏览器便无法识别正确的网页内容。

HTML5 提供了定义页面不同部分的新语义元素：

| 标签 | 描述 |
| :--- | :--- |
| article | 定义文章。 |
| aside | 定义页面内容以外的内容。 |
| details | 定义用户能够查看或隐藏的额外细节。 |
| figcaption | 定义 figure 元素的标题。 |
| figure | 规定自包含内容，比如图示、图表、照片、代码清单等。 |
| footer | 定义文档或节的页脚。 |
| header | 规定文档或节的页眉。 |
| main | 规定文档的主内容。 |
| mark | 定义重要的或强调的文本。 |
| nav | 定义导航链接。 |
| section | 定义文档中的节。 |
| summary | 定义 details 元素的可见标题。 |
| time | 定义日期/时间。 |

![](/img/image%20%286%29.png)

### article 元素

article 元素定义页面独立的内容，它可以有自己的header、footer、sections等，专注于单个主题的博客文章，报纸文章或网页文章。article可以嵌套article，只要里面的article与外面的是部分与整体的关系。

#### 实例

```html
<article>
   <h1>What Does WWF Do?</h1>
   <p>WWF's mission is to stop the degradation of our planet's natural environment,
  and build a future in which humans live in harmony with nature.</p>
</article> 
```

###  section 元素

section 元素定义文档中的节。

根据 W3C 的 HTML 文献：“节（section）是有主题的内容组，通常具有标题”。

可以将网站首页划分为简介、内容、联系信息等节。

#### 实例

```html
<section>
   <h1>WWF</h1>
   <p>The World Wide Fund for Nature (WWF) is....</p>
</section> 
```



### header 元素

header 元素为文档或节规定页眉。

header 元素应该被用作介绍性内容的容器。用于定义页面的介绍展示区域，通常包括网站logo、主导航、全站链接以及搜索框。也适合对页面内部一组介绍性或导航性内容进行标记。

一个文档中可以有多个 header 元素。

下例为一篇文章定义了页眉：

#### 实例

```html
<article>
   <header>
     <h1>What Does WWF Do?</h1>
     <p>WWF's mission:</p>
   </header>
   <p>WWF's mission is to stop the degradation of our planet's natural environment,
  and build a future in which humans live in harmony with nature.</p>
</article> 
```



### footer 元素

footer 元素为文档或节规定页脚。

footer 元素应该提供有关其包含元素的信息。

页脚通常包含文档的作者、版权信息、使用条款链接、联系信息等等。

您可以在一个文档中使用多个 footer 元素。

#### 实例

```html
<footer>
   <p>Posted by: Hege Refsnes</p>
   <p>Contact information: <a href="mailto:someone@example.com">
  someone@example.com</a>.</p>
</footer> 
```



###  nav 元素

nav 元素定义导航链接集合。

nav 元素旨在定义大型的导航链接块。不过，并非文档中所有链接都应该位于 nav 元素中！

#### 实例

```html
<nav>
<a href="/html/">HTML</a> |
<a href="/css/">CSS</a> |
<a href="/js/">JavaScript</a> |
<a href="/jquery/">jQuery</a>
</nav> 
```

### aside 元素

aside 元素页面主内容之外的某些内容（比如侧栏）。

aside 内容应该与周围内容相关。

#### 实例

```html
<p>My family and I visited The Epcot center this summer.</p>

<aside>
   <h4>Epcot Center</h4>
   <p>The Epcot Center is a theme park in Disney World, Florida.</p>
</aside> 
```

###  figure 和 figcaption 元素

在书籍和报纸中，与图片搭配的标题很常见。

标题（caption）的作用是为图片添加可见的解释。

通过 HTML5，图片和标题能够被组合在 _figure_ 元素中：

#### 实例

```html
<figure>
   <img src="pic_mountain.jpg" alt="The Pulpit Rock" width="304" height="228">
   <figcaption>Fig1. - The Pulpit Pock, Norway.</figcaption>
</figure> 
```



其他语义化元素：

###  **blockquote**元素

定义块引用，浏览器会在 blockquote 元素前后添加换行，并增加外边距。cite属性可用来规定引用的来源

```html
<blockquote cite="https://en.wikiquote.org/wiki/Marie_Curie">
    Here is a long quotation here is a long quotation here is a long quotation
    here is a long quotation here is a long quotation here is a long quotation
    here is a long quotation here is a long quotation here is a long quotation.
</blockquote>
```

###  **abbr元素**

解释缩写词。使用title属性可提供全称，只在第一次出现时使用即可。

```html
The <abbr title="People's Republic of China">PRC</abbr> was founded in 1949.
```



## 参考文档

1. html语义元素：[https://www.w3school.com.cn/html/html5\_semantic\_elements.asp](https://www.w3school.com.cn/html/html5_semantic_elements.asp)

2. html语义化标签： [https://blog.csdn.net/qq\_38128179/java/article/details/80811339](https://blog.csdn.net/qq_38128179/java/article/details/80811339)


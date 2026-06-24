# position

CSS `position`属性用于指定一个元素在文档中的定位方式。`top`，`right`，`bottom` 和 `left` 属性则决定了该元素的最终位置。

例如：

```css
// child element 样式值
.element {
  position: relative;
  top: 50px;
  left: 50px;
}
```

![](/img/image%20%2810%29.png)

`relative`是position属性的六个值之一。

## 取值

### static

该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 `top`, `right`, `bottom`, `left` 和 `z-index` 属性无效。

### relative

该关键字下，元素先放置在未添加定位时的位置，再在**不改变页面布局**的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。

> position:relative 对 table-\*-group, table-row, table-column, table-cell, table-caption 元素无效。

![](/img/image%20%287%29.png)

如上图所示，虽然第一个方块因为`relative`移动了位置，但并未影响页面原本布局。

### absolute

元素会被移出正常文档流，并不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。

![](/img/image%20%289%29.png)

> 此时，蓝色框的父元素设置为 `position: relative`，用来限定子元素绝对定位的位置，`child element` 设置为 `top: 80px, left: 50px`

### fixed

元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。`fixed` 属性会创建新的层叠上下文。

> 当元素祖先的 `transform`, `perspective` 或 `filter` 属性非 `none` 时，容器由视口改为该祖先。

### sticky

元素根据正常文档流进行定位，然后相对它的_最近滚动祖先（nearest scrolling ancestor）_和 [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block) \(最近块级祖先 nearest block-level ancestor\)，包括table-related元素，基于`top`, `right`, `bottom`, 和 `left`的值进行偏移。偏移值不会影响任何其他元素的位置。该值总是创建一个新的[层叠上下文（stacking context](https://developer.mozilla.org/en/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)）。

> 注意，一个sticky元素会"固定"在离它最近的一个拥有"滚动机制"的祖先上（当该祖先的`overflow` 是 `hidden`, `scroll`, `auto`, 或 `overlay`时），即便这个祖先不是真的滚动祖先。

## sticky详解

粘性定位可以被认为是相对定位和固定定位的混合。当元素在屏幕或滚动元素显示区域时，表现为relative，就要滚出显示器屏幕的时候，表现为fixed。

可以滚动下面这个框感受下交互表现

**HTML:**

```html
<div class="container">
  <dl class="group">
    <dt class="sticky-title">A</dt>
    <dd>Andrew W.K.</dd>
    <dd>Apparat</dd>
    <dd>Arcade Fire</dd>
    <dd>At The Drive-In</dd>
    <dd>Aziz Ansari</dd>
  </dl>
  <dl class="group">
    <dt class="sticky-title">C</dt>
    <dd>Chromeo</dd>
    <dd>Common</dd>
    <dd>Converge</dd>
    <dd>Crystal Castles</dd>
    <dd>Cursive</dd>
  </dl>
  <dl class="group">
    <dt class="sticky-title">E</dt>
    <dd>Explosions In The Sky</dd>
  </dl>
  <dl class="group">
    <dt class="sticky-title">T</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
</div>
```

**CSS:**

```css
.container {
  height: 200px;
  overflow: auto;
  border: 1px solid grey;
}

.group {
  margin: 10px;
  padding: 10px 0 0 0;
  border: 1px solid blue;
}

.sticky-title {
  background: #B8C1C8;
  border-bottom: 1px solid #989EA4;
  border-top: 1px solid #717D85;
  color: #FFF;
  margin: 0;
  padding: 2px 0 0 12px;
  position: -webkit-sticky;  /* Safari 支持 */
  position: sticky;
  top: 10px;
}
```

**效果演示:**

<div style="height: 200px; overflow: auto; border: 1px solid grey;">
  <dl style="margin: 10px; padding: 10px 0 0 0; border: 1px solid blue;">
    <dt style="background: #B8C1C8; border-bottom: 1px solid #989EA4; border-top: 1px solid #717D85; color: #FFF; margin: 0; padding: 2px 0 0 12px; position: -webkit-sticky; position: sticky; top: 10px;">A</dt>
    <dd>Andrew W.K.</dd>
    <dd>Apparat</dd>
    <dd>Arcade Fire</dd>
    <dd>At The Drive-In</dd>
    <dd>Aziz Ansari</dd>
  </dl>
  <dl style="margin: 10px; padding: 15px 0 0 0; border: 1px solid grey;">
    <dt style="background: #B8C1C8; border-bottom: 1px solid #989EA4; border-top: 1px solid #717D85; color: #FFF; margin: 0; padding: 2px 0 0 12px; position: -webkit-sticky; position: sticky; top: 10px;">C</dt>
    <dd>Chromeo</dd>
    <dd>Common</dd>
    <dd>Converge</dd>
    <dd>Crystal Castles</dd>
    <dd>Cursive</dd>
  </dl>
  <dl style="margin: 10px; padding: 15px 0 0 0; border: 1px solid grey;">
    <dt style="background: #B8C1C8; border-bottom: 1px solid #989EA4; border-top: 1px solid #717D85; color: #FFF; margin: 0; padding: 2px 0 0 12px; position: -webkit-sticky; position: sticky; top: 10px;">E</dt>
    <dd>Explosions In The Sky</dd>
  </dl>
  <dl style="margin: 10px; padding: 15px 0 0 0; border: 1px solid grey;">
    <dt style="background: #B8C1C8; border-bottom: 1px solid #989EA4; border-top: 1px solid #717D85; color: #FFF; margin: 0; padding: 2px 0 0 12px; position: -webkit-sticky; position: sticky; top: 10px;">T</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
</div>

其中，标题 A、C、E、T 都使用了粘性定位，核心代码为：

```css
.sticky-title {
  position: sticky;
  top: 10px;
}
```

随着页面的滚动，当标示A距离上边缘10px距离的时候，黏在了上边缘，表现如同`position:fixed`。

> `sticky`和`fixed`定位有着根本性的不同，fixed元素直抵页面根元素，其他父元素对其left/top定位无法限制。而**sticky元素效果完全受制于父级元素**。

### 层次滚动吸顶

还是上面的栗子，我在每个标题组上加了蓝色或灰色的边框，这些边框就是标示A、C、E、T的父元素边框，可以很明显的看到，粘性定位的元素在移动到父元素的底部时，就不会再保持吸顶，而是随着父元素移出显示区域。

因此可以推出一些特性：

1. 父级元素设置和粘性定位元素等高的固定的`height`高度值，或者高度计算值和粘性定位元素高度一样时，不会产生粘滞效果。
2. 同一个父容器中的sticky元素，如果定位值相等，则会重叠；
3. 如果属于不同父元素，且这些父元素正好紧密相连，则会鸠占鹊巢，挤开原来的元素，形成依次占位的效果。

由于每一个标示组，属于不同的父元素，因此，滚动的时候，后面的标题才能把前面已经sticky定位的标题推开，形成层次滚动吸顶效果。这是sticky定位天然的特性，无需任何JavaScript的帮助。

> 如果所有的标题头都在同一个父元素下，就会导致所有sticky定位的新闻标题都会重叠在一起。

### 附上浏览器支持：

![](/img/image%20%288%29.png)

参考文档：

1. [**深入理解position sticky粘性定位的计算规则**](https://www.zhangxinxu.com/wordpress/2020/03/position-sticky-rules/)
2. [**position | MDN**](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
3. [**杀了个回马枪，还是说说position:sticky吧**](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)
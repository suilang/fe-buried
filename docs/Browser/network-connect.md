# 浏览器网络可用状态

## 概览

对于当前的应用，不管是 Web 还是 App，桌面端或移动端，离线可用的应用还是很少的。因此，网络是否可用就是一个应用是否可用的基本条件了。

本次从系统是否断网以及如何区分内外网两个场景，来进行讲解。

## 判断是否断网

### navigator.onLine

调用该属性会返回浏览器的在线状态，是一个布尔值， `true`表示在线，`false`表示离线。只要浏览器连接网络的能力发生变化，该属性就会发送更新。

在 Chrome 和 Safari 中，如果浏览器无法连接到局域网 (LAN) 或路由器，则表示浏览器处于离线状态，返回`false`，其他所有场景，都返回`true`。所以如果返回`false`，则可以断定浏览器处于离线状态。但如果返回`true`，并不意味着浏览器可以访问互联网。例如计算机运行的虚拟化软件具有始终"连接"的虚拟以太网适配器。

我们可以通过监听该属性的变化来检测网络连接状态。

```js
// 监听navigator.online属性的变化
window.addEventListener('online', function () {
  console.log('网络连接已恢复');
});
window.addEventListener('offline', function () {
  console.log('网络连接已中断');
});
```

### navigator.connection

只读属性，返回一个包含有关系统网络连接信息的 `NetworkInformation` 对象，例如用户设备的当前带宽或连接是否按流量计费。这可以用于基于用户的连接状态来选择高清晰度内容或低清晰度内容。

`online`状态下，在控制台运行`console.log(navigator.connection)`，得到返回值如下：

```js
downlink: 9.3;
effectiveType: '4g';
onchange: ƒ();
rtt: 50;
saveData: false;
```

#### effectiveType

`effectiveType`可以获取当前网络连接的类型，它的值可以为`4g`，`3g`，`2g`。对应着四种场景：`online`，`fast 3g`，`slow 3g`，和`offline`。如果此时状态为为`offline`，虽然`effectiveType`值为`4g`，但对应的`rtt`值为`0`。

#### rtt 和 downlink

这是两个反映网络状况的参数，比`effectiveType`更加具象且更能反映当前网络的真实情况。具体说明如下：

**rtt**

- 连接预估往返时间
- 单位为 ms
- 值为四舍五入到 25 毫秒的最接近倍数（就是说这个值 x%25===0）
- 值越小网速越快。类似 ping 的 time 吧
- 在 Web Worker 中可用

**downlink**

- 带宽预估值
- 单位为`Mbit/s`（注意是`Mbit`，不是`MByte`。）
- 值也是四舍五入到最接近的`25bit/秒`的倍数（就是说这个值 x%25===0，x 单位是`bit`）
- 一般越宽速度越快，也就是，信道上可以传输更多数。
- 值越大网速越快。类似高速一般比国道宽。
- 在 Web Worker 中可用

#### 监听网络变化

需要注意的是，`navigator.connection`属性的兼容性有限，不同浏览器和设备的支持情况可能不同。在使用时，建议先进行兼容性检查，并提供备用方案或适配策略，以确保在不支持该属性的情况下仍能正常运行。

```js
function handleConnectionChange() {
  var connectionType = navigator.connection.effectiveType;
  console.log('网络连接类型发生了变化：', connectionType);
}
if (navigator.connection) {
  navigator.connection.addEventListener('change', handleConnectionChange);
} else {
  console.log('浏览器不支持navigator.connection属性');
}
```

当网络连接类型发生变化时，`handleConnectionChange`函数会被调用，并获取最新的网络连接类型。你可以根据实际需求，对网络连接类型的变化做出相应的处理，例如重新加载页面、调整资源加载策略等。

#### 缺点

- **兼容性问题：**`navigator.connection`属性在不同的浏览器和设备上的支持程度有所不同。在一些旧版本的浏览器或特定的设备上，可能无法完全支持该属性，或者属性值的准确性有限。尤其需要注意的是，该方法，在 Safari 中不生效。
- **隐私问题：**获取网络连接信息涉及到用户隐私的考虑。在一些情况下，用户可能不希望网页获取他们的网络连接状态和速度等信息。因此，在使用该属性时需要注意保护用户隐私，并遵守相关的隐私政策和法规。

### 示例

下面是一个监听网络变化的示例，你可以在控制台中将网络状态变为**离线**状态，或者高速 3g，然后再切换回来，观察示例内容的变化。一定不要忘记的是，只有`navigator.onLine`的值为`false`的时候才一定表示离线，反之，不能保证当前网络是可用的。

> 偶发rtt识别错误，未查明原因。

以下是一个完整的 React 组件示例，用于实时显示网络状态：

```jsx
import React, { useState, useEffect } from 'react';

function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    return navigator.onLine;
  });

  const [connect, setConnect] = useState({
    downlink: 0,
    effectiveType: '',
    rtt: 0,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!navigator.connection) {
      return () => {};
    }
    function handleConnectionChange() {
      const connection = navigator.connection;
      setConnect({
        downlink: connection.downlink,
        effectiveType: connection.effectiveType,
        rtt: connection.rtt,
      });
    }

    navigator.connection.addEventListener('change', handleConnectionChange);
    return () => {
      navigator.connection.removeEventListener('change', handleConnectionChange);
    };
  }, []);

  return (
    <div style="{ border: '1px solid #dee0e3', padding: '24px', borderRadius: 4 }}">
      <div style="{ borderBottom: '1px solid #dee0e3', paddingBottom: 12, marginBottom: 12 }}">
        <span>当前页面的网络状态为:</span>
        <span style="{
          padding: '4px',
          borderRadius: 4,
          background: isOnline ? 'green' : 'red',
          marginLeft: 8,
          color: '#fff',
        }}">
          {isOnline ? '网络已连接' : '网络已断开'}
        </span>
      </div>
      {connect.effectiveType ? (
        <>
          <div>当前网络连接状态：</div>
          <div style="{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 24px',
            background: '#f1f1f1',
            borderRadius: 4,
            color: '#999999',
          }}">
            <span>effectiveType: {connect.effectiveType}</span>
            <span>rtt: {connect.rtt}</span>
            <span>downlink: {connect.downlink}</span>
          </div>
        </>
      ) : (
        <div>浏览器不支持navigator.connection属性</div>
      )}
    </div>
  );
}
```

## 判断网络是否可用

上一节中，我们使用浏览器自身的能力，来简单判断网络是否可用，但是对于电脑连接上了局域网，但局域网不可用的场景，并没有处理。想要解决这一场景，必须真实的发起一次网络请求，通过请求结果来判断。

以下是一个使用`navigator.onLine`和主动发起网络请求的方式，判断网络是否正常的函数的示例。这个函数首先会检查`navigator.onLine`的值，如果这个值为`false`，那么函数会立即返回网络不可用。如果这个值为`true`，函数会进一步发起一个网络请求以验证网络是否真的可用。

```js
/**
 * 使用`navigator.onLine`和主动发起网络请求的方式，判断网络是否正常
 * 这个函数首先会检查`navigator.onLine`的值，如果这个值为`false`，那么函数会立即返回网络不可用。
 * 如果这个值为`true`，函数会进一步发起一个网络请求以验证网络是否真的可用。
 * @param url
 * @returns
 */
export function checkNetworkStatus(url = 'https://www.baidu.com') {
  return new Promise<boolean>((resolve) => {
    if (!navigator.onLine) {
      resolve(false);
      return;
    }
    fetch(url, {
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
      .then(() => {
        resolve(true);
      })
      .catch((error) => resolve(false));
  });
}
```

以下是一个使用该函数的 React 组件示例：

```jsx
import React from 'react';
import { checkNetworkStatus } from './checkNetworkStatus';

function CheckNetworkStatus({ url = 'https://www.baidu.com' }) {
  const onClick = async () => {
    const rs = await checkNetworkStatus(url);
    alert(rs ? '网络连接正常' : '网络连接异常');
  };

  return (
    <div style="{
      border: '1px solid #dee0e3',
      padding: '24px',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}">
      <div
        onClick={onClick}
        style="{
          padding: '4px 12px',
          borderRadius: '8px',
          background: '#00aa00',
          color: '#fff',
          cursor: 'pointer',
        }}"
      >
        检查网络
      </div>
    </div>
  );
}
```

## 判断是否是内网

有时候我们不仅要判断网络是否联通，还要判断是否是内网，来决定是否启用或禁用某些能力。这时候，只需要在判断网络是否联通的基础上，再发起一道内网请求即可。

```js
async function checkInnerStatus() {
  const rs = await checkNetworkStatus(url);
  if (!rs) {
    message.info('网络连接异常');
    return;
  }
  const inner = await checkNetworkStatus('http://xxx.com');
  message.info(inner ? '内部网络连接正常' : '内部网络连接异常');
}
```

以下是一个完整的检查内网状态的 React 组件示例：

```jsx
import React from 'react';
import { checkNetworkStatus } from './checkNetworkStatus';

function CheckInnerStatus({ url = 'https://www.baidu.com' }) {
  const onClick = async () => {
    const rs = await checkNetworkStatus(url);
    if (!rs) {
      alert('网络连接异常');
      return;
    }
    const inner = await checkNetworkStatus('http://erp.jd.com');
    alert(inner ? '内部网络连接正常' : '内部网络连接异常');
  };

  return (
    <div style="{
      border: '1px solid #dee0e3',
      padding: '24px',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}">
      <div
        onClick={onClick}
        style="{
          padding: '4px 12px',
          borderRadius: '8px',
          background: '#00aa00',
          color: '#fff',
          cursor: 'pointer',
        }}"
      >
        检查网络
      </div>
    </div>
  );
}
```

通常，内网一般是`http`协议的，在进行判断的时候，如果当前页面是`https`，需要注意浏览器的同源限制，防止误判。

## 常态化监听

如果希望进行常态化监听网络状况，可构造组件，按如下步骤进行操作。

1. 监听`navigator.onLine`和`navigator.connection`的变更事件，回调函数使用同一函数。
2. 此时`navigator.onLine`为 false，则断定网络断开。
3. 此时`navigator.onLine`返回 true，则进行下一步验证。
4. 指定`url`发起请求，判断网络状态，并更新状态变量。
5. 依据业务不同，定时执行步骤一中的回调函数。

对应代码示例如下：

```jsx
import React, { useState, useEffect } from 'react';
import { checkNetworkStatus } from './checkNetworkStatus';

function NetworkStatusComp() {
  const [networkStatus, setNetworkStatus] = useState(() => {
    return navigator.onLine;
  });

  const handleNetworkChange = async () => {
    const rs = await checkNetworkStatus();
    setNetworkStatus(rs);
  };

  useEffect(() => {
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    // 如果navigator.connection存在，那么也监听它的change事件
    navigator.connection?.addEventListener('change', handleNetworkChange);

    // 定时检查网络状态
    const intervalId = setInterval(handleNetworkChange, 30000);
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      navigator.connection?.removeEventListener('change', handleNetworkChange);
      clearInterval(intervalId);
    };
  }, []);

  return <div> 网络状态：{networkStatus ? '在线' : '离线'} </div>;
}
```

## 参考文章

- [如何处理浏览器的断网情况？](https://juejin.cn/post/6953868764362309639?utm_source=gold_browser_extension)
- [Navigator：connection 属性](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/connection)
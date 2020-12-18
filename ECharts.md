## setOption()万能接口引发内存溢出导致浏览器崩溃

1. 问题描述

   当多次使用[setOption](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)设置图表实例的配置项以及数据，并且每次option除了data数据不一致，其它内容完全一致时（如下所示），这将出现内存溢出，严重会导致浏览器崩溃（内存占用过高）。

   ```js
   option = {
       xAxis: [
           {
               type: 'category',
               boundaryGap: true,
               data: (function (){
                   var now = new Date();
                   var res = [];
                   var len = 10;
                   while (len--) {
                       res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                       now = new Date(now - 2000);
                   }
                   return res;
               })()
           }
       ],
       yAxis: [
           {
               type: 'value',
               scale: true,
               name: '价格',
               max: 30,
               min: 0,
               boundaryGap: [0.2, 0.2]
           }
       ],
       series: [
           {
               name: '预购队列',
               type: 'bar',
               xAxisIndex: 1,
               yAxisIndex: 1,
               data: (function (){
                   var res = [];
                   var len = 10;
                   while (len--) {
                       res.push(Math.round(Math.random() * 1000));
                   }
                   return res;
               })()
           }
       ]
   };
   // 多次调用 由于xAxis、yAxis、series等option数据格式为数组，所以会多次合并数据，导致数组增大
   myChart.setOption(option);
   myChart.setOption(option);
   ...
   ```

2. 问题分析

   首先我们需要知道的是，官网是如何使用的。

   > ```js
   > (option: Object, notMerge?: boolean, lazyUpdate?: boolean)
   > or
   > (option: Object, opts?: Object)
   > ```
   >
   > 设置图表实例的配置项以及数据，所有参数和数据的修改都可以通过 [setOption](https://echarts.apache.org/zh/api.html#echartsInstance.setOption)完成，ECharts会**合并新的参数和数据，然后刷新图表**。如果开启[动画](https://echarts.apache.org/zh/option.html#option.animation)的话，ECharts 找到两组数据之间的差异然后通过合适的动画去表现数据的变化。
   >
   > **调用方式：**
   >
   > ```js
   > chart.setOption(option, notMerge, lazyUpdate);
   > ```
   >
   > 或者
   >
   > ```js
   > chart.setOption(option, {
   >     notMerge: ...,
   >     lazyUpdate: ...,
   >     silent: ...
   > });
   > ```
   >
   > **参数：**
   >
   > - option`
   >
   >   图表的配置项和数据，具体见[配置项手册](https://echarts.apache.org/zh/option.html)。
   >
   > - `notMerge`
   >
   >   可选，**是否不跟之前设置的 `option` 进行合并**，默认为 `false`，即合并。
   >
   > - `lazyUpdate`
   >
   >   可选，在设置完 `option` 后是否不立即更新图表，默认为 `false`，即立即更新。
   >
   > - `silent`
   >
   >   可选，阻止调用 `setOption` 时抛出事件，默认为 `false`，即抛出事件。

   看了官方文档所描述的信息，**重点在`setOption`会合并新的参数和数据**，这里的合并可以理解为将xAxis、yAxis、series等option数据push到之前对于数组中，导致对应属性值length增加（数组重复内容过多）， 使用不当将会导致内存占用过大。

3. 如何规避？

   仅在第一次调用setOption设置图表实列的配置项以及数据时必须传递完整的配置项；

   后续的所有更新图表实例配置项或数据操作，都应该先使用[getOption()](https://echarts.apache.org/zh/api.html#echartsInstance.getOption)接口获取图表实列的option值并修改其属性值；

   然后调用图表实列的[clear](https://echarts.apache.org/zh/api.html#echartsInstance.clear)接口清空当前实例，移除实例中所有的组件和图表；

   最后再次调用setOption设置修改后的option。

   ```js
   //更新数据
   let option = myChart.getOption();
   option.series[0].data = [];//新的值
   option.yAxis[0].data = [];//新的值
   // 清空当前实列
   myChart.clear();
   myChart.setOption(option);
   ```

## 从getOption的返回值看setOption是如何合并配置项和数据的

1. 调用[getOption](https://echarts.apache.org/zh/api.html#echartsInstance.getOption)我们将得到什么？

   >```js
   >() => Object
   >```
   >
   >**获取当前实例中维护的 `option` 对象，返回的 `option` 对象中包含了用户<u>多次 `setOption` 合并</u>得到的配置项和数据，**也记录了用户交互的状态，例如图例的开关，数据区域缩放选择的范围等等。所以从这份 `option` 可以恢复或者得到一个新的一模一样的实例。
   >
   >**注意：**<u>返回的 option 每个组件的属性值都统一是一个数组，不管 `setOption` 传进来的时候是单个组件的对象还是多个组件的数组。</u>如下形式：
   >
   >```js
   >{
   >    title: [{...}],
   >    legend: [{...}],
   >    grid: [{...}]
   >}
   >```

2. setOption是如何合并配置项与数据的？

## clear和dispose的区别与实际使用情况区分
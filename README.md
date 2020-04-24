# 地理空间综合展示系统框架

## 使用说明
### 1、打开窗口
###### type: left 左边窗口，尺寸300*900, center 居中窗口，尺寸860*1200
###### title: 标题
###### url: 路径，默认是views目录下，可以是javascript文件，需要以.js结尾，包含setup方法作为执行入口。也可以是外部链接，例如：http://www.baidu.com
###### replace: 是否替换当前窗口的页面，默认false。不替换可以回退。
###### success: 窗口打开回调
###### cancel: 窗口关闭回调
```
this.$window.open({
    type: 'left',
    title: '窗口标题',
    url: 'Test',
    replace: false,
    success: () => {},
    cancel: () => {}
})
```
### 2、地图相关操作接口
######  全局获取viewer: this.$viewer

*  事件处理：viewer.eventHandler 

```
eventType = leftClick,rightClick,mouseMove,leftDoubleClick,...

handler = {
    id,
    index,
    handler(){},
}
```
1. on(eventType, handler)
2. onLeftClick(handler)
3. onRightClick(handler)
...

*  地图相关操作接口： viewer.maps
1. setMapLayer(layerType)

*  坐标转换： viewer.coords


* 图上标绘
```
import map from "map";

const entityUtils = new map.utils.EntityUtils({
    viewer,
    config: {},
    hasEdit: true
});

//创建实体
const entity = entityUtils.create(config, noEdit?);

//开始编辑
entityUtils.startEdit();

//停止编辑
entityUtils.stopEdit();

//保存为geojson
const geojson = entityUtils.saveEdit();

//将geojson格式文件转换为实体集合,autoDraw表示自动绘制，默认不绘制
const entities = entityUtils.fromGeoJson(geojson, autoDraw);

//在地图上绘制实体
entityUtils.drawEntities(entities)

//移除所有标记
entityUtils.removeAll();

//销毁
entityUtils.destroy();

```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

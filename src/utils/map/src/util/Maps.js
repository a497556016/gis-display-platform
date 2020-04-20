import * as Cesium from "cesium";

const tianditu_key = "61aa57cb3a9ab9f54274d08b3000d5b1";

export default class Maps {
    constructor(viewer) {
        this.viewer = viewer;
    }

    setLayer(layerType){
        console.log(this.viewer.imageryLayers);
        this.viewer.imageryLayers.removeAll();
        switch (layerType) {
            default: break;
            case 'osm':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
                    url : 'https://a.tile.openstreetmap.org/'
                }));
                break;
            case 'tianditu_s':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.gov.cn/vec_w/wmts?tk="+tianditu_key,
                    layer: 'vec',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                }));
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.gov.cn/cva_w/wmts?tk="+tianditu_key,
                    layer: 'cva',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                }));
                break;
            case 'tianditu_c':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.gov.cn/img_w/wmts?tk="+tianditu_key,
                    layer: 'img',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                }));
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk="+tianditu_key,
                    layer: 'cia',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                }));
                break;
            case 'google':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                    url:"http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
                }));
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk="+tianditu_key,
                    layer: 'cia',
                    style: 'default',
                    tileMatrixSetID: 'w',
                    format: 'tiles',
                    maximumLevel: 18
                }));
                break;
            case 'gaode_c':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                    url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
                }));
                this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                    url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
                }));
                break;
            case 'gaode_s':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                    url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
                }));
                this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                    url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
                }));
                break;
            case 'baidu':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                    url: "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1"
                }))
                break;
            case 'arcGIS':
                this.viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
                }));
                break;
        }
    }
}
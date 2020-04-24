import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium";

export default class GeoJsonLayer extends BaseLayer{

    setDataSource(dataSource) {
        if(null == dataSource) {
            dataSource = new Cesium.GeoJsonDataSource(this.name);
        }
        if(null != this.dataSource && this.viewer.dataSources.contains(this.dataSource)) {
            this.destroy();
        }
        this.dataSource = dataSource;
        return this.viewer.dataSources.add(this.dataSource);
    }

    showResult(geoJsonData) {
        const style = this.options ? this.options.style : {};
        this.dataSource.load(geoJsonData, style).then(dataSource => {
            this.setStyle();
        });
    }

    setStyle(){

        this.dataSource.entities.values.forEach(entity => {
            const { properties, billboard, polyline, polygon } = entity;

            entity.tooltip = properties.tooltip;
            entity.description = properties.description;

            const style = properties.style._value;

            console.log('set style ', entity);
            if(billboard) {
                billboard.image = style.image;
                billboard.heightReference = style.clampToGround?1:0
            }
            if(polyline) {
                polyline.zIndex = style.zIndex;
                polyline.width = style.width;
                polyline.material.color = style.color;
                polyline.clampToGround = style.clampToGround;
            }
            if(polygon) {
                polygon.fill = style.fill === undefined ? true:style.fill;
                if(style.color) {
                    const { red, green, blue, alpha } = style.color;
                    polygon.material.color = new Cesium.Color(red, green, blue, alpha);
                }
                polygon.outline = style.outline;
                polygon.outlineWidth = style.outlineWidth;
                if(style.outlineColor) {
                    const { red, green, blue, alpha } = style.outlineColor;
                    polygon.outlineColor = new Cesium.Color(red, green, blue, alpha);
                }

                polygon.heightReference = style.clampToGround?1:0;
                polygon.zIndex = style.zIndex||0;

                polygon.show = true;
            }
            // entity.billboard.image = properties.image.getValue();
        })

        console.log('set style end')
    }
}
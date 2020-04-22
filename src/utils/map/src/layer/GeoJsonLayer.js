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
            const { properties, billboard, polyline } = entity;

            entity.tooltip = properties.tooltip;
            entity.description = properties.description;

            const style = properties.style._value;
            if(billboard) {
                billboard.image = style.image;
                billboard.clampToGround = style.clampToGround;
            }
            if(polyline) {
                console.log(polyline, properties);
                polyline.zIndex = style.zIndex;
                polyline.width = style.width;
                polyline.material.color =style.color;
                polyline.clampToGround = style.clampToGround;
            }
            // entity.billboard.image = properties.image.getValue();
        })

        console.log('set style')
    }
}
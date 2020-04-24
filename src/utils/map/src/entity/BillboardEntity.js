import BaseEntity from "./BaseEntity";
import * as Cesium from "cesium";

export default class BillboardEntity extends BaseEntity{
    constructor(viewer, config, dataSource){
        super(viewer, config, dataSource);
    }

    buildEntityOption() {
        const entity = {
            billboard: {
                // show: true,
                rotation: 0,
                color: Cesium.Color.WHITE,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: this.config.style.clampToGround?Cesium.HeightReference.CLAMP_TO_GROUND:Cesium.HeightReference.NONE, //RELATIVE_TO_GROUND
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.8, 6.0e4, 0.3),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e6),
            }
        }

        if(this.config.style.color && typeof this.config.style.color === 'string') {
            this.config.style.color = Cesium.Color.fromCssColorString(this.config.style.color);
        }
        Object.assign(entity.billboard, this.config.style);

        if(this.config.position && this.config.position.length >= 2) {
            if(this.config.position.length === 2) {
                this.config.position[2] = 0;
            }
            entity.position = Cesium.Cartesian3.fromDegrees(this.config.position[0], this.config.position[1], this.config.position[2]);
        }

        return entity;
    }

    onEdit() {
        const that = this;
        const eventId = this.viewer.eventHandler.onLeftClick({
            handler(pick, viewer, e) {
                console.log(e);
                const {position} = e;
                const screenPosition = new Cesium.Cartesian2(position.x, position.y);
                that.entityOption.position = viewer.scene.globe.pick(viewer.camera.getPickRay(screenPosition), viewer.scene);

                console.log(that.entityOption);
                that.dataSource.entities.add(that.entityOption);
            }
        });
        return eventId;
    }

    toGeoJson() {

    }
}
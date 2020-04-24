import BaseEntity from "./BaseEntity";
import * as Cesium from "cesium";

export default class PolygonEntity extends BaseEntity{
    buildEntityOption() {
        const { style } = this.config;
        if(style.color && typeof style.color === 'string') {
            style.color = Cesium.Color.fromCssColorString(style.color);
        }
        if(style.outlineColor) {
            if(typeof style.outlineColor === 'string') {
                style.outlineColor = Cesium.Color.fromCssColorString(style.outlineColor);
            }else if(typeof style.outlineColor === 'object') {
                style.outlineColor = new Cesium.Color(style.outlineColor.red, style.outlineColor.green, style.outlineColor.blue, style.outlineColor.alpha);
            }
        }
        const entity = {
            polygon: {
                // extrudedHeight: 0,
                // height: 0,
                heightReference: style.clampToGround?Cesium.HeightReference.CLAMP_TO_GROUND:Cesium.HeightReference.NONE,
                fill: true,
                material: style.color,
                outline: style.outline||false,
                outlineColor: style.outlineColor||Cesium.Color.BLACK,
                outlineWidth: style.outlineWidth||1.0,
                zIndex: style.zIndex||0,
            }
        };

        if(style.positions && style.positions.length) {
            let wgs84_positions = style.positions[0];

            if(wgs84_positions.length > 2 && Array.isArray(wgs84_positions[0])) {
                const positions = [];
                wgs84_positions.forEach(position => {
                    position.forEach(p => positions.push(p));
                });
                if(wgs84_positions[0].length === 2) {
                    entity.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(positions);
                }else if(wgs84_positions[0].length === 3) {
                    entity.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
                    // entity.polygon.perPositionHeight = true;
                    // entity.polygon.extrudedHeight = 0;
                }else {
                    throw new Error('bad positions!');
                }
            }
        }

        return entity;
    }

    onEdit() {
        const that = this;
        let clickPositions = [];
        let movePosition, positions = [];
        let polygon;
        this.eventId = this.viewer.eventHandler.onLeftClick({
            handler(pick, viewer, e){
                const { position } = e;
                const clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(position), viewer.scene);
                const coord = viewer.coords.worldPositionToWgs84(clickPosition);
                clickPositions = clickPositions.concat([coord.lng, coord.lat]);
            }
        });
        this.moveEventId = this.viewer.eventHandler.onMouseMove({
            handler(pick, viewer, e){
                const { startPosition, endPosition } = e;
                movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(endPosition), viewer.scene);
                const coord = viewer.coords.worldPositionToWgs84(movePosition);
                movePosition = [coord.lng, coord.lat];

                if(clickPositions.length === 4 && !polygon) {
                    that.entityOption.polygon.hierarchy = new Cesium.CallbackProperty(function () {
                        return new Cesium.PolygonHierarchy(positions);
                    }, false);
                    polygon = that.dataSource.entities.add(that.entityOption);
                    console.log(polygon);
                }else if(polygon) {
                    positions = Cesium.Cartesian3.fromDegreesArray(clickPositions.concat(movePosition));
                }

            }
        })
        this.endEventId = this.viewer.eventHandler.onRightClick({
            handler(pick, viewer, e){
                that.stopEdit();
            }
        })
    }

    stopEdit() {
        super.stopEdit();
        this.viewer.eventHandler.removeById(this.moveEventId);
        this.viewer.eventHandler.removeById(this.endEventId);
    }
}
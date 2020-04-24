import BaseEntity from "./BaseEntity";
import * as Cesium from "cesium";

export default class PolylineEntity extends BaseEntity{
    buildEntityOption() {
        const {style} = this.config;
        if(style.color && typeof style.color === 'string') {
            style.color = Cesium.Color.fromCssColorString(style.color);
        }

        let material = style.color;
        if(style.outlineWidth){
            material = new Cesium.PolylineOutlineMaterialProperty({
                color: style.color,
                outlineWidth: style.outlineWidth,
                outlineColor: new Cesium.Color.fromCssColorString(style.outlineColor||"#fff").withAlpha(1)
            })
        }else if(style.glowPower){
            material = new Cesium.PolylineGlowMaterialProperty({
                glowPower: style.glowPower,
                color: style.color,
            })
        }

        const entity = {
            polyline: {
                // positions: Cesium.Cartesian3.fromDegreesArrayHeights(style.positions),
                width: style.width||10,
                clampToGround: style.clampToGround||false,
                material: material,
                // distanceDisplayCondition: distanceDisplayCondition,
                // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1, 7e3, 0.3),
                zIndex: 1000
            }
        };

        if(style.positions && style.positions.length) {
            if(style.positions[0] instanceof Cesium.Cartesian3) {
                entity.polyline.positions = style.positions;
            }else {
                entity.polyline.positions = style.positions.map(position => {
                    return Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
                });
            }
        }else {
            entity.polyline.positions = [];
        }

        return entity;
    }

    onEdit() {
        const that = this;
        const linePositions = [];
        let positions = [], movePosition;
        const polyline = this.dataSource.entities.add(this.entityOption);
        polyline.polyline.positions = new Cesium.CallbackProperty(() => {
            return positions;
        }, false);

        const eventId = this.viewer.eventHandler.onLeftClick({
            handler(pick, viewer, e){
                const { position } = e;
                const clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(position), viewer.scene);

                linePositions.push(clickPosition);
            }
        });
        this.moveEventId = this.viewer.eventHandler.onMouseMove({
            handler(pick, viewer, e){
                const { endPosition } = e;
                movePosition = viewer.scene.globe.pick(viewer.camera.getPickRay(endPosition), viewer.scene);

                if(linePositions.length > 0) {
                    positions = linePositions.concat(movePosition);
                }
            }
        })
        this.endEventId = this.viewer.eventHandler.onRightClick({
            handler(pick, viewer, e){
                that.stopEdit();
            }
        });

        return eventId;
    }

    stopEdit() {
        super.stopEdit();
        this.viewer.eventHandler.removeById(this.moveEventId);
        this.viewer.eventHandler.removeById(this.endEventId);
    }
}
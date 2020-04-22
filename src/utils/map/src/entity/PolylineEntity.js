import BaseEntity from "./BaseEntity";
import * as Cesium from "cesium";

export default class PolylineEntity extends BaseEntity{
    createEntity() {
        const {style} = this.config;
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
                entity.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights(style.positions);
            }
        }else {
            entity.polyline.positions = [];
        }

        return entity;
    }

    onEdit() {
        const that = this;
        const positions = [];
        const polyline = this.dataSource.entities.add(this.entity);
        polyline.polyline.positions = new Cesium.CallbackProperty(() => {
            return positions;
        }, false);

        const eventId = this.viewer.eventHandler.onLeftClick({
            handler(pick, viewer, e){
                const { position } = e;
                const screenPosition = new Cesium.Cartesian2(position.x, position.y);
                const clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(screenPosition), viewer.scene);

                positions.push(clickPosition);
            }
        });
        const endEventId = this.viewer.eventHandler.onRightClick({
            handler(pick, viewer, e){

                viewer.eventHandler.removeById(endEventId);
                that.stopEdit();
            }
        });

        return eventId;
    }
}
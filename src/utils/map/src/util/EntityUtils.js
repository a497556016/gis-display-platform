import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import Coords from "./Coords";

export default class EntityUtils {
    config;
    viewer;
    dataSource;
    hasEdit = false;
    editType;
    coords;

    constructor({viewer, config, hasEdit}) {
        this.viewer = viewer;
        this.config = config;
        this.hasEdit = hasEdit;
        this.coords = new Coords(viewer);

        if(config) {
            this.create();
        }
    }

    create(config){
        config = config || this.config;

        const { type, id, name, description, tooltip, onClick, style } = config;

        let entity;
        switch (type) {
            default: break;
            case 'billboard':
                entity = this.createBillboard(style, config.position);
                break;
            case 'polyline':
                entity = this.createPolyline(style);
                break;
            case 'point':
                break;
        }
        if(entity) {
            if(id) {
                entity.id = id;
            }
            if(name) {
                entity.name = name;
            }
            if(description) {
                entity.description = description;
            }
            entity.tooltip = tooltip;
            entity.onClick = onClick;

            // entity = new Cesium.Entity(entity);

            if(this.hasEdit) {
                this.startEdit(type, entity);
            }
        }

        return entity;
    }

    startEdit(type, entity){
        const that = this;

        this.stopEdit();

        if(null == this.dataSource) {
            this.dataSource = new Cesium.CustomDataSource();
            this.viewer.dataSources.add(this.dataSource);
        }

        const eventHandler = this.viewer.eventHandler;

        if(null == this.eventId) {
            this.editType = type;

            if(type === 'billboard') {
                this.eventId = eventHandler.onLeftClick({
                    handler(pick, viewer, e) {
                        console.log(e);
                        const {position} = e;
                        const screenPosition = new Cesium.Cartesian2(position.x, position.y);
                        entity.position = viewer.scene.globe.pick(viewer.camera.getPickRay(screenPosition), viewer.scene);

                        console.log(entity);
                        that.dataSource.entities.add(entity);
                    }
                });
            }
            if(type === 'polyline') {
                const positions = [];
                const polyline = this.dataSource.entities.add(entity);
                polyline.polyline.positions = new Cesium.CallbackProperty(() => {
                    return positions;
                }, false);

                this.eventId = eventHandler.onLeftClick({
                    handler(pick, viewer, e){
                        const { position } = e;
                        const screenPosition = new Cesium.Cartesian2(position.x, position.y);
                        const clickPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(screenPosition), viewer.scene);

                        positions.push(clickPosition);
                    }
                });
                const endEventId = eventHandler.onRightClick({
                    handler(pick, viewer, e){

                        eventHandler.removeById(endEventId);
                        that.stopEdit();
                    }
                });
            }
        }
    }

    stopEdit(){
        if(null != this.viewer.eventHandler && null != this.eventId) {
            this.viewer.eventHandler.removeById(this.eventId);
            this.eventId = null;
        }
    }

    /**
     * 保存编辑数据geojson
     */
    saveEdit(){
        if(!this.dataSource) {
            return;
        }
        const features = [];
        this.dataSource.entities.values.forEach(entity => {
            if(entity.billboard) {
                const {lng, lat, height} = this.coords.worldPositionToWgs84(entity.position._value);
                features.push(turf.point([lng, lat, height]))
            }
            if(entity.polyline) {
                const positions = entity.polyline.positions.getValue(new Date().getTime());
                if(positions) {
                    const points = positions.map(position => {
                        const {lng, lat, height} = this.coords.worldPositionToWgs84(position);
                        return [lng, lat, height];
                    });
                    features.push(turf.lineString(points));
                }
            }
        });
        const collections = turf.featureCollection(features);
        console.log('save edit', collections);
    }

    destroy(){
        this.stopEdit();

        if(this.dataSource) {
            this.viewer.dataSources.remove(this.dataSource);
        }
    }

    removeAll(){
        if(this.dataSource) {
            this.dataSource.entities.removeAll();
        }
    }

    createBillboard(style, position){
        const entity = {
            billboard: {
                // show: true,
                rotation: 0,
                color: Cesium.Color.WHITE,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //RELATIVE_TO_GROUND
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.8, 6.0e4, 0.3),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e6),
            }
        }

        Object.assign(entity.billboard, style);

        if(position && position.length >= 2) {
            if(position.length === 2) {
                position[2] = 0;
            }
            entity.position = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
        }

        return entity;
    }

    createPolyline(style) {
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



}
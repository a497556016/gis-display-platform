import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import commonUtils from "./commonUtils";
import BillboardEntity from "../entity/BillboardEntity";
import PolylineEntity from "../entity/PolylineEntity";
import PolygonEntity from "../entity/PolygonEntity";

export default class EntityUtils {
    config;
    viewer;
    dataSource;
    hasEdit = false;
    editEntity;

    constructor({viewer, config, hasEdit}) {
        this.viewer = viewer;
        this.config = config;
        this.hasEdit = hasEdit;

        this.dataSource = new Cesium.CustomDataSource("editor");
        this.viewer.dataSources.add(this.dataSource);
        if(config) {
            this.create();
        }
    }

    create(config, noEdit){
        config = config || this.config;

        const { type } = config;

        let entity;
        switch (type) {
            default: break;
            case 'billboard':
                entity = new BillboardEntity(this.viewer, config, this.dataSource);
                break;
            case 'polyline':
                entity = new PolylineEntity(this.viewer, config, this.dataSource);
                break;
            case 'point':
                break;
            case 'polygon':
                entity = new PolygonEntity(this.viewer, config, this.dataSource);
                break;
        }

        if(entity) {
            if (this.hasEdit && !noEdit) {
                this.stopEdit();

                this.editEntity = entity;
                this.editEntity.startEdit();
            }

            return entity.getEntity();
        }else {
            return null;
        }
    }

    stopEdit(){
        if(this.editEntity) {
            this.editEntity.stopEdit();
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
            const tooltip = entity.tooltip?entity.tooltip._value:undefined;
            const description = entity.description?entity.description._value:undefined;
            if(entity.billboard) {
                const {lng, lat, height} = this.viewer.coords.worldPositionToWgs84(entity.position._value);
                const { scale, color, image, heightReference } = entity.billboard;
                features.push(turf.point([lng, lat, height], {
                    tooltip,
                    description,
                    style: {
                        color: color?color._value.toCssColorString():undefined,
                        image: image?image._value:undefined,
                        scale: scale?scale._value:undefined,
                        clampToGround: heightReference._value === Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                }))
            }
            if(entity.polyline) {
                const positions = entity.polyline.positions.getValue(new Date().getTime());
                if(positions) {
                    const points = positions.map(position => {
                        const {lng, lat, height} = this.viewer.coords.worldPositionToWgs84(position);
                        return [lng, lat, height];
                    });
                    const { width, material, clampToGround } = entity.polyline;
                    features.push(turf.lineString(points, {
                        tooltip,
                        description,
                        style: {
                            width: width?width._value:undefined,
                            color: material&&material.color?material.color._value.toCssColorString():undefined,
                            clampToGround: clampToGround?clampToGround._value:false,
                        }
                    }));
                }
            }
            if(entity.polygon) {
                const { positions, holes } = entity.polygon.hierarchy.getValue(new Date().getTime());
                console.log(positions);
                const points = positions.map(position => {
                    const {lng, lat, height} = this.viewer.coords.worldPositionToWgs84(position);
                    return [lng, lat, height];
                });
                let { material, outline, outlineColor, outlineWidth, heightReference} = entity.polygon;

                if(outlineColor && outlineColor._value instanceof Cesium.Color) {
                    outlineColor = outlineColor._value.toCssColorString();
                }
                const lineString = turf.lineString(points, {
                    tooltip,
                    description,
                    style: {
                        color: material&&material.color?material.color._value.toCssColorString():undefined,
                        clampToGround: heightReference._value === Cesium.HeightReference.CLAMP_TO_GROUND,
                        outline: outline?outline._value:undefined,
                        outlineColor: outlineColor,
                        outlineWidth: outlineWidth?outlineWidth._value:undefined,
                    }
                });
                features.push(turf.lineToPolygon(lineString));
            }
        });
        const collections = turf.featureCollection(features);
        const content = JSON.stringify(collections);
        console.log('save edit', collections, content);
        commonUtils.files.saveAs(content, Cesium.createGuid()+'.json');
    }

    fromGeoJson(geoJson){
        if(typeof geoJson === 'object' && geoJson.type === 'FeatureCollection' && geoJson.features.length) {
            const entities = geoJson.features.map(({ type, properties, geometry }) => {
                if(type === 'Feature') {
                    const { type, coordinates } = geometry;
                    let entity = null;
                    switch (type) {
                        default: break;
                        case 'Point':
                            entity = this.create({
                                type: 'billboard',
                                ...properties,
                                position: coordinates
                            }, true);
                            break;
                        case 'LineString':
                            properties.style.positions = coordinates;
                            entity = this.create({
                                type: 'polyline',
                                ...properties
                            }, true);
                            break;
                        case 'Polygon':
                            properties.style.positions = coordinates;
                            entity = this.create({
                                type: 'polygon',
                                ...properties
                            }, true);
                            break;
                    }

                    return entity;
                }
                return null;
            }).filter(entity => entity !== null);
            return entities;
        }
        return [];
    }

    drawEntities(entities){
        if(entities && Array.isArray(entities)) {
            entities.forEach(entity => {
                this.dataSource.entities.add(entity);
            })
        }
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

}
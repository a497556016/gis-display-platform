import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import Coords from "./Coords";
import BillboardEntity from "../entity/BillboardEntity";
import PolylineEntity from "../entity/PolylineEntity";

export default class EntityUtils {
    config;
    viewer;
    dataSource;
    hasEdit = false;
    coords;
    editEntity;

    constructor({viewer, config, hasEdit}) {
        this.viewer = viewer;
        this.config = config;
        this.hasEdit = hasEdit;
        this.coords = new Coords(viewer);

        this.dataSource = new Cesium.CustomDataSource("editor");
        this.viewer.dataSources.add(this.dataSource);
        if(config) {
            this.create();
        }
    }

    create(config){
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
        }

        if(entity) {
            if (this.hasEdit) {
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
                const {lng, lat, height} = this.coords.worldPositionToWgs84(entity.position._value);
                const { scale, color, image, heightReference } = entity.billboard;
                features.push(turf.point([lng, lat, height], {
                    tooltip,
                    description,
                    style: {
                        color: color?color._value:undefined,
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
                        const {lng, lat, height} = this.coords.worldPositionToWgs84(position);
                        return [lng, lat, height];
                    });
                    const { width, material, clampToGround } = entity.polyline;
                    features.push(turf.lineString(points, {
                        tooltip,
                        description,
                        style: {
                            width: width?width._value:undefined,
                            color: material&&material.color?material.color._value:undefined,
                            clampToGround: clampToGround?clampToGround._value:false,
                        }
                    }));
                }
            }
        });
        const collections = turf.featureCollection(features);
        console.log('save edit', collections, JSON.stringify(collections));
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
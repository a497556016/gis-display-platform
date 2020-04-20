import map from "../map";
import * as Cesium from "cesium";
import issueData from "./data/issues";

export default class CustomLayer extends map.layers.JsonDataLayer{

    constructor(viewer, name, options) {
        super(viewer, name, options);

    }

    // loadData(){
    //     return new Promise(resolve => {
    //         resolve(issueData);
    //     })
    // }

    addMarker({id, lng, lat, height, image, flyTo, tooltip, onClick}){
        const entity = {
            id,
            position: [lng, lat, height],
            type: 'billboard',
            tooltip,
            onClick,
            style: {
                image,
                scale: 1,
                width: 64,
                height: 64
            }
        };
        this.addData([entity]);
        if(flyTo) {
            this.locationTo(lng, lat, 1000);
        }
        return entity;
    }

    addMarkers(arrayMarker, flyTo){
        const entities = [];
        arrayMarker.forEach(({id, lng, lat, height, image, tooltip, onClick}) => {
            const entity = {
                id,
                type: 'billboard',
                position: [lng, lat, height],
                tooltip,
                onClick,
                style: {
                    image,
                    scale: 1.0,
                    clampToGround: true,
                    // width: 64,
                    // height: 64
                }
            };
            entities.push(entity);
        });
        console.log(2222);
        this.addData(entities);
        if(flyTo) {
            this.centerAt();
        }
    }

    locationTo(lng, lat, height) {
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
            duration: 3
        });
    }

    removeById(id){
        this.dataSource.entities.removeById(id);
    }

    removeAll(){
        this.destroy();
    }
}
import BaseLayer from "./BaseLayer";
import * as Cesium from "cesium";
import EntityUtils from "../util/EntityUtils";

export default class JsonDataLayer extends BaseLayer {

    constructor(viewer, name, options){
        super(viewer, name, options);
        this.entityUtils = new EntityUtils({
            viewer: this.viewer,
            hasEdit: false
        });
    }

    mapData(data) {
        return data.map(config => {
            return this.entityUtils.create(config);
        });
    }

}
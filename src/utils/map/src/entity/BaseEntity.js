import * as Cesium from "cesium";

export default class BaseEntity {
    viewer;
    dataSource;
    //通用实体配置
    config = {
        id: undefined,
        name: undefined,
        description: undefined,
        tooltip: undefined,
        onClick: undefined,
        style: {}
    };
    //实体信息
    entity;

    constructor(viewer, config, dataSource){
        this.viewer = viewer;
        Object.assign(this.config, config);
        this.dataSource = dataSource;

        const entity = this.createEntity();

        if(!entity) {
            throw new Error('no entity created!')
        }else {
            this.entity = entity;

            this._setConfig();
        }
    }

    _setConfig(){
        const { id, tooltip, name, description, onClick } = this.config;
        this.entity.id = id;
        this.entity.tooltip = tooltip;
        if(name) {
            this.entity.name = name;
        }
        this.entity.description = description;
        this.entity.onClick = onClick;
    }

    startEdit(){
        if(null == this.dataSource) {
            this.dataSource = new Cesium.CustomDataSource();
            this.viewer.dataSources.add(this.dataSource);
        }

        this.stopEdit();

        if(null == this.eventId) {
            this.eventId = this.onEdit();
        }
    }

    onEdit(){

    }

    stopEdit(){
        if(null != this.viewer && null != this.eventId) {
            this.viewer.eventHandler.removeById(this.eventId);
            this.eventId = null;
        }
    }

    createEntity(){

    }

    getEntity(){
        return this.entity;
    }
}
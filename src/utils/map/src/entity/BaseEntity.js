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
    entityOption;

    constructor(viewer, config, dataSource){
        this.viewer = viewer;
        this.dataSource = dataSource;

        this.setConfig(config);
    }

    setConfig(config){
        Object.assign(this.config, config);
        this._initEntityOption();
    }

    _initEntityOption(){
        const entity = this.buildEntityOption();

        if(!entity) {
            throw new Error('no entity created!')
        }else {
            console.log('entity is ready!', entity);
            this.entityOption = entity;

            const { id, tooltip, name, description, onClick } = this.config;
            this.entityOption.id = id;
            this.entityOption.tooltip = tooltip;
            if(name) {
                this.entityOption.name = name;
            }
            this.entityOption.description = description;
            this.entityOption.onClick = onClick;
        }
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

    buildEntityOption(){

    }

    getEntity(){
        return new Cesium.Entity(this.entityOption);
    }


}
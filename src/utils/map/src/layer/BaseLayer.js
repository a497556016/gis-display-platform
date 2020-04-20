import * as Cesium from "cesium";

export default class BaseLayer {
    name;
    viewer;
    options;
    dataSource;

    constructor(viewer, name, options){
        this.viewer = viewer;
        this.name = name;
        this.options = options;


        Cesium.when(this.init()).then(() => {
            const {flyTo} = this.options;
            console.log('fly to: ', flyTo)
            if(flyTo) {
                this.centerAt();
            }
        });
    }

    /**
     * 初始化
     * @returns {Promise<DataSource>}
     */
    init(){
        return this.setDataSource().then(() => {

            return Cesium.when(this.loadData()).then(data => {
                this.showResult(data);
            });
        });
    }

    /**
     * 设置数据源
     * @param dataSource
     * @returns {Promise<DataSource>}
     */
    setDataSource(dataSource){
        if(!dataSource) {
            dataSource = new Cesium.CustomDataSource(this.name);
        }
        if(this.checkDataSource()) {
            this.destroy();
        }
        this.dataSource = dataSource;
        return this.viewer.dataSources.add(this.dataSource);
    }

    checkDataSource(){
        return this.dataSource && this.viewer.dataSources.contains(this.dataSource);
    }

    /**
     * 数据格式化，可覆盖重写
     * @param data
     * @returns {*}
     */
    mapData(data){
        return data;
    }

    /**
     * 加载数据到地图上显示
     * @param data
     */
    showResult(data) {
        const that = this;

        function addEntities(){
            data.forEach(entity => {
                const e = that.dataSource.entities.add(entity);
                console.log(e.billboard)
            });

        }

        data = this.mapData(data);

        if(!this.checkDataSource()) {
            this.setDataSource().then(() => {
                addEntities();
            });
        }else {
            addEntities();
        }
    }


    /**
     * 加载数据
     */
    loadData(){
        return new Promise(resolve => {
            resolve([]);
        });
    }

    /**
     * 重新加载数据
     */
    reload(){
        this.destroy();
        this.init();
    }

    /**
     * 设置数据
     * @param data
     */
    setData(data){
        this.destroy();
        this.showResult(data);
    }

    /**
     * 添加数据
     * @param data
     */
    addData(data) {
        this.showResult(data);
    }

    /**
     * 显示或者隐藏
     * @param visible
     */
    setVisible(visible) {
        this.dataSource.show = visible;
    }

    /**
     * 定位
     * @param duration
     */
    centerAt(duration) {
        this.viewer.flyTo(this.dataSource, {
            duration: duration || 3,
            maximumHeight: 1000
        });
    }

    /**
     * 销毁数据源
     */
    destroy(){
        this.viewer.dataSources.remove(this.dataSource);
        this.dataSource = null;
    }

}
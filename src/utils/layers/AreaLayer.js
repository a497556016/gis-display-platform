import map from "../map";
import * as Cesium from "cesium";

export default class AreaLayer extends map.layers.JsonDataLayer{
    loadData(){
        const data = [{
            type: 'polygon',
            tooltip: '危险区域',
            style: {
                positions: [[114.39392568747081,22.71894583432322],[114.38389680685637,22.709356628405118],[114.38615635482316,22.708710164058907]],
                color: Cesium.Color.fromCssColorString('#ff00ff'),
                outline: true,
                outlineWidth: 10,
                outlineColor: Cesium.Color.WHITE,
                clampToGround: true
            }
        }];
        return new Promise(resolve => {
            resolve(data);
        })
    }
}
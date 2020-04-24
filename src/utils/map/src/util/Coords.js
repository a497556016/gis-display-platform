import * as Cesium from "cesium";

export default class Coords {
    constructor(viewer){
        this.viewer = viewer;
    }

    wgs84ToWorldPosition({lng, lat, height}){
        return Cesium.Cartesian3.fromDegrees(lng, lat, height);
    }

    worldPositionToWgs84(cartesian3){
        // const ellipsoid = viewer.scene.globe.ellipsoid;
        // const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const height = cartographic.height;

        return {lng, lat, height};
    }

    screenPositionToWorldPosition(cartesian2){
        const cartesian3 = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(cartesian2), this.viewer.scene);
        return cartesian3;
    }

    wgs84ToScreenPosition({lng, lat, height}){
        const cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        const cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, cartesian3);
        return cartesian2;
    }
}
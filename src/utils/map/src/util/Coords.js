import {Cartesian3, Math, Cartographic, SceneTransforms} from "cesium";

export default class Coords {
    constructor(viewer) {
        this.viewer = viewer;
    }

    wgs84ToWorldPosition({lng, lat, height}){
        return Cartesian3.fromDegrees(lng, lat, height);
    }

    worldPositionToWgs84(cartesian3){
        // const ellipsoid = viewer.scene.globe.ellipsoid;
        // const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        const cartographic = Cartographic.fromCartesian(cartesian3);
        const lat = Math.toDegrees(cartographic.latitude);
        const lng = Math.toDegrees(cartographic.longitude);
        const height = cartographic.height;

        return {lng, lat, height};
    }

    screenPositionToWorldPosition(cartesian2){
        const cartesian3 = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(cartesian2), this.viewer.scene);
        return cartesian3;
    }

    wgs84ToScreenPosition({lng, lat, height}){
        const cartesian3 = Cartesian3.fromDegrees(lng, lat, height);
        const cartesian2 = SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, cartesian3);
        return cartesian2;
    }
}
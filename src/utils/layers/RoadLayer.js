import * as turf from "@turf/turf"
import map from "../map";
import * as Cesium from "cesium";

export default class RoadLayer extends map.layers.GeoJsonLayer{
    loadData() {
        return new Promise(resolve => {
            const lineFeature = turf.lineString([[114.411544945308, 22.696449610285384], [114.40279021508336, 22.69613287339249], [114.40069594680844, 22.695467724017092], [114.39867034203652, 22.695467724017092], [114.39149489726566, 22.69442248103357], [114.38068023051764, 22.69537270137845], [114.37913527747018, 22.69502428850052], [114.37391677167632, 22.69261704518867]],
                {
                    width: 10,
                    color: Cesium.Color.fromCssColorString('#0b0fff'),
                    clampToGround: true,
                    tooltip: '道路AA'
                });
            //[[113.91859889030457, 22.52692752228728], [113.91801953315732, 22.524291378255494], [113.91780495643616, 22.52326069172308], [113.91746163368228, 22.521972322745285], [113.91726851463318, 22.521139831785973], [113.91688227653503, 22.52074340575679], [113.9159381389618, 22.519851443032948], [113.91467213630676, 22.518563042267687], [113.91437172889712, 22.518265717308324]]
            const geoJsonData = turf.featureCollection([lineFeature]);
            resolve(geoJsonData);
        });
    }
}
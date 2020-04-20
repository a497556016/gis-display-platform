import BaseLayer from "./src/layer/BaseLayer";
import GeoJsonLayer from "./src/layer/GeoJsonLayer";
import JsonDataLayer from "./src/layer/JsonDataLayer";
import EntityUtils from "./src/util/EntityUtils";

import {createMap} from "./src/map";

export default (function () {

    return {
        layers: {
            BaseLayer,
            GeoJsonLayer,
            JsonDataLayer,
        },
        utils: {
            EntityUtils,
        },
        createMap
    }
})();
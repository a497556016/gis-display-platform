import BaseLayer from "./src/layer/BaseLayer";
import GeoJsonLayer from "./src/layer/GeoJsonLayer";
import JsonDataLayer from "./src/layer/JsonDataLayer";
import EntityUtils from "./src/util/EntityUtils";
import Coords from "./src/util/Coords";
import EventHandler from "./src/util/EventHandler";
import commonUtils from "./src/util/commonUtils";

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
            Coords,
            EventHandler,
            ...commonUtils
        },
        createMap
    }
})();
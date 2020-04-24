import * as Cesium from "cesium";
import 'cesium/Build/Cesium/Widgets/widgets.css';

import EventHandler from "./util/EventHandler";

const initCommonEventListener = function(eventHandler){
    const showTooltip = function (tooltip, {x, y}) {
        if(!tooltip) {
            return;
        }
        let container = document.querySelector('#tooltip_container');
        if(!container) {
            container = document.createElement('div');
            container.id = 'tooltip_container';
            container.style.position = 'fixed';
            container.style.background = '#ffffff';
            container.style.borderRadius = '5px';
            container.style.padding = '5px';

            document.querySelector('body').appendChild(container);
        }

        container.innerHTML = `
            <div style="position: absolute; bottom: -20px; left: calc(50% - 5px); height: 0px; width: 0px; border-style: solid; border-color: rgb(255, 255, 255) transparent transparent; border-width: 10px;"></div>
        ` + tooltip;
        container.style.display = 'inline-block';

        container.style.top = (y-container.offsetHeight-21)+'px';
        container.style.left = (x-(container.offsetWidth/2))+'px';
    };

    const hideTooltip = function () {
        let container = document.querySelector('#tooltip_container');
        if(container) {
            container.style.display = 'none';
        }
    };

    eventHandler.onLeftClick({
        handler(pick, viewer, e){
            if(pick && pick.id instanceof Cesium.Entity) {
                if(pick.id.onClick) {
                    pick.id.onClick(pick.id);
                }else if(pick.id.description) {
                    alert(pick.id.description);
                }
            }
        }
    });

    eventHandler.onMouseMove({
        handler(pick, viewer, e){
            if(pick && pick.id instanceof Cesium.Entity) {
                showTooltip(pick.id.tooltip, e.endPosition);
            }else {
                hideTooltip();
            }
        }
    })
};

import Maps from "./util/Maps";
import Coords from "./util/Coords";

export const createMap = function(containerId, config) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZWM1YTUwNi1mYTJkLTRkOGMtYjlkOC0wMTMwOTc0ZWFjNjkiLCJpZCI6NDExMSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTUzOTkxMTkyN30.A4seHeGwk82dubtb_HtbYNBC9K-79xLemvr77vjvTDs';
    const viewer = new Cesium.Viewer(containerId, {
        geocoder: true,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
        //Use Cesium World Terrain
        // terrainProvider : Cesium.createWorldTerrain(),
        // imageryProvider : new Cesium.OpenStreetMapImageryProvider({
        //     url : 'https://a.tile.openstreetmap.org/'
        // }),
    });
    //Add basic drag and drop functionality
    viewer.extend(Cesium.viewerDragDropMixin);

    //Show a pop-up alert if we encounter an error when processing a dropped file
    viewer.dropError.addEventListener(function(dropHandler, name, error) {
        console.log(error);
        window.alert(error);
    });
    // 隐藏版权信息
    viewer._cesiumWidget._creditContainer.style.display = "none";    // 隐藏logo
    viewer.scene.skyAtmosphere.show=false;    // 关闭大气层
    viewer.scene.globe.depthTestAgainstTerrain=true;    // 地面以下不可见（高程遮挡）

    if(config.center) {
        if(config.center.length === 2) {
            config.center[2] = 10000;
        }

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(config.center[0], config.center[1], config.center[2]),
            orientation : {
                heading : Cesium.Math.toRadians(0.0),
                pitch : Cesium.Math.toRadians(-45.0),
                roll : 0.0
            },
            duration: 3
        });
    }

    viewer.eventHandler = new EventHandler(viewer);
    viewer.maps = new Maps(viewer);
    viewer.coords = new Coords(viewer);

    initCommonEventListener(viewer.eventHandler);

    return viewer;
}
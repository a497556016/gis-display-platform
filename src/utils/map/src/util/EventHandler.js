import * as Cesium from "cesium";
import * as _ from "underscore";

export default class EventHandler {
    handler;
    leftClickHandlers = [];
    rightClickHandlers = [];
    mouseMoveHandlers = [];
    leftDoubleClickHandlers = [];
    constructor(viewer) {
        this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        function applyHandlers(handlers, e, position) {
            const pick = viewer.scene.pick(position);
            handlers.forEach(handler => {
                handler.handler.apply({viewer, event: e, pick}, [pick, viewer, e]);
            });
        }

        //左键单击
        this.handler.setInputAction((e) => {
            const { position } = e;
            applyHandlers(this.leftClickHandlers, e, position);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //右键单击
        this.handler.setInputAction((e) => {
            const { position } = e;
            applyHandlers(this.rightClickHandlers, e, position);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        //鼠标移入
        this.handler.setInputAction((e) => {
            const {startPosition, endPosition} = e;
            applyHandlers(this.mouseMoveHandlers, e, endPosition);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //鼠标左键双击
        this.handler.setInputAction((e) => {
            console.log(e);
            const { position } = e;
            applyHandlers(this.leftDoubleClickHandlers, e, position);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    containId(eventId){
        let have = false;

        have = this.leftClickHandlers.some(h => h.id === eventId);
        if(!have) {
            have = this.rightClickHandlers.some(h => h.id === eventId);
        }
        if(!have) {
            have = this.mouseMoveHandlers.some(h => h.id === eventId);
        }
        if(!have) {
            have = this.leftDoubleClickHandlers.some(h => h.id === eventId);
        }

        return have;
    }

    on(event, handler = {id: undefined, index: 0, handler(){}}){
        handler = handler || {};

        handler.id = handler.id || Cesium.createGuid();

        switch (event) {
            default: break;
            case 'leftClick':
                this.leftClickHandlers.push(handler);
                break;
            case 'rightClick':
                this.rightClickHandlers.push(handler);
                break;
            case 'mouseMove':
                this.mouseMoveHandlers.push(handler);
                break;
            case 'leftDoubleClick':
                this.leftDoubleClickHandlers.push(handler);
                break;
        }

        _.sortBy('index', this.leftClickHandlers);
        return handler.id;
    }

    onLeftClick(handler){
        return this.on('leftClick', handler);
    }

    onRightClick(handler){
        return this.on('rightClick', handler);
    }

    onMouseMove(handler){
        return this.on('mouseMove', handler);
    }

    onLeftDoubleClick(handler){
        return this.on('leftDoubleClick', handler);
    }

    removeById(id) {
        const index = _.findIndex(this.leftClickHandlers, {id});
        this.leftClickHandlers.splice(index, 1);
    }
}
import CesiumComponent from "./Cesium";
import CustomLayer from "../../utils/layers/CustomLayer";

export default {
    install(Vue) {
        const Component = Vue.extend({
            mixins: [CesiumComponent]
        });
        const component = new Component().$mount();
        console.log(component);
        document.querySelector("body").appendChild(component.$el);

        const viewer = component.init();
        Vue.prototype.$viewer = viewer;

        Vue.prototype.$maps = viewer.maps;

        const layer = new CustomLayer(viewer, '默认图层', {});
        Vue.prototype.$layer = layer;
    }
};
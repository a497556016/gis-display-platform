<template>
    <div id="cesiumViewer" class="cesium-container">

    </div>
</template>

<script>
    import map from "../../utils/map";
    export default {
        name: "Cesium",
        data(){
            return {

            }
        },
        mounted() {
        },
        methods: {
            init(){
                return map.createMap('cesiumViewer', {
                    center: [113.212, 23.1254]
                });
            }
        }
    }
</script>

<style scoped>
    .cesium-container{
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
    }
</style>
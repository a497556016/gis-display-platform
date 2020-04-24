<template>
    <div class="app">
        <div class="container">
            <div>
                <a class="button button-primary" @click="open1()">打开新页面1</a>
                <a class="button" @click="open2()">打开新页面2</a>
            </div>
            <div>
                <a class="button" @click="hideLayer">隐藏图层</a>
                <a class="button" @click="showLayer">打开图层</a>
            </div>
        </div>
    </div>
</template>

<script>
    import RoadLayer from "../utils/layers/RoadLayer";
    import IssueLayer from "../utils/layers/IssueLayer";
    import map from "../utils/map";
    import * as Cesium from "cesium";
    import AreaLayer from "../utils/layers/AreaLayer";

    export default {
        name: "Test",
        data(){
            return {
                markerId: null
            }
        },
        mounted() {
            this.areaLayer = new AreaLayer(this.$viewer, '区域图层', {
                flyTo: false,
            });
            this.roadLayer = new RoadLayer(this.$viewer, '道路图层', {
                flyTo: false,
                style: {
                    stroke: Cesium.Color.YELLOW,
                    strokeWidth: 5,
                    clampToGround: true,
                }
            });
            this.issueLayer = new IssueLayer(this.$viewer, '隐患图层', {
                flyTo: false
            });
            this.$layer.addMarkers([
                {
                    "id": "[warning]http://47.106.151.158:8086/issue-external-pack/#/warningIssueDetail?_=1586315582023&id=43",
                    lng: 114.39149489726566,
                    lat: 22.69442248103357,
                    height: 0,
                    "image": "http://47.106.151.158:8086/issue-external-pack/assets/image/marker/warning1.png",
                    "tooltip": "<div style=\"padding: 15px;\">[warning]http://47.106.151.158:8086/issue-external-pack/#/warningIssueDetail?_=1586315582023&id=43</div>"
                }
            ], true);
            this.$layer.addMarkers([
                {
                    "id": "[warning]http://47.106.151.158:8086/issue-external-pack/#/warningIssueDetail?_=1586315582023&id=41",
                    lng: 114.39149489726566,
                    lat: 22.68442248103357,
                    height: 0,
                    "image": "http://47.106.151.158:8086/issue-external-pack/assets/image/marker/warning1.png",
                    "tooltip": "<div style=\"padding: 15px;\">[warning]http://47.106.151.158:8086/issue-external-pack/#/warningIssueDetail?_=1586315582023&id=43</div>"
                }
            ], true);
        },
        destroyed(){
            this.entityUtils.destroy();
        },
        methods: {
            open1(){
                this.$window.open({
                    type: "1",
                    url: "http://www.baidu.com",
                    title: "百度1",
                    replace: false
                })
            },
            open2(){
                this.$window.open({
                    type: "1",
                    url: "http://www.baidu.com",
                    title: "百度2",
                    replace: true,
                    close: () => {
                        this.$viewer.dataSources.removeAll();
                    }
                })
            },
            hideLayer(){
                this.roadLayer.setVisible(false);
                this.issueLayer.setVisible(false);
                this.$layer.setVisible(false);
            },
            showLayer(){
                this.roadLayer.setVisible(true);
                this.issueLayer.setVisible(true);
                this.$layer.setVisible(true);
            },


        }
    }
</script>

<style scoped>

</style>
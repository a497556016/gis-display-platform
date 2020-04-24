<template>
    <div class="app">
        <edit-polyline v-if="editType === 'polyline'" :entity-utils="entityUtils"></edit-polyline>
        <edit-billboard v-else-if="editType === 'billboard'" :entity-utils="entityUtils"></edit-billboard>
        <edit-polygon v-else-if="editType === 'polygon'" :entity-utils="entityUtils"></edit-polygon>

        <div class="container">
            <a v-if="editType" class="button" @click="back">返回</a>
            <div v-else>
                <div>
                    <a class="button" @click="editBillboard">标点</a>
                    <a class="button" @click="editPolyline">标线</a>
                    <a class="button" @click="editPolygon">标面</a>
                </div>
                <div>
                    <a class="button" @click="removeEdit">清除编辑</a>
                    <a class="button" @click="saveEdit">保存</a>
                    <a class="button" @click="importEdit">导入编辑</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import map from "../../../utils/map";
    import EditPolyline from "./EditPolyline";
    import EditBillboard from "./EditBillboard";
    import EditPolygon from "./EditPolygon";
    export default {
        name: "Plot",
        components: {EditPolygon, EditBillboard, EditPolyline},
        data(){
            return {
                editType: ''
            }
        },
        mounted() {
            this.entityUtils = new map.utils.EntityUtils({
                viewer: this.$viewer,
                hasEdit: true
            });
        },
        methods: {
            editBillboard(){
                this.editType = 'billboard';
            },
            editPolyline(){
                this.editType = 'polyline';
            },
            removeEdit(){
                this.entityUtils.removeAll();
            },
            saveEdit(){
                this.entityUtils.saveEdit();
            },
            importEdit(){
                map.utils.files.openFile().then((file) => {
                    file.asText().then(text => {
                        console.log(text);
                        const entities = this.entityUtils.fromGeoJson(JSON.parse(text));
                        console.log(entities);
                        this.entityUtils.drawEntities(entities)
                        this.$viewer.flyTo(entities, {
                            duration: 3
                        })
                    });
                });
            },
            editPolygon(){
                this.editType = 'polygon';
            },
            back(){
                this.editType = '';
                this.entityUtils.stopEdit();
            }
        }
    }
</script>

<style scoped>

</style>
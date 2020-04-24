<template>
    <div>
        <div class="main-title">
            GIS综合展示系统
        </div>

        <div class="main-menu">
            <div class="menu-item-1" v-for="(menu, index) in menus" :key="index" @click="ifMenuSecond(menu)">{{menu.title}}</div>
        </div>
        <div v-if="secondMenus.length">
            <div class="second-menu-title">{{secondMenuTitle}}</div>
            <div class="second-menu">
                <div class="menu-item-2" v-for="(menu, index) in secondMenus" :key="index" @click="ifMenuSecond(menu)">
                    <div class="menu-item-2-bg">
                        <img v-if="menu.image" :src="menu.image" style="width: 100%;height: 100%;">
                        <div v-else-if="menu.icon" style="padding-top: 20px">
                            <font-awesome-icon :icon="menu.icon" fixed-width size="3x"></font-awesome-icon>
                        </div>
                    </div>
                    <div class="menu-item-2-title">{{menu.title}}</div>
                </div>
                <div style="flex: 0 0 25px"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import menus from "../config/menus";
    export default {
        name: "Index",
        data(){
            return {
                menus,
                secondMenuTitle: '',
                secondMenus: [],
                secondMenuPosition: 0,
            }
        },
        mounted(){

        },
        methods: {
            ifMenuSecond(menu){
                // console.log(e)
                if(menu.children) {
                    this.secondMenuTitle = menu.title;
                    this.secondMenus = menu.children;
                }else {
                    this.secondMenus = [];
                    this.openWindow(menu);
                }
            },
            openWindow(menu) {
                if(menu.path) {
                    const options = menu.options || {
                        type: menu.type,
                        url: menu.path,
                        title: menu.title,
                        success: () => {
                            this.$viewer.dataSources.removeAll();
                        },
                        close: () => {
                            this.$viewer.dataSources.removeAll();
                            this.$viewer.entities.removeAll();
                        }
                    };
                    console.log(options);

                    this.$window.close();
                    this.$window.open(options);

                    this.secondMenus = [];
                }
            }
        }
    }
</script>

<style scoped>
    .main-title {
        font-weight: bold;
        font-size: 23px;
        padding: 15px;
        width: 200px;
        color: white;
        background-color: rgba(0,0,0,0.75);
        border: 1px solid #4b5a8b;
        border-radius: 3px;
        position: absolute;
        z-index: 1;
        left: calc(50% - 100px);
    }
    .main-menu {
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: 350px;
        right: 350px;
        height: 50px;
        line-height: 50px;
        background: rgba(0,0,0,0.75);
        border: 1px solid #4b5a8b;
        overflow: hidden;
        overflow-y: auto;
        color: white;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
    .menu-item-1 {
        float: left;
        height: 100%;
        width: 100px;
        text-align: center;
        /*padding: auto 15px;*/
        display: inline-block;
        cursor: pointer;
        margin: auto 25px;
    }
    .menu-item-1:hover {
        color: #f4ed8e;
        background-color: rgba(99, 103, 139, 0.64);
    }
    .second-menu {
        position: absolute;
        z-index: 1;
        bottom: 60px;
        left: 350px;
        right: 350px;
        display: flex;
        overflow-x: auto;
        box-sizing: border-box;
        background-color: rgba(0,0,0,0.75);
        padding: 10px 25px;
        color: white;
        border-top-right-radius: 5px;
        border: 1px solid #606e87;
        height: 150px;
    }
    .second-menu-title {
        position: absolute;
        bottom: 210px;
        left: 350px;
        background: rgba(0,0,0,0.85);
        color: white;
        padding: 5px 15px;
        border-top: 1px solid #606e87;
        border-left: 1px solid #606e87;
        border-right: 1px solid #606e87;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .menu-item-2 {
        cursor: pointer;
        flex: 0 0 200px;
        text-align: center;
        position: relative;
    }
    .menu-item-2:not(:first-child) {
        margin-left: 25px;
    }
    .menu-item-2:hover {
        color: #f4ed8e;
        background-color: rgba(99, 103, 139, 0.64);
    }
    .menu-item-2-bg {
        height: 100%;
        width: 100%;
    }
    .menu-item-2-title {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: #0f0d2dad;
        padding: 3px 0;
    }
</style>
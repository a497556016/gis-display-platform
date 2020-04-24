<template>
    <div v-if="visible" :id="id" class="window" :style="windowStyle">
        <div class="window-title">
            {{title}}
            <div class="window-title-actions">
                <div class="widow-close">
                    <span v-if="history.length<=1" @click="close">关闭</span>
                    <span v-else @click="back">返回</span>
                </div>
            </div>
        </div>
        <iframe v-if="outerLink" :src="outerLink" frameborder="0" width="100%" height="100%"></iframe>
        <component v-else :is="component"></component>
    </div>
</template>

<script>
    const leftStyle = {
        bottom: 0,
        left: 0,
        width: '300px',
        height: '900px'
    };
    const centerStyle = {
        bottom: '100px',
        left: '350px',
        width: '1200px',
        height: '800px'
    };
    export default {
        name: "Window",
        data(){
            return {
                id: "window_0",
                visible: false,
                windowEvent: {},
                onClose: null,
                windowStyle: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                type: 'left',
                history: [],
                title: '',
                outerLink: null,
                component: null
            }
        },
        created(){
            switch (this.type) {
                default:
                    this.windowStyle = leftStyle;
                    break;
                case 'left':
                    this.windowStyle = leftStyle;
                    break;
                case 'center':
                    this.windowStyle = centerStyle;
                    break;
                case 'right':
                    break;
                case 'top':
                    break;
            }
        },
        methods: {
            setTitle(title) {
                this.title = title;
            },
            open(option, isBack){
                const { url, title, success, close } = option;

                if (url.endsWith('.js')) {
                    this.outerLink = null;
                    const script = (() => import("../../views"+url))();
                    console.log(script);
                    if(script instanceof Promise) {
                        script.then((module) => {
                            console.log(module);
                            module && module.default && module.default.setup && module.default.setup.apply(this, []);
                        })
                    }
                    return;
                }

                this.title = title;

                if(url && url.startsWith('http')) {
                    this.outerLink = url;
                }else{
                    this.outerLink = null;
                    this.component = () => import("../../views"+url);
                }

                this.visible = true;

                if(!isBack) {
                    if(option.replace) {
                        this.history.pop();
                    }
                    this.history.push(option);
                    console.log(this.history)
                }

                if(success) {
                    success();
                }
                this.windowEvent.close = close;
            },
            close(){
                if(this.windowEvent.close) {
                    this.windowEvent.close();
                }

                this.visible = false;
                this.history = [];
            },
            back(){
                this.history.pop();
                this.open(this.history[this.history.length-1], true);
            }
        }
    }
</script>

<style scoped>
    .window {
        position: fixed;
        z-index: 1000;
    }
    .window-title {
        position: absolute;
        top: -30px;
        height: 30px;
        line-height: 30px;
        width: calc(100% - 15px);
        padding-left: 15px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #4e4f66;
        background-color: rgba(23, 25, 67, 0.5);
        color: white;
    }
    .window-title-actions {
        float: right;
        height: 100%;
        width: 40px;
        text-align: center;
        color: #dfdfdf;
    }
    .widow-close {
        font-size: 14px;
        cursor: pointer;
        font-weight: normal;
    }
</style>
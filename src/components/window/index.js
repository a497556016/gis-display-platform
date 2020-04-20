import Window from "./Window";

const windowStore = {
    createWindow(Component, type){
        const bodyEl = document.querySelector('body');
        const window = new Component({
            data: {
                type: type
            }
        }).$mount();
        bodyEl.appendChild(window.$el);
        return window;
    }
}

export default {
    install(Vue, option) {
        const Component = Vue.extend({
            mixins: [Window]
        });

        //默认的窗口
        const defaultWindow = windowStore.createWindow(Component, '1');
        //大尺寸窗口
        const largeWindow = windowStore.createWindow(Component, '2');

        Vue.prototype.$window = {
            open(option){
                //默认替换当前页
                option.replace = option.replace !== false;
                if(option.type === '1') {
                    return defaultWindow.open(option);
                }else if(option.type === '2') {
                    return largeWindow.open(option);
                }
            },
            close(type){
                switch (type) {
                    default:
                        defaultWindow.close();
                        largeWindow.close();
                        break;
                    case '1':
                        defaultWindow.close();
                        break;
                    case '2':
                        largeWindow.close();
                        break;
                }
            },
            setTitle(type, title) {
                switch (type) {
                    default:
                        break;
                    case '1':
                        defaultWindow.setTitle(title);
                        break;
                    case '2':
                        largeWindow.setTitle(title);
                        break;
                }
            }
        };
    }
}
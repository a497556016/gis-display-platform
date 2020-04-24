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
        const leftWindow = windowStore.createWindow(Component, 'left');
        //大尺寸窗口
        const centerWindow = windowStore.createWindow(Component, 'center');

        Vue.prototype.$window = {
            open(option){
                //默认替换当前页
                option.replace = option.replace !== false;
                if(option.type === 'left') {
                    return leftWindow.open(option);
                }else if(option.type === 'center') {
                    return centerWindow.open(option);
                }else {
                    return leftWindow.open(option);
                }
            },
            close(type){
                switch (type) {
                    default:
                        leftWindow.close();
                        centerWindow.close();
                        break;
                    case 'left':
                        leftWindow.close();
                        break;
                    case 'center':
                        centerWindow.close();
                        break;
                }
            },
            setTitle(type, title) {
                switch (type) {
                    default:
                        break;
                    case 'left':
                        leftWindow.setTitle(title);
                        break;
                    case 'center':
                        centerWindow.setTitle(title);
                        break;
                }
            }
        };
    }
}
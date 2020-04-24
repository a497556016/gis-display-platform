import {Cartesian3, Cartographic, Math, SceneTransforms} from "cesium";

export default (function () {

    function files() {
        const saveAs = function(content, filename) {
            // 创建隐藏的可下载链接
            var eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            var blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        };
        const openFile = function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';

            return new Promise(resolve => {
                fileInput.onchange = function(e) {
                    console.log(e);
                    const files = e.target.files;
                    const fileReader = new FileReader();

                    function onload(resolve){
                        fileReader.onload = function(e){
                            const result = e.target.result;
                            resolve(result);
                        }
                    }

                    resolve({
                        asText(){
                            return new Promise(resolve => {
                                onload(resolve);
                                fileReader.readAsText(files[0]);
                            })
                        },
                        asDataURL(){
                            return new Promise(resolve => {
                                onload(resolve);
                                fileReader.readAsDataURL(files[0]);
                            })
                        }
                    });

                    document.body.removeChild(fileInput);
                }

                document.body.appendChild(fileInput);

                fileInput.click();
            });
        }

        return {
            saveAs,
            openFile
        }
    }

    return {
        files: files()
    }
})();
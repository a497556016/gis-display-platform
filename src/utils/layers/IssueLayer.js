import map from "../map";

export default class IssueLayer extends map.layers.JsonDataLayer {


    loadData(){
        const issueData = [
            {
                type: 'billboard',
                position: [114.411544945308, 22.696449610285384],
                tooltip: '标记1',
                style: {
                    clampToGround: true,
                    image: require("../../assets/images/marker/mark-thunder.png"),
                    scale: 1.0
                },
                onClick: function () {

                }
            },
            {
                type: 'billboard',
                position: [114.39867034203652, 22.695467724017092, 0],
                tooltip: '标记2',
                onClick(){
                    alert('?')
                },
                style: {
                    clampToGround: true,
                    image: 'http://47.106.151.158:8086/issue-external-pack/assets/image/marker/warning1.png',
                    scale: 1.0,
                    width: 64,
                    height: 64
                }
            },
        ];
        return new Promise(resolve => {
            console.log(issueData);
            resolve(issueData);
        });
    }
}
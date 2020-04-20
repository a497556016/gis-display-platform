
export default {
    install(Vue){
        const layer = Vue.prototype.$layer;
        window.AC = {
            LabelClickCallbackFunction: {
                ShowIssueDetail(entity) {
                    console.log(entity);
                    Vue.prototype.$window.open({
                        type: '2',
                        url: entity.id.substr('[warning]'.length, entity.id.length),
                        replace: true
                    })
                }
            },
            LocatTo(type, code, isHighlight){
                layer.locationTo(113.95581311578638,22.530434416545973, 20000);
            },
            CreateImageLabelsByWGS84Coord(arrayLabels){
                const arrayMarkers = [];
                arrayLabels.map(({lng, lat, height, labelName, imageName, callbackFunction}) => {
                    arrayMarkers.push({
                        id: labelName,
                        lng, lat, height: 0,
                        image: imageName,//require('../assets/images/marker/mark-thunder.png'),
                        tooltip: '<div style="padding: 15px;">'+labelName+'</div>',
                        onClick: (entity) => {
                            eval(callbackFunction)(entity);
                        }
                    });

                });

                layer.addMarkers(arrayMarkers, false);
            }
        };

        addEventListener("message", e => {
            console.log('listen message', e);
            const {method, args} = e.data;
            if(method && window.AC[method]) {
                window.AC[method].apply(window.AC, args);
            }
        })
    }
}
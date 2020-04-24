export default {
    setup(){
        console.log('创建osm底图', this);
        this.$viewer.maps.setMapLayer('osm');
    }
}
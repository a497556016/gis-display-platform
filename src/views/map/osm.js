export default {
    setup(){
        console.log('创建osm底图', this);
        this.$maps.setLayer('osm');
    }
}
<template>
    <div class="container">
        <form class="form">
            <form-field label="颜色" v-model="style.color"></form-field>
            <form-field label="贴地" type="checkbox" v-model="style.clampToGround"></form-field>
            <a class="button" @click="beginEdit">开始</a>
        </form>
    </div>
</template>

<script>
    import FormField from "../../../components/form/FormField";
    export default {
        name: "EditPolyline",
        components: {FormField},
        props: {
            entityUtils: Object
        },
        data(){
            return {
                style: {
                    color: '#ffff00',
                    clampToGround: true
                }
            }
        },
        mounted() {

        },
        methods: {
            beginEdit(){
                this.entityUtils.create({
                    type: "polyline",
                    style: {
                        ...this.style
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
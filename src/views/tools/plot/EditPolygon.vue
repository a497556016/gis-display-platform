<template>
    <div class="container">
        <form class="form">
            <form-field label="颜色" v-model="style.color"></form-field>
            <form-field label="贴地" type="checkbox" v-model="style.clampToGround"></form-field>
            <form-field label="边框" type="checkbox" v-model="style.outline"></form-field>
            <form-field label="边框颜色" v-model="style.outlineColor"></form-field>
            <a class="button" @click="beginEdit">开始</a>
        </form>
    </div>
</template>

<script>
    import FormField from "../../../components/form/FormField";
    export default {
        name: "EditPolygon",
        components: {FormField},
        props: {
            entityUtils: Object
        },
        data(){
            return {
                style: {
                    color: '#0000ff',
                    clampToGround: true,
                    outline: true,
                    outlineWidth: 10,
                    outlineColor: '#ffffff'
                }
            }
        },
        mounted() {

        },
        methods: {
            beginEdit(){
                this.entityUtils.create({
                    type: "polygon",
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
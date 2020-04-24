<template>
    <div class="container">
        <form class="form">
            <form-field label="图标" v-model="style.image"></form-field>
            <form-field label="缩放" v-model="style.scale"></form-field>
            <form-field label="贴地" type="checkbox" v-model="style.clampToGround"></form-field>
            <a class="button" @click="beginEdit">开始</a>
        </form>
    </div>
</template>

<script>
    import FormField from "../../../components/form/FormField";
    export default {
        name: "EditBillboard",
        components: {FormField},
        props: {
            entityUtils: Object
        },
        data(){
            return {
                style: {
                    image: "/assets/images/mark-thunder.png",
                    scale: 0.5,
                    clampToGround: true
                }
            }
        },
        methods: {
            beginEdit(){
                this.entityUtils.create({
                    type: "billboard",
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
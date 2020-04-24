<template>
    <div class="form-field">
        <label v-html="label"></label>
        <template v-if="type === 'textarea'">
            <textarea v-model="input"></textarea>
        </template>
        <template v-else-if="type === 'checkbox'">
            <input v-model="input" type="checkbox">
        </template>
        <template v-else-if="type === 'radio'">
            <input v-model="input" type="radio">
        </template>
        <template v-else>
            <input v-model="input">
        </template>
    </div>
</template>

<script>
    export default {
        name: "FormField",
        props: {
            type: String,
            label: String,
            // eslint-disable-next-line vue/require-prop-type-constructor
            value: Object | String
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                input: this.value
            }
        },
        watch: {
            input(v){
                this.$emit('change', v);
            }
        }
    }
</script>

<style scoped lang="less">
    .form-field {
        font-size: 16px;
        height: 32px;
        line-height: 1fr;
        label{
            font-weight: bold;
            margin-right: 5px;
        }
        input{

        }
        textarea{

        }
    }
</style>
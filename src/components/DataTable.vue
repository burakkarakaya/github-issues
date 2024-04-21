<template>
    <ul class="data-list">
        <li v-for="item in data" :key="item.id">
            <a :href="item.html_url" target="_blank">{{ item.title }}</a>
            <span>#{{item.number}} opened on {{formatDate(item.created_at)}} by <a target="_blank" :href="item.user.html_url">{{item.user.login}}</a></span>
            <div class="labels">
                <span v-for="label in item.labels" :key="label.id" :style="{ backgroundColor: '#' + label.color }">{{label.name}}</span>
            </div>
        </li>
    </ul>
</template>

<script>
import {formatDate} from '@/helper/utils';

export default {
    props: {
        data: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    setup() {
        return {formatDate};
    }
}
</script>
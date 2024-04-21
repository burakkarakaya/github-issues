<template>
    <ul class="data-list">
        <template v-if="data.length > 0">
            <li v-for="item in data" :key="item.id">
                
                <div class="d-flex">

                    <img class="avatar" :alt="item.user.login" :src="item.user.avatar_url" />

                    <div>

                        <a :href="item.html_url" target="_blank">{{ item.title }}</a>
                        <span>#{{item.number}} opened on {{formatDate(item.created_at)}} by <a target="_blank" :href="item.user.html_url">{{item.user.login}}</a></span>
                        <div class="labels">
                            <span v-for="label in item.labels" :key="label.id" :style="{ backgroundColor: '#' + label.color }">{{label.name}}</span>
                        </div>

                    </div>

                </div>
            </li>
        </template>
        <template v-if="data.length == 0">
            <li>No Result</li>
        </template>
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
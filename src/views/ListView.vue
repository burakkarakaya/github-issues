<template>

    <div v-if="loading">Yükleniyor...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <template v-else>
        <div class="data-list-header d-flex justify-content-between">
            <div>
                {{filteredData.length}} Open
            </div>
            <div class="d-flex justify-content-between">
                <DropDown :options="authors" label="Author" @update:selected="handleSelect" />
                <DropDown :options="labels" label="Label"  @update:selected="handleSelect" />
                <DropDown :options="sortOptions" label="Sort"  @update:selected="handleSelect" />
            </div>
        </div>

        <DataTable :data="filteredData" />

    </template>

</template>

<script>
    import { computed, ref, watch } from 'vue';
    import ApiService from '@/services/ApiService';
    import {getUniqueItems} from '@/helper/utils';
    import DropDown from '@/components/DropDown.vue';
    import DataTable from '@/components/DataTable.vue';

    export default{
        components: {
            DropDown,
            DataTable
        },
        setup(){
            
            const {loading, error, data} = ApiService.Issues();

            const authors = computed(()=>{
                let result = [];
                if (data.value){
                    result = getUniqueItems(data.value.map(item => ({ label: item.user.login, value: item.user.id })));
                }
                return result;
            });

            const labels = computed(()=>{
                let result = [];
                if (data.value){
                    result = getUniqueItems(data.value.flatMap(item => item.labels.map(subItem => ({ label: subItem.name, value: subItem.id }))));
                }
                return result;
            });
            
            const sortOptions = ref([
                { label: 'Date', value: 'date' },
                { label: 'Number Of Comments,', value: 'comments' },
                { label: 'Modified Date', value: 'modified' }
            ]);

            const selectedFilter = ref({});
            const filterEntries = ref([]);
            const selectedSort = ref(null);

            watch(selectedFilter, (newFilter)=>{
                filterEntries.value = Object.entries(newFilter);
            }, {deep: true});

            const filteredData = computed(()=>{

                let result = [...(data.value || [])];

                if( filterEntries.value.length > 0 ){

                    result = data.value.filter((item)=>{

                        return filterEntries.value.every(([key, value]) => {
                                switch (key) {
                                    case 'Author': return item.user.id === value;
                                    case 'Label': return item.labels.some(label => label.id === value);
                                    default:return true;
                                }
                            });
                    });

                }

                if (selectedSort.value){

                    result.sort((a, b) => {
                        let valA, valB;
                        switch (selectedSort.value) {
                            case 'date':
                            valA = new Date(a.created_at);
                            valB = new Date(b.created_at);
                            break;
                            case 'comments':
                            valA = a.comments;
                            valB = b.comments;
                            break;
                            case 'modified':
                            valA = new Date(a.updated_at);
                            valB = new Date(b.updated_at);
                            break;
                        }
                        return valA < valB ? -1 : (valA > valB ? 1 : 0);
                    });

                }

                return result; 
            });

            const handleSelect = (obj)=>{
                if (obj.label == 'Sort'){
                    if (obj.type == 'add'){
                        selectedSort.value = obj.value;
                    }else if (obj.type == 'remove'){
                        selectedSort.value = null;
                    }
                }else{
                    if (obj.type == 'add'){
                        selectedFilter.value[obj.label] = obj.value;
                    }else if (obj.type == 'remove'){
                        delete selectedFilter.value[obj.label];
                    }
                }
            };

            return {
                loading,
                error,
                filteredData,

                authors, 
                labels,
                sortOptions, 
                
                handleSelect
            };
        }
    }

</script>
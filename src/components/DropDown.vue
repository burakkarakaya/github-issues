<template>
  <div ref="dropdown" class="dropdown" :class="{'opened': isOpen}">
    <span @click="toggleDropdown">
      {{ label }}<small v-if="selectedOption.value !== -1">: {{ selectedOption.label }}</small>
    </span>
    <div v-if="isOpen" class="sub">
      <ul>
        <li v-for="option in options" :key="option.value" @click="selectOption(option)" :class="{'selected': option.value === selectedOption.value }">
          <template v-if="option.value === selectedOption.value">✅</template> {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const dropdown = ref(null);
    const isOpen = ref(false);
    const label = ref(props.label);
    const initialOption = { label: '', value: -1 };
    const selectedOption = ref(initialOption);

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectOption = (option) => {
      if (selectedOption.value.value !== option.value) {
        selectedOption.value = option;
        emit('update:selected', { type: 'add', label: props.label, value: option.value });
      } else {
        selectedOption.value = initialOption;
        emit('update:selected', { type: 'remove', label: props.label, value: option.value });
      }
      isOpen.value = false;
    };

    const handleClickOutside = (event) => {
      if (isOpen.value && !dropdown.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return { isOpen, toggleDropdown, selectOption, label, selectedOption, props, dropdown };
  }
}
</script>
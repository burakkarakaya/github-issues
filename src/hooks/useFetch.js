import { ref, onMounted, watch, onUnmounted } from 'vue';

export function useFetch(url) {
  const uri = ref(url);  
  const data = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const controller = new AbortController();
  let isPending = false;

  const fetchData = async () => {
    if (isPending) controller.abort();
    isPending = true;
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${uri.value}`, { signal: controller.signal });
      if (!response.ok) {
        throw new Error('Sunucu hatası oluştu: ' + response.statusText);
      }
      data.value = await response.json();
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Fetch iptal edildi');
      } else {
        error.value = 'Veri yüklenirken bir hata oluştu: ' + e.message;
      }
    } finally {
      loading.value = false;
      isPending = false;
    }
  };

  onMounted(fetchData);

  watch(()=>uri.value, fetchData); // URL değiştiğinde fetchData fonksiyonunu çağır

  onUnmounted(() => {
    controller.abort();
  });

  return { loading, error, data, fetchData };
}
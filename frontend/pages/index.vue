<template>
  <div class="p-10 bg-[#100316] flex flex-col items-center justify-center text-[white] h-screen">
    <img :src="bitcoin" alt="" class="h-20">
    <select v-model="selectedPeriod" class="border p-2 rounded mt-10">
      <option value="1d" class="text-[black]">День</option>
      <option value="1w" class="text-[black]">Неделя</option>
      <option value="1m" class="text-[black]">Месяц</option>
      <option value="1y" class="text-[black]">Год</option>
      <option value="custom" class="text-[black]">Свой период</option>
    </select>
    <div v-if="selectedPeriod === 'custom'" class="flex gap-2 mt-5" required>
      <input type="date" v-model="customStart" class="border p-2 rounded " :max="customEnd" min="2017-08-17"/>
      <input type="date" v-model="customEnd" class="border p-2 rounded" :max="today" min="2017-08-18"/>
      <button @click="dateToPush" class="bg-blue-500 text-white px-4 py-2 rounded">Применить</button>
    </div>
    <div class="flex pt-5 pb-5">
      <h4>Выбранный период : </h4>
      <span class="ml-3" v-if="selectedPeriod === 'custom'">
        <b v-if='customStart == ""'>Выберите начальную дату </b>
        <p v-else=''> C <b>{{ customStart }}</b> по <b>{{ customEnd }}</b></p>
      </span>
      <span class="ml-3" v-else>{{ selectedPeriod }}</span>
    </div>
     <BitcoinChart :labels="labels" :prices="prices"/>
  </div>
</template>

<script setup>
import bitcoin from '../assets/icons/bitcoin.png'
import { ref } from 'vue'
const selectedPeriod = ref('1d')

const today = new Date().toISOString().split('T')[0]
const customStart = ref('')
const customEnd = ref(today)

const labels = ref([])
const prices = ref([])



async function dateToPush(){
  try{
    let url = ''
    const payload = {
  labels: labels.value,
  prices: prices.value
}
    if(selectedPeriod.value == 'custom'){
      url = `http://localhost:4000/graph/data?start=${customStart.value}&end=${customEnd.value}&period=${selectedPeriod.value}`
    }
    else{
      url = `http://localhost:4000/graph/data?period=${selectedPeriod.value}`
    }
    const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    start: customStart.value,
    end: customEnd.value,
    period: selectedPeriod.value
  })
});


    const data = await res.json()
    if(!res.ok){
      alert(data.error)
      return
    }
    labels.value = [];
    prices.value = [];
    for(let results in data){
      for(let result of data[results]){
        console.log(typeof result.close_time, result.close_time);
        labels.value.push(result.close_time)
        prices.value.push(result.close_price)
      }
    }
  }
  catch(err){
    console.error(`Ошибка ${err}`)
  }
}
watch(selectedPeriod,(newVal) => {
    if(newVal !== 'custom'){
      dateToPush()
    }
  })

    onMounted(() => {
    dateToPush()
  })
</script>

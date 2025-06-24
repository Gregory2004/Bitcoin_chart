<template>
  <div class="p-10">
    <select v-model="selectedPeriod" class="border p-2 rounded mb-4">
      <option value="1d">День</option>
      <option value="1w">Неделя</option>
      <option value="1m">Месяц</option>
      <option value="1y">Год</option>
      <option value="custom">Свой период</option>
    </select>
    <div v-if="selectedPeriod === 'custom'" class="flex gap-2 mb-4" required>
      <input type="date" v-model="customStart" class="border p-2 rounded" :max="customEnd" />
      <input type="date" v-model="customEnd" class="border p-2 rounded" :max="today" />
      <button @click="dateToPush" class="bg-blue-500 text-white px-4 py-2 rounded">Применить</button>
    </div>
    <div class="flex">
      <h4>Выбранный период : </h4>
      <span class="ml-3" v-if="selectedPeriod === 'custom'">
        <b v-if='customStart == ""'>Выберите начальную дату </b>
        <p v-else=''> C <b>{{ customStart }}</b> по <b>{{ customEnd }}</b></p>
      </span>
      <span class="ml-3" v-else>{{ selectedPeriod }}</span>
    </div>
     <BitcoinChart />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const selectedPeriod = ref('1d')

const today = new Date().toISOString().split('T')[0]
const customStart = ref('')
const customEnd = ref(today)



async function dateToPush(){
  try{
    let url = ''
    
    if(selectedPeriod.value == 'custom'){

      
      url = `http://localhost:4000/graph/data?start=${customStart.value}&end=${customEnd.value}`
    }
    else{
      url = `http://localhost:4000/graph/data?period=${selectedPeriod.value}`
    }
    const res = await fetch(url)
    const data = await res.json()
    console.log(`Ответ таков: ${data}`)
    console.log('ку')
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

<script setup lang="ts">
import { ref,onMounted,nextTick } from 'vue';
import { useOnline, useDevicesList } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const online = useOnline()
let loading_status = ref(true);
let status = ref('1/6 初始化中');
let res = ref('无异常');
import loading from './tiny/loading.vue'
const {
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = useDevicesList({
  requestPermissions: true,
})
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function check() {
  await sleep(1000)
  status.value = '2/8 正在检查DoConnect Vue.js运行环境'
  await nextTick()
  await sleep(500)
  status.value = '3/8 检查联网状态'
  if(loading_status.value == true && online.value == true){
    await sleep(1000)
  } else {
    loading_status.value = false;
    res.value = '网络异常';
  }
  status.value = '4/8 检查摄像头与麦克风设备'
  if(loading_status.value == true && cameras.value.length > 0 && microphones.value.length > 0){
    await sleep(1000)
  }else{
    loading_status.value = false;
    res.value = '摄像头或麦克风异常';
  }
  status.value = '5/8 检查客户端更新'
  await sleep(700)
  if (loading_status.value == true) {
    status.value = '7/8 正在挂载用户业务运行时路由'
    await router.isReady()
    await sleep(2000)
    status.value = '8/8 即将启动业务组件运行时'
    await sleep(3000)
    router.push('/user/main');
  }
}
onMounted(() => {
  check()
})
</script>

<template>
  <h1>Moedigital DoConnect™</h1>
  <h2>Moedigital Digital Runtime System</h2>
  <br><br>
  <loading v-if="loading_status"/>
  <h3 v-if="loading_status">{{ status }}</h3>
  <h3 v-if="!loading_status">{{ res }}</h3>
</template>

<style scoped>

</style>

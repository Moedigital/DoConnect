<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, onMounted, nextTick } from 'vue'
import { useOnline, useDevicesList,useWakeLock } from '@vueuse/core'
const {
  isSupported: isWakeLockSupported,
  isActive: isWakeLockActive,
  request: requestWakeLock,
  release: releaseWakeLock,
} = useWakeLock()
import { define_user_runtime_config } from '../doconnect.config.js';

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const online = useOnline()
const loading_status = ref(true);
const status = ref('1/6 初始化中');
const res = ref('无异常');
import loading from './tiny/loading.vue'
const {
  videoInputs: cameras,
  audioInputs: microphones,
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
  } else if( define_user_runtime_config.must_online == false ){
    await sleep(1500)
  } else {
    loading_status.value = false;
    res.value = '网络未连接或异常';
    return
  }
  status.value = '4/8 检查摄像头与麦克风设备'
  if (loading_status.value == true && cameras.value.length > 0 && microphones.value.length > 0) {
    await sleep(1000)
  } else if (define_user_runtime_config.voice_and_video_must_online == false) {
    await sleep(1500)
  } else {
    loading_status.value = false;
    res.value = '摄像头或麦克风异常';
    return
  }
  status.value = '5/8 正在更新系统设置'
  if (isWakeLockSupported) {
    await requestWakeLock()
  }
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
  <div v-if="!loading_status">
    <h2>发生错误:</h2>
    <h3>{{ res }}</h3>
    <p>
      有关报错信息,您可参阅DoConnect文档或当前产品的用户手册<br>或携带截图或拍屏到GitHub - DoConnect官方仓库 发起issues.
    </p>
    <p>Moedigital OpenSource 2022-{{ new Date().getFullYear() }}</p>
  </div>
</template>

<style scoped>

</style>

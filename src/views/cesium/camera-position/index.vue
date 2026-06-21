<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;
const info = ref({ heading: "", pitch: "", roll: "", position: "" });

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
  });

  // 定位到上海东方明珠
  const center = Cesium.Cartesian3.fromDegrees(121.499, 31.24, 5000);
  /*
  ● destination：目标坐标位置。通常使用 Cesium.Cartesian3.fromDegrees(经度, 纬度, 高度) 将地理坐标转换为笛卡尔坐标。
  ● orientation：视角方向参数，包含以下三个属性（注意：角度参数需通过 Cesium.Math.toRadians 转换为弧度制）：
    ○ heading：偏航角（水平旋转）。0度表示正北方向，正角度向东旋转。
    ○ pitch：俯仰角（上下旋转）。-90度表示垂直向下俯视地面，0度为水平平视，正角度为仰视。
    ○ roll：翻滚角（左右倾斜）。0度表示水平状态，正角度向右旋转，负角度向左旋转。
  */
  // viewer.camera.setView({
  //   // 指定相机位置
  //   destination: center,
  //   // 指定相机视角
  //   orientation: {
  //     // 指定相机的朝向、偏航角
  //     heading: Cesium.Math.toRadians(0), // 东偏北 45°
  //     // 指定相机的俯仰角、0°是垂直向上、-90°是垂直向下
  //     pitch: Cesium.Math.toRadians(0), // 俯视 30°
  //     // 指定相机的滚转角，翻滚角
  //     roll: 0,
  //   },
  // });
  // fly to
  viewer.camera.flyTo({
    // 指定相机位置
    destination: center,
    // 指定相机视角
    orientation: {
      // 指定相机的朝向、偏航角
      heading: Cesium.Math.toRadians(90), // 正东
      // 指定相机的俯仰角、0°是垂直向上、-90°是垂直向下
      pitch: Cesium.Math.toRadians(-90), // 垂直向下
      // 指定相机的滚转角，翻滚角
      roll: Cesium.Math.toRadians(0), // 水平无倾斜状态
    },
    duration: 10,
    complete: () => {
      console.log("飞行结束");
    },
  });
  // 实时显示相机状态
  // viewer.camera.changed.addEventListener(() => {
  //   const c = viewer!.camera;
  //   info.value = {
  //     heading: `${Cesium.Math.toDegrees(c.heading).toFixed(1)}°`,
  //     pitch: `${Cesium.Math.toDegrees(c.pitch).toFixed(1)}°`,
  //     roll: `${Cesium.Math.toDegrees(c.roll).toFixed(1)}°`,
  //     position: `(${c.position.x.toFixed(0)}, ${c.position.y.toFixed(0)}, ${c.position.z.toFixed(0)})`,
  //   };

  //   viewer!.entities.removeAll();
  //   viewer!.entities.add({
  //     position: c.position,
  //     point: { pixelSize: 8, color: Cesium.Color.RED },
  //   });
  // });

  // 通过按键移动相机
  let moveStep = 50; // 移动步长（米）
  let height = viewer.camera.positionCartographic.height;
  moveStep = height / 100;
  document.addEventListener("keydown", (e) => {
    if (!viewer) return;
    const camera = viewer.camera;

    switch (e.key.toLowerCase()) {
      case "w":
        // 前进（沿相机视线方向水平移动）
        camera.moveForward(moveStep);
        break;
      case "s":
        // 后退
        camera.moveBackward(moveStep);
        break;
      case "a":
        // 左移
        camera.moveLeft(moveStep);
        break;
      case "d":
        // 右移
        camera.moveRight(moveStep);
        break;
      case "q":
        // 上升
        camera.moveUp(moveStep);
        break;
      case "e":
        // 下降
        camera.moveDown(moveStep);
        break;
      default:
        break;
    }
  });
});

onUnmounted(() => viewer?.destroy());
</script>

<template>
  <div class="relative h-full w-full">
    <div ref="containerRef" class="h-full w-full" />
    <div
      class="absolute left-4 top-4 z-10 rounded-2xl bg-white/90 px-4 py-3 text-sm shadow-card backdrop-blur"
    >
      <p class="font-semibold text-[#222]">📷 相机状态（实时）</p>
      <p><span class="text-[#165DFF]">Heading</span> {{ info.heading }}</p>
      <p><span class="text-[#165DFF]">Pitch</span> {{ info.pitch }}</p>
      <p><span class="text-[#165DFF]">Roll</span> {{ info.roll }}</p>
    </div>
  </div>
</template>

<style scoped>
.shadow-card {
  box-shadow:
    rgba(0, 0, 0, 0.02) 0 0 0 1px,
    rgba(0, 0, 0, 0.04) 0 2px 6px,
    rgba(0, 0, 0, 0.1) 0 4px 8px;
}
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
</style>

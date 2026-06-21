<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Cesium from "cesium";

const containerRef = ref<HTMLDivElement>();
let viewer: Cesium.Viewer | null = null;

// 坐标系信息面板数据
const coordInfo = ref({
  longitude: "",
  latitude: "",
  height: "",
  cartesian: "",
  radian: "",
});

onMounted(() => {
  if (!containerRef.value) return;

  viewer = new Cesium.Viewer(containerRef.value, {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
  });

  // 天安门坐标 (WGS84)
  const lon = 116.397;
  const lat = 39.909;
  const alt = 100;

  // === 坐标系转换演示 ===

  // 1. 角度 → 弧度
  const radian = Cesium.Math.toRadians(lon);

  // 2. WGS84 经纬度 → 笛卡尔空间直角坐标 (Cartesian3)
  const cartesian3 = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

  // 3. Cartesian3 → 弧度地理坐标 (Cartographic)
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);

  // 4. 弧度 → 角度
  const degree = Cesium.Math.toDegrees(cartographic.longitude);

  // 显示转换结果
  coordInfo.value = {
    longitude: `${lon}°`,
    latitude: `${lat}°`,
    height: `${alt} m`,
    cartesian: `(${cartesian3.x.toFixed(2)}, ${cartesian3.y.toFixed(2)}, ${cartesian3.z.toFixed(2)})`,
    radian: `${cartographic.longitude.toFixed(6)} rad → ${degree.toFixed(4)}°`,
  };

  // 添加天安门标记点
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lon, lat),
    point: {
      pixelSize: 12,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
    },
    label: {
      text: "天安门 (116.397, 39.909)",
      font: "14px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -24),
    },
  });

  // 飞入视角
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 10000),
    duration: 2,
  });
});

onUnmounted(() => {
  viewer?.destroy();
});
</script>

<template>
  <div class="relative h-full w-full">
    <div ref="containerRef" class="h-full w-full" />

    <!-- 坐标系转换信息面板 -->
    <div
      class="absolute left-4 top-4 z-10 rounded-2xl bg-white/90 px-5 py-4 shadow-card backdrop-blur"
    >
      <h3 class="mb-3 text-base font-semibold text-[#222]">坐标系转换演示</h3>
      <div class="space-y-1.5 text-sm text-[#3f3f3f]">
        <p>
          <span class="font-medium text-[#165DFF]">WGS84 经纬度：</span
          >{{ coordInfo.longitude }} {{ coordInfo.latitude }}
          {{ coordInfo.height }}
        </p>
        <p>
          <span class="font-medium text-[#165DFF]">Cartesian3 (ECEF)：</span
          >{{ coordInfo.cartesian }}
        </p>
        <p>
          <span class="font-medium text-[#165DFF]">弧度转换：</span
          >{{ coordInfo.radian }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-card {
  box-shadow:
    rgba(0, 0, 0, 0.02) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.04) 0px 2px 6px,
    rgba(0, 0, 0, 0.1) 0px 4px 8px;
}
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
</style>

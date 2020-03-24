<template>
  <span
    :style="{background: bgcolor,width:size+'px',height:size+'px',borderRadius:'50%',}"
    class="boxst"
  >
    <svg
      :style="{ width: size+'px',height: size+'px',fill: color}"
      @click.stop="$emit('clickfunc')"
      class="toolicon"
    >
      <slot name="icon" />
    </svg>
  </span>
</template>

<script>
export default {
  name: "musicitem",
  props: { size: null, color: null, bgcolor: null },
  data() {
    return {};
  }
};
</script>


<style>
.boxst {
  padding: 8px;
  margin: 5px;
}
.toolicon {
}
</style>
<template>
  <div>
    <div class="block">
      <span class="demonstration">页数较少时的效果</span>
      <el-pagination layout="prev, pager, next" :total="1000"> </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myPercentage',
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style>
div {
  width: 500px;
}
</style>

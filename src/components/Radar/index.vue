<template>
  <div>
    <div ref="myDiv" class="radar-echart" />
  </div>
</template>

<script>
export default {
  name: 'Radar',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const myChart = this.$echarts.init(this.$refs['myDiv'])
      const option = {
        color: ['rgb(168, 52, 52)', 'rgb(0,0,0)'],
        title: {
          text: '基础雷达图'
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#fff'
          },
          backgroundColor: 'rgba(0,0,0,.5)'
        },
        radar: {
          // shape: 'circle',
          axisName: {
            color: '#fff',
            fontSize: '14',
            backgroundColor: '#999',
            padding: [3, 5]
          },
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ],
          splitArea: {
            areaStyle: {
              color: ['#fff', 'rgba(204,204,204,.3)']
            }
          },
          radius: '80%'
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: [10, 1, 100, 5, 100, 0],
                name: '张三'
              },
              {
                value: [50, 50, 50, 50, 50, 10],
                name: '李四'
              }
            ]
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>

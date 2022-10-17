<script setup>
import * as echarts from 'echarts'
import {onMounted, onUnmounted} from 'vue'
import { ref } from 'vue'

const min = ref(0)
const max = ref(5)
let interval;
function getVirtulData(year) {
  year = year || '2022';
  var date = +echarts.number.parseDate(year + '-01-01');
  var end = +echarts.number.parseDate(+year + 1 + '-01-01');


  var dayTime = 3600 * 24 * 1000;
  var data = [];
  for (var time = date; time < end; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      Math.floor(Math.random() * max.value) + min.value
    ]);
  }
  return data;
}
function getOptions(year) {
  return {
    title: {
      top: 30,
      left: 'center',
      text: 'Daily Commits Count'
    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: max.value,
      type: 'continuous', // 'continuous' 'piecewise'
      orient: 'horizontal',
      left: 'center',
      top: 65,
      inRange: {
        color: ['#ffffff', '#40c463', '#216e39']
      },
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 14],
      range: '2022',
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: {show: false}
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtulData(year),
      animationDelay: function(idx) {
        return idx * 10;
      }
    },
    animationEasing: 'elasticOut',
    animationDelayUpdate: function(idx) {
      return idx * 5;
    }
  };
}


function downloadData() {
  const a = document.createElement('a');
  const script = `
  const process = require("process");
const {exec} = require("child_process");
const util = require("util");
const {existsSync} = require("fs");
const execAsync = util.promisify(exec);

async function createFakeRepoWithCommits() {
    const folderName = "repo";
    if (existsSync(folderName)) {
        await execAsync(\`rm -rf \${folderName}\`);
    }
    await execAsync(\`mkdir \${folderName}\`);
    process.chdir(folderName);
    await execAsync("git init");

    const data = ${JSON.stringify(getVirtulData('2022'))};

    for (datePair of data) {
        const dateFromString = new Date(datePair[0]);
        const dateFormatted = dateFromString.toISOString().split("T")[0];

        const command = \`git commit --allow-empty --date="\${dateFormatted}" -m "commit"\`;
        await execAsync(command);
    }

    console.log('done');
}

createFakeRepoWithCommits();`


  a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(script);
  a.download = 'makeFakeRepo.js';
  a.click();
}

onMounted(() => {
  const chart = echarts.init(document.getElementById('gh-chart'))
  chart.setOption(getOptions('2022'))

  // update chart every 5 seconds
  interval = setInterval(() => {
    chart.setOption(getOptions('2022'))
  }, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="">
    <div class="card  bg-base-100 shadow-xl fixed">
      <div class="card-body">
        <div>
          <p style="font-size: 19px!important;">Sometimes you forget about your personal repository.<br/> And you have to cheat a little bit =)</p>
        </div>
        <div id="gh-chart" style="width: 600px;height:230px;"></div>
        <label for="points">Nax commits per day (between 0 and 10): {{max}}</label>
        <input type="range"  class="range range-secondary" id="points" v-model="max" name="points" min="1" max="10">
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="downloadData">Download NodeJS code =)</button>
          <router-link :to="{name: 'Home'}" class="btn btn-secondary">Home</router-link>
        </div>
        <p>Its a joke of course.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
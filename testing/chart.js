const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config_invitemanager.json');
const moment = require('moment')
const chartjsPluginDatalabels = require('chartjs-plugin-datalabels');

const ChartJS = require('chart.js');
ChartJS.plugins.register({
  beforeDraw: function (chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});

const ChartjsNode = require('chartjs-node');

// 600x600 canvas size
var chartNode = new ChartjsNode(1000, 400);

chartNode.on('beforeDraw', function (Chartjs) {
  Chartjs.pluginService.register(chartjsPluginDatalabels);
});

var Canvas = require('canvas');

let canvas = new Canvas(1000, 400);

var ctx = canvas.getContext('2d');

var gradientStroke = ctx.createLinearGradient(0, 500, 0, 0);
gradientStroke.addColorStop(0, '#FFFFFF');
gradientStroke.addColorStop(1, '#FFFFFF');

var gradientFill = ctx.createLinearGradient(0, 100, 0, 0);
gradientFill.addColorStop(0, "rgba(255, 255, 255, 0)");
gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.3)");


let data = {
  labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
  datasets: [{
    label: "Data",
    borderColor: "black",
    pointBorderColor: "black",
    pointBackgroundColor: "black",
    pointHoverBackgroundColor: "black",
    pointHoverBorderColor: "black",
    pointBorderWidth: 0,
    pointHoverRadius: 0,
    pointHoverBorderWidth: 0,
    pointRadius: 1,
    fill: true,
    borderWidth: 2,
    data: [2000, 2533, 1890, 3400, 4500, 5500, 7500, 2000, 2533, 1890, 3400, 4500, 5500, 7500, 2000, 2533, 1890, 3400, 4500, 5500, 7500],
    datalabels: {
      align: 'end',
      anchor: 'end'
    }
  }]
};
let options = {
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      ticks: {
        display: true,
        fontColor: "black",
        fontStyle: "bold",
        beginAtZero: true,
        maxTicksLimit: 5,
        padding: 20
      },
      gridLines: {
        drawTicks: true,
        display: true
      }

    }],
    xAxes: [{
      gridLines: {
        drawTicks: true,
        display: true
      },
      ticks: {
        display: true,
        padding: 20,
        fontColor: "black",
        fontStyle: "bold"
      }
    }]
  }
};

client.on('ready', () => {
  //client.user.setGame(`on ${client.guilds.size} servers`);
  client.guilds.forEach(g => {
    console.log(g.id, g.name, g.memberCount);
  })
});

client.on('message', message => {
  if (message.author.bot) {
    return;
  }
  if (message.content !== '!chartTestIM') {
    return;
  }
  console.log(message.content);

  message.guild.fetchMembers().then(guild => {
    const ONE_SECOND = 1000;
    const ONE_MINUTE = 60 * ONE_SECOND;
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;
    const ONE_WEEK = 7 * ONE_DAY;
    const ONE_MONTH = 4 * ONE_WEEK;
    const todayTimestamp = new Date().getTime();

    let botCount = guild.members.filter(m => m.user.bot).size;
    let humanCount = guild.memberCount - botCount;
    let offlineCount = guild.members.filter(m => m.presence.status === 'offline').size;
    let joinedToday = guild.members.filter(m => todayTimestamp - m.joinedTimestamp < ONE_DAY).size;
    let joinedThisWeek = guild.members.filter(m => todayTimestamp - m.joinedTimestamp < ONE_WEEK).size;
    let joinedThisMonth = guild.members.filter(m => todayTimestamp - m.joinedTimestamp < ONE_WEEK).size;

    let joins = guild.members.reduce(function (rv, x) {
      (rv[moment(x['joinedTimestamp']).startOf('day').format('DD.MM.YYYY')] = rv[moment(x['joinedTimestamp']).startOf('day').format('DD.MM.YYYY')] || []).push(x);
      return rv;
    }, {});

    console.log(joins);
    let labels = [];
    let dataPoints = [];
    let memberTemp = 0;
    joins = joins.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    for (var key in joins) {
      if (joins.hasOwnProperty(key)) {
        labels.push(key);
        memberTemp += joins[key].length;
        dataPoints.push(memberTemp);
      }
    }

    data.labels = labels;
    data.datasets[0].data = dataPoints;

    console.log(data.datasets[0].data);

    return chartNode.drawChart({
      type: 'line',
      data: data,
      options: options
    })
      .then(() => {
        // chart is created

        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
      })
      .then(buffer => {

        const embed = new Discord.RichEmbed()
          .setTitle("User Growth")
          /*
           * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
           */
          .setColor(0x00AE86)
          .setDescription("This is the main body of text, it can hold 2048 characters.")
          .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
          .setImage("attachment://chart.png")
          .setTimestamp()
          .attachFile({
            attachment: buffer,
            name: 'chart.png'
          });

        message.channel.send({
          embed
        }).then(() => {
          chartNode.destroy();
        });
      })
      .then(() => {
        // chart is now written to the file path
        // ./testimage.png
      });

  }).catch(console.error);


});

client.login(config.discordToken);
const chartjsPluginDatalabels = require('chartjs-plugin-datalabels');
const chartjsNode = require('chartjs-node');

import chartJs from 'chart.js';

chartJs.plugins.register({
	beforeDraw: function (chartInstance: any) {
		var localCtx = chartInstance.chart.ctx;
		localCtx.fillStyle = 'white';
		localCtx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
	}
});

var chartNode = new chartjsNode(1000, 400);

chartNode.on('beforeDraw', function (chartjs: any) {
	chartjs.pluginService.register(chartjsPluginDatalabels);
});

var canvas = require('canvas');

let myCanvas = new canvas(1000, 400);

var ctx = myCanvas.getContext('2d');

var gradientStroke = ctx.createLinearGradient(0, 500, 0, 0);
gradientStroke.addColorStop(0, '#FFFFFF');
gradientStroke.addColorStop(1, '#FFFFFF');

var gradientFill = ctx.createLinearGradient(0, 100, 0, 0);
gradientFill.addColorStop(0, 'rgba(255, 255, 255, 0)');
gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

export class Chart {
	private options: any = {
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
					fontColor: 'black',
					fontStyle: 'bold',
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
					fontColor: 'black',
					fontStyle: 'bold'
				}
			}]
		}
	};

	public getChart(type: string, data: any) {
		return chartNode.drawChart({
			type: type,
			data: data,
			options: this.options
		}).then(() => {
			// Chart is created
			// Get image as png buffer
			return chartNode.getImageBuffer('image/png');
		});
	}
}

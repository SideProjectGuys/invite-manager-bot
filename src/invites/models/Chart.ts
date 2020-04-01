import { CanvasRenderService } from 'chartjs-node-canvas';
import chartjsPluginDatalabels from 'chartjs-plugin-datalabels';

const bigCanvasRenderService = new CanvasRenderService(1000, 400, (chartJS) => {
	chartJS.pluginService.register(chartjsPluginDatalabels);

	chartJS.plugins.register({
		beforeDraw: function (chartInstance: any) {
			const localCtx = chartInstance.chart.ctx;
			localCtx.fillStyle = 'white';
			localCtx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
		}
	});
});

const options = {
	maintainAspectRatio: false,
	animation: {
		duration: 0
	},
	legend: {
		display: false
	},
	scales: {
		yAxes: [
			{
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
			}
		],
		xAxes: [
			{
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
			}
		]
	},
	plugins: {
		datalabels: {
			display: function (context: { dataIndex: number; dataset: any }) {
				// Always show first and last value
				if (context.dataIndex === 0 || context.dataIndex === context.dataset.data.length - 1) {
					return true;
				}
				// Show value if either previous or next value is
				// different and if the value is not zero
				return (
					context.dataset.data[context.dataIndex] !== 0 &&
					(context.dataset.data[context.dataIndex] !== context.dataset.data[context.dataIndex - 1] ||
						context.dataset.data[context.dataIndex] !== context.dataset.data[context.dataIndex + 1])
				);
			}
		}
	}
};

export const renderChart = (type: string, data: any) => bigCanvasRenderService.renderToBuffer({ type, data, options });

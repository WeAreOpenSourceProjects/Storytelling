
import { PieChartComponent, AdvancedPieChartComponent, BarChartComponent, ForceDirectedGraphComponent, GaugeChartComponent,
  HierarchicalEdgeBundlingComponent, PieGridChartComponent, LineChartComponent, DendogramComponent, NgGraphComponent, TreemapChartComponent
}  from "app/charts";


function createChartType({title, ...obj}) {
  return {
    title,
    name: titleToName(title),
    dimLabels: ['Group by', 'Name', 'Value', null],
    ...obj
  };

  function titleToName(s: string) {
    return s.toLowerCase().replace(/\ /g, '-');
  }
}


export const chartTypes = [
  createChartType({ title: 'Bar Chart', simpleData: true, cmpName: 'barChart', convertData: BarChartComponent.convertData , dimLabels: ['Name', 'Value', null] }),
  createChartType({ title: 'Pie Chart', simpleData: true, cmpName: 'pieChart', convertData: PieChartComponent.convertData , dimLabels: ['Name', 'Value', null] }),
  createChartType({ title: 'Pie Grid Chart', simpleData: true, cmpName: 'pieGridChart', convertData: PieGridChartComponent.convertData, dimLabels: ['Name', 'Value', null] }),
  createChartType({ title: 'Bar Vertical 2D', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Horizontal 2D', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Vertical Stacked', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Vertical Normalized', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Horizontal Normalized', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Polar Chart', convertData: NgGraphComponent.convertData, dimLabels: ['Group by', 'Angle Values', 'Radius Values', null] }),
  createChartType({ title: 'Line Chart', convertData: NgGraphComponent.convertData, dimLabels: ['Group by', 'x-Values', 'y-Values', null] }),
  createChartType({ title: 'Heat Map', convertData: NgGraphComponent.convertData, dimLabels: ['x-Category', 'y-Category', 'Color', null] }),
  createChartType({ title: 'Bubble Chart', convertData: NgGraphComponent.convertData, dimLabels: ['GroupBy', 'x-Values', 'y-Values', 'Radius'] }),

  createChartType({ title: 'Number Cards',simpleData: true, convertData: NgGraphComponent.convertSingleData, dimLabels: ['Card Name', 'Card Values','Color',null ] }),

  createChartType({ title: 'Treemap', simpleData: true, cmpName: 'treemapChart', convertData: TreemapChartComponent.convertData, dimLabels: ['GroupBy', 'Sum of values', null, null] })

];

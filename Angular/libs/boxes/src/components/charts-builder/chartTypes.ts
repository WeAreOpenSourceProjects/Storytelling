import {
  PieChartComponent,
  AdvancedPieChartComponent,
  BarChartComponent,
  ForceDirectedGraphComponent,
  GaugeChartComponent,
  HierarchicalEdgeBundlingComponent,
  PieGridChartComponent,
  LineChartComponent,
  DendogramComponent,
  NgGraphComponent,
  TreemapChartComponent,
  AreaChartComponent,
  BubbleChartComponent,
  ZoomableTreemapChartComponent,
  SunburstChartComponent,
  WordCloudComponent,
  NumberCardComponent
} from '@labdat/charts';

function createChartType({ title, ...obj }) {
  return {
    title,
    name: titleToName(title),
    dimLabels: [{ column: 'Group by', maxSize: 1 }, { column: 'Name', maxSize: 1 }, { column: 'Value', maxSize: 1 }],
    ...obj
  };

  function titleToName(s: string) {
    return s.toLowerCase().replace(/\ /g, '-');
  }
}

export const chartTypes = [
  createChartType({
    title: 'Bar Chart',
    simpleData: true,
    cmpName: 'barChart',
    convertData: BarChartComponent.convertData,
    dimLabels: [
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A chart that presents grouped data with rectangular bars, with heights proportional to the values that they represent.',
    categorie: 'Comparison',
    dimExemple: [['country'], ['pop']],
    image: 'assets/img-graph/barChart.png'
  }),
  createChartType({
    title: 'Pie Chart',
    simpleData: true,
    cmpName: 'pieChart',
    convertData: PieChartComponent.convertData,
    dimLabels: [
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A circular statistical graphic which is divided into slices to illustrate numerical proportion.',
    categorie: 'Comparison',
    dimExemple: [['country'], ['pop']],
    image: 'assets/img-graph/pieChart.png'
  }),
  createChartType({
    title: 'Number Cards',
    simpleData: true,
    cmpName: 'numberCard',
    convertData: NumberCardComponent.convertData,
    dimLabels: [
      { column: 'Card Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Card Value', maxSize: 1, dataType: ['string', 'number'] }
    ],
    description: 'A chart that displays values in aligned squares.',
    dimExemple: [['country'], ['pop']],
    categorie: 'Comparison',
    image: 'assets/img-graph/numberCards.png'
  }),
  createChartType({
    title: 'Dendogram',
    simpleData: true,
    cmpName: 'dendogram',
    convertData: DendogramComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A tree-like diagram used to represent the distribution of a non-weighted hierarchical clustering.',
    categorie: 'Hierarchy',
    dimExemple: [['continent', 'country'], ['pop']],
    image: 'assets/img-graph/dendogram.png'
  }),
  createChartType({
    title: 'Sunburst',
    simpleData: true,
    cmpName: 'sunburstChart',
    convertData: SunburstChartComponent.convertData,
    dimLabels: [
      { column: 'Hierarchy', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A chart used to visualize hierarchical data. Click to zoom to the next level. Click on the center to zoom out.',
    categorie: 'Hierarchy',
    dimExemple: [['continent', 'country', 'year', 'lifeExp'], ['pop']],
    image: 'assets/img-graph/sunburst.gif'
  }),
  createChartType({
    title: 'Circular Charts Grid',
    simpleData: true,
    cmpName: 'pieGridChart',
    convertData: PieGridChartComponent.convertData,
    dimLabels: [
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A data representation that displays a grid of circular progress charts, ' +
    'where each value is represented by the progress percentage of its chart.',
    categorie: 'Comparison',
    dimExemple: [['country'], ['pop']],
    image: 'assets/img-graph/circularChartGrid.png'
  }),
  createChartType({
    title: 'Force Layout Bubble',
    simpleData: true,
    cmpName: 'bubbleChart',
    convertData: BubbleChartComponent.convertData,
    dimLabels: [
      { column: 'category', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Label', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] },
      { column: 'Description', maxSize: 1, dataType: ['string', 'number'] }
    ],
    description: 'A chart where the value is represented by the size of the bubbles, and the category by their color.',
    categorie: 'Dispersion',
    dimExemple: [['continent'], ['country'], ['pop'], ['year']],
    image: 'assets/img-graph/forceLayoutBubble.png'
  }),
  createChartType({
    title: 'Force Directed Graph',
    simpleData: true,
    cmpName: 'ForceDirectedGraph',
    convertData: ForceDirectedGraphComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A tree of bubbles where the value is represented by the size of the points. Each node is the sum of its leaves. ' +
      'It is used to represent hierarchies, and to compare values by showing proportion between elements.',
    categorie: 'Hierarchy',
    dimExemple: [['country', 'year'], ['pop']],
    image: 'assets/img-graph/forceDirectedGraph.png'
  }),
  createChartType({
    title: 'Treemap',
    simpleData: true,
    cmpName: 'treemapChart',
    convertData: TreemapChartComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A space filling visualization of data hierarchies and proportion between elements.',
    categorie: 'Hierarchy',
    dimExemple: [['country'], ['pop']],
    image: 'assets/img-graph/treemap.png'
  }),
  createChartType({
    title: 'Zoomable Treemap',
    simpleData: true,
    cmpName: 'zoomableTreemapChart',
    convertData: ZoomableTreemapChartComponent.convertData,
    dimLabels: [
      { column: 'Hierarchy', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A zoomable space filling visualization of data hierarchies and proportion between elements. ' + 
      'Click on a rectangle to zoom in and zoom out.',
    categorie: 'Hierarchy',
    dimExemple: [['continent', 'country'], ['pop']],
    image: 'assets/img-graph/treemapZoomable.gif'
  }),
  createChartType({
    title: 'Vertical Grouped Bar Chart',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A vertical bar chart where the bars are color-coded to represent a particular grouping.',
    categorie: 'Dispersion',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/barGroupedVertical.png'
  }),
  createChartType({
    title: 'Horizontal Grouped Bar Chart',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A horizontal bar chart where the bars are color-coded to represent a particular grouping.',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/barGroupedHorizontal.png'
  }),
  createChartType({
    title: 'Stacked Bar Chart',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A bar chart where the bars that correspond to a same group are stacked on top of each other. The height of the resulting bar shows the combined result of the group.',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/barStackedVertical.png'
  }),
  createChartType({
    title: 'Vertical Normalized Bar Chart',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A vertical bar chart where the bars that correspond to a same group are stacked on top of each other. ' +
    'The heights of the resulting bars are normalized, to visualize the proportion of each bar in its group and enable comparaisons between groups.',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/barNormalizedVertical.png'
  }),
  createChartType({
    title: 'Horizontal Normalized Bar Chart',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A horizontal bar chart where the bars that correspond to a same group are stacked on top of each other. ' +
    'The heights of the resulting bars are normalized, to visualize the proportion of each bar in its group and enable comparaisons between groups.',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/barNormalizedHorizontal.png'
  }),
  createChartType({
    title: 'Heat Map',
    cmpName: 'ngGraph',
    convertData: NgGraphComponent.convertData,
    dimLabels: [
      { column: 'x-Category', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'y-Category', maxSize: 1, dataType: ['number'] },
      { column: 'Color', maxSize: 1, dataType: ['string', 'number'] }
    ],
    description: 'A graphical representation of data where the individual values contained in a matrix are represented as colors.',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/heatMap.png'
  }),
  createChartType({
    title: 'Bubble Chart',
    cmpName: 'ngGraph',
    convertData: NgGraphComponent.convertData,
    dimLabels: [
      { column: 'GroupBy', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'x-Values', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'y-Values', maxSize: 1, dataType: ['number'] },
      { column: 'Radius', maxSize: 1, dataType: ['string', 'number'] }
    ],
    description: 'A two-dimensional scatterplot where a third variable is represented by the size of the points, that can be configured for multiple axes.',
    categorie: 'Dispersion',
    dimExemple: [['continent'], ['pop'], ['year'], ['gdpPercap']],
    image: 'assets/img-graph/bubbleChart.png'
  }),
  createChartType({
    title: 'Word Cloud Chart',
    simpleData: true,
    cmpName: 'wordCloud',
    convertData: WordCloudComponent.convertData,
    dimLabels: [
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A visual representation of text data, typically used to depict keyword metadata (tags) on websites, or to visualize free form text.',
    categorie: 'Comparison',
    dimExemple:  [['country'], ['pop']],
    image: 'assets/img-graph/wordCloudChart.png'
  }),
  createChartType({
    title: 'Advanced Pie Chart',
    simpleData: true,
    cmpName: 'AdvancedPieChart',
    convertData: AdvancedPieChartComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A pie chart with additional information displayed on the right.',
    categorie: 'Comparison',
    dimExemple:  [['country'], ['pop']],
    image: 'assets/img-graph/advancedPieChart.png'
  }),
  createChartType({
    title: 'Gauge Chart',
    simpleData: true,
    cmpName: 'GaugeChart',
    convertData: GaugeChartComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A chart where information is displayed as overlayed readings on a dial.',
    categorie: 'Comparison',
    dimExemple:  [['country'], ['pop']],
    image: 'assets/img-graph/gaugeChart.png'
  }),
  createChartType({
    title: 'Area Chart',
    simpleData: true,
    cmpName: 'areaChart',
    convertData: AreaChartComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'x-Values', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'y-Values', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A chart based on the line chart, where the area between axis and line is emphasized with colors. ' +
      'It is commonly used to compare cumulated totals over time.',
    categorie: 'Comparison',
    dimExemple: [['year'], ['country'], ['pop']],
    image: 'assets/img-graph/areaChart.png'
  }),
  createChartType({
    title: 'Polar Chart',
    cmpName: 'ngGraph',
    convertData: NgGraphComponent.convertData,
    dimLabels: [
      { column: 'Group by', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Angle Values', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Radius Values', maxSize: 1, dataType: ['number'] }
    ],
    description: 'A two-dimensional chart where values are represented by the polar coordinates (angle and radius) of the point.',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/polarChart.png'
  }),
  createChartType({
    title: 'Line Chart',
    cmpName: 'ngGraph',
    convertData: NgGraphComponent.convertData,
    dimLabels: [
      { column: 'GroupBy', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'x-Values', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'y-Values', maxSize: 1, dataType: ['string', 'number'] }
    ],
    description:
      'A chart which displays information as a series of data points connected by straight line segments, that can be configured for multiple axes',
    categorie: 'Comparison',
    dimExemple: [['continent'], ['year'], ['pop']],
    image: 'assets/img-graph/lineChart.png'
  }),
  createChartType({
    title: 'Zoomable Line Chart',
    simpleData: true,
    cmpName: 'lineChart',
    convertData: LineChartComponent.convertData,
    dimLabels: [
      { column: 'Series', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'xAxis', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'yAxis', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A chart which displays information as a series of data points connected by straight line segments, that can be dynamically zoomed.',
    categorie: 'Comparison',
    dimExemple: [['year'], ['country'], ['pop']],
    image: 'assets/img-graph/lineChartZoomable.png'
  })
];

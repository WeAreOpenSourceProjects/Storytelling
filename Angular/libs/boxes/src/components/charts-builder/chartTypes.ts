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
    title: 'Number Cards',
    simpleData: true,
    cmpName: 'numberCard',
    convertData: NumberCardComponent.convertData,
    dimLabels: [
      { column: 'Card Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Card Value', maxSize: 1, dataType: ['string', 'number'] }
    ],
    description: '',
    dimExemple: {'contries' :[['country'], ['pop']], 'Orchestra':[['Orchestra type'], ['Number']], 'movies':[["Movie"],["Rating IMDB"]]},
    categorie: 'Comparison',
    image: 'assets/img-graph/numberCards.png'
  }),
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
      'A bar chart or bar graph is a chart or graph that presents grouped data with rectangular bars with heights proportional to the values that they represent.',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['country'], ['pop']], 'Orchestra':[['Orchestra type'], ['Number']], 'movies':[["Movie"],["Rating IMDB"]]},
    image: 'assets/img-graph/barChart.jpg'
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
      'A pie chart (or a circle chart) is a circular statistical graphic which is divided into slices to illustrate numerical proportion.',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['country'], ['pop']]},
    image: 'assets/img-graph/pieChart.png'
  }),
  // createChartType({
  //   title: 'Word Cloud Chart',
  //   simpleData: true,
  //   cmpName: 'wordCloud',
  //   convertData: WordCloudComponent.convertData,
  //   dimLabels: [
  //     { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
  //     { column: 'Value', maxSize: 1, dataType: ['number'] }
  //   ],
  //   description:
  //     'A word cloud chart is a visual representation of text data, typically used to depict keyword metadata (tags) on websites, or to visualize free form text.',
  //   categorie: 'Comparison',
  //   dimExemple: {'contries' :[['country'], ['pop']], 'Orchestra':[['Orchestra type'], ['Number']], 'movies':[["Movie"],["Rating IMDB"]]},
  //   image: 'assets/img-graph/wordCloud-chart.jpg'
  // }),
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
      'Dendrograms are tree-like diagrams used to represent the distribution of a hierarchical clustering.' +
      ' The different depth levels represented by each node are visualized on the horizontal axes and it is useful to visualize a non-weighted hierarchy.',
    categorie: 'Hierarchy',
    dimExemple: {'contries' :[['continent', 'country'], ['pop']]},

    image: 'assets/img-graph/dendogram.jpg'
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
      'Treemaps for visualizing hierarchical data. Click to zoom to the next level. Click on the top orange band to zoom out.',
    categorie: 'Hierarchy',
    dimExemple: {'contries' :[['continent', 'country'], ['pop']]},
    image: 'assets/img-graph/zoomableTreemap.gif'
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
      'Sunburst for visualizing hierarchical data. Click to zoom to the next level. Click on the center to zoom out.',
    categorie: 'Hierarchy',
    dimExemple: {'contries' :[['continent', 'country', 'year', 'lifeExp'], ['pop']]},
    image: 'assets/img-graph/sunburst.gif'
  }),
  createChartType({
    title: 'Pie Grid Chart',
    simpleData: true,
    cmpName: 'pieGridChart',
    convertData: PieGridChartComponent.convertData,
    dimLabels: [
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: '',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['country'], ['pop']]},
    image: 'assets/img-graph/pieGridChart.jpg'
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
    description: '',
    categorie: 'Dispersion',
    dimExemple: {'contries' :[['continent'], ['country'], ['pop'], ['year']]},
    image: 'assets/img-graph/ForceLayoutBubble.jpg'
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
      'Nested circles allow to represent hierarchies and compare values.' +
      ' This visualization is particularly effective to show the proportion between elements through their areas and their position inside a hierarchical structure. ',
    categorie: 'Hierarchy',
    dimExemple: {'contries' :[['country','year'], ['pop']]},
    image: 'assets/img-graph/ForceDirectedGraph.jpg'
  }),
  createChartType({
    title: 'Bar Vertical 2D',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'Bar Vertical 2D is a bar chart with vertical representation of data',
    categorie: 'Dispersion',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/barVertical2D.jpg'
  }),
  createChartType({
    title: 'Bar Horizontal 2D',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: 'Bar Horizontal 2D is a bar chart with horizontal representation of data',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/barHorizontal2D.jpg'
  }),
  createChartType({
    title: 'Bar Vertical Stacked',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: '',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/barverticalStacked.jpg'
  }),
  createChartType({
    title: 'Bar Vertical Normalized',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: '',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/barVerticalNormalized.jpg'
  }),
  createChartType({
    title: 'Bar Horizontal Normalized',
    convertData: NgGraphComponent.convertData,
    cmpName: 'ngGraph',
    dimLabels: [
      { column: 'Group by', maxSize: 10, dataType: ['string', 'number'] },
      { column: 'Name', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'Value', maxSize: 1, dataType: ['number'] }
    ],
    description: '',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/BarHorizontalNormalize.jpg'
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
    description: '',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/polarChart.jpg'
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
      'Is an interactive line chart that can be configured for multiple axes. ' +
      'The multi-axis line chart is a special type of chart that allows multiple y-axes to be rendered in the same chart. ' +
      'The advantage of using a multi-axis line chart is that you can plot multiple data sets with different types of units and different scale ranges  on the same chart.',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/line-chart.jpg'
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
    description: '',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['continent'], ['year'], ['pop']]},
    image: 'assets/img-graph/heatMap.jpg'
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
    description: '',
    categorie: 'Dispersion',
    dimExemple: {'contries' :[['continent'], ['pop'], ['year'], ['gdpPercap']]},
    image: 'assets/img-graph/bubbleChart.jpg'
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
      'A space filling visualization of data hierarchies and proportion between elements.' +
      "The different hierarchical levels create visual clusters through the subdivision into rectangles proportionally to each element's value." +
      ' Treemaps are useful to represent the different proportion of nested hierarchical data structures.',
    categorie: 'Hierarchy',
    dimExemple: {'contries' :[['country'], ['pop']]},
    image: 'assets/img-graph/treemap.jpg'
  }),
  // createChartType({
  //   title: 'Advanced Pie Chart',
  //   simpleData: true,
  //   cmpName: 'AdvancedPieChart',
  //   convertData: AdvancedPieChartComponent.convertData,
  //   dimLabels: [
  //     { column: 'Group by', maxSize: 1, dataType: ['string', 'number'] },
  //     { column: 'Value', maxSize: 1, dataType: ['number'] }
  //   ],
  //   description: 'Adevenced pie chart is similar to the pie chart, with more details showing on the right of the pie',
  //   categorie: 'Comparison',
  //   dimExemple: {'contries' :[['country'], ['pop']], 'Orchestra':[['Orchestra type'], ['Number']], 'movies':[["Movie"],["Rating IMDB"]]},
  //   image: 'assets/img-graph/advencedPie-chart.jpg'
  // }),
  // createChartType({
  //   title: 'Gauge Chart',
  //   simpleData: true,
  //   cmpName: 'GaugeChart',
  //   convertData: GaugeChartComponent.convertData,
  //   dimLabels: [
  //     { column: 'Group by', maxSize: 1, dataType: ['string', 'number'] },
  //     { column: 'Value', maxSize: 1, dataType: ['number'] }
  //   ],
  //   description:
  //     'Gauge charts, also known as dial charts or speedometer charts, use needles to show information as a reading on a dial.' +
  //     'This chart type is often used in executive dashboard reports to show key business indicators.' +
  //     'Gauge charts are useful for comparing values between a small number of variables either by using multiple needles on the same gauge or by using multiple gauges.',
  //   categorie: 'Comparison',
  //   dimExemple: {'contries' :[['country'], ['pop']], 'Orchestra':[['Orchestra type'], ['Number']], 'movies':[["Movie"],["Rating IMDB"]]},
  //   image: 'assets/img-graph/gauge-chart.jpg'
  // }),
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
      'A small multiple is a series of small similar graphics or charts, allowing them to be easily compared',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['year'], ['country'], ['pop']]},
    image: 'assets/img-graph/areaChart.jpg'
  }),
  createChartType({
    title: 'Line Chart d3',
    simpleData: true,
    cmpName: 'lineChart',
    convertData: LineChartComponent.convertData,
    dimLabels: [
      { column: 'Series', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'xAxis', maxSize: 1, dataType: ['string', 'number'] },
      { column: 'yAxis', maxSize: 1, dataType: ['number'] }
    ],
    description:
      'A line chart or line graph is a type of chart which displays information as a series of data points called "markers" connected by straight line segments.',
    categorie: 'Comparison',
    dimExemple: {'contries' :[['year'], ['country'], ['pop']]},
    image: 'assets/img-graph/lineChartD3.png'
  })
];

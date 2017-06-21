import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-try-samples',
  templateUrl: './try-samples.component.html',
  styleUrls: ['./try-samples.component.scss']
})
export class TrySamplesComponent implements OnInit {
  charts = [{
    name : "bar chart",
    description :'A bar chart or bar graph is a chart or graph that presents grouped data with rectangular bars with heights proportional to the values that they represent.',
    categorie : "Comparison",
    image :"assets/img-graph/bar-chart.png"
  },
    {
      name : "Pie chart",
      description :'A pie chart (or a circle chart) is a circular statistical graphic which is divided into slices to illustrate numerical proportion.',
      categorie : "Comparison",
      image :"assets/img-graph/pie-chart.png"
    },
    {
      name : "Hierarchical Edge Bundling",
      description :'Show dependencies between classes in a software class hierarchy. Dependencies are bundled according to the parent packages',
      categorie : "hierarchy",
      image :"assets/img-graph/HierarchicalEdgeBundling-chart.png"
    },
    {
      name : "Line chart",
      description :'Is an interactive line chart that can be configured for multiple axes. ' +
      'The multi-axis line chart is a special type of chart that allows multiple y-axes to be rendered in the same chart. ' +
      'The advantage of using a multi-axis line chart is that you can plot multiple data sets with different types of units and different scale ranges  on the same chart.',
      categorie : "Comparison",
      image :"assets/img-graph/line-chart.png"
    },
    {
      name : "Zoomable sunburst ",
      description :'A sunburst is similar to the treemap, except it uses a radial layout. ' +
      'The root node of the tree is at the center, ' +
      'with leaves on the circumference. The area (or angle, depending on implementation) of each arc corresponds to its value.',
      categorie : "Hierarchy",
      image :"assets/img-graph/sunburst-chart.gif"
    },
    {
      name : "Treemap chart",
      description :'A space filling visualization of data hierarchies and proportion between elements.' +
      'The different hierarchical levels create visual clusters through the subdivision into rectangles proportionally to each element\'s value.' +
      ' Treemaps are useful to represent the different proportion of nested hierarchical data structures.',
      categorie : "Hierarchy",
      image :"assets/img-graph/treempa-chart.png"
    },
    {
      name : "Adevenced pie chart",
      description :'Adevenced pie chart is similar to the pie chart, with more details showing on the right of the pie',
      categorie : "Comparison",
      image :"assets/img-graph/advencedPie-chart.png"
    },
    {
      name : "Dendogram chart",
      description :'Dendrograms are tree-like diagrams used to represent the distribution of a hierarchical clustering.' +
      ' The different depth levels represented by each node are visualized on the horizontal axes and it is useful to visualize a non-weighted hierarchy.',
      categorie : "Hierarchy",
      image :"assets/img-graph/dendogram.png"
    },
    {
      name : "Force Directed graph",
      description :'Nested circles allow to represent hierarchies and compare values.' +
      ' This visualization is particularly effective to show the proportion between elements through their areas and their position inside a hierarchical structure. ',
      categorie : "Hierarchy",
      image :"assets/img-graph/forceDirectedGraph.png"
    },
    {
      name : "Gauge chart",
      description :'Gauge charts, also known as dial charts or speedometer charts, use needles to show information as a reading on a dial.' +
      'This chart type is often used in executive dashboard reports to show key business indicators.' +
      'Gauge charts are useful for comparing values between a small number of variables either by using multiple needles on the same gauge or by using multiple gauges.',
      categorie : "Comparison",
      image :"assets/img-graph/gauge-chart.png"
    }];
  chartSlected ={};
  constructor(public dialogRef: MdDialogRef<TrySamplesComponent>) { }

  ngOnInit() {
    this.chartSlected = this.charts[2];
  }


}

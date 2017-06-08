import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from "lodash";

import { Chart } from '../chart.class';

@Component({
    selector: 'app-sunburst-chart',
    templateUrl: './sunburst-chart.component.html',
    styleUrls: ['./sunburst-chart.component.scss']
})
export class SunburstChartComponent extends Chart implements OnInit {
    @ViewChild('chart') private chartContainer: ElementRef;
    private data: any;
    private curtain: any; //for animation
    private margin: any = {top: 20, bottom: 20, left: 20, right: 20};
    private chart: any;
    private width: number;
    private height: number;
    private totalSize: number = 0; // Total size of all segments; we set this later, after loading the data.
    private colorScale: any
    private explanationHeight: number;
    private explanationWidth: number;
    private b = {
        w: 55, h: 30, s: 3, t: 10 // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    };
    private stringsLength: Array<number>; // Array of the strings size inside the trail
    private arc: any;
    private xScale: any;
    private yScale: any;
    private radius: any;
    private formatNumber: any

    constructor() {
        super()
    }

    ngOnInit() {
        // Set data
        (this.dataInput.length == 0) ? this.data = sample[0] : this.data = this.dataInput[0];

        this.init();
    }

    setData(data) {
        (data.length == 0) ? this.data = sample[0] : this.data = data[0];
    }

    init() {
        // Set size of the svg
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

        this.formatNumber = d3.format(",d");
        this.radius = Math.min(this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom) / 2;
        this.xScale = d3.scaleLinear().range([0, 2 * Math.PI]);
        this.yScale = d3.scaleSqrt().range([0, this.radius]);
        d3.select(element).select('#sequence')
            .select('svg')
            .style('opacity',0);

        // Set colors of the sections
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory20);

        // Position of the Explanation label in the center of the sunburst
        let explanationElmnt = d3.select(element).select('#explanation').node() as HTMLElement;
        this.explanationWidth = explanationElmnt.offsetWidth;
        this.explanationHeight = explanationElmnt.offsetHeight;

        let partition = d3.partition();

        this.arc = d3.arc()
            .startAngle((d: any) => {
                return Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x0)));
            })
            .endAngle((d: any) => {
                return Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x1)));
            })
            .innerRadius((d: any) => {
                return Math.max(0, this.yScale(d.y0));
            })
            .outerRadius((d: any) => {
                return Math.max(0, this.yScale(d.y1));
            });

        // Basic setup of page elements
        this.initializeBreadcrumbTrail(element, this.radius);

        this.chart = d3.select(element).append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr("id", "sunBurstSvg")
            .append("g")
            .attr("id", "container")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        // Turn the data into a d3 hierarchy and calculate the sums.
        let root = d3.hierarchy(this.data)
            .sum((d: any) => d.size)
            .sort((a, b) => b.value - a.value);

        let nodes = partition(root)
            .descendants();

        let path = this.chart.data([this.data]).selectAll("path")
            .data(nodes)
            .enter().append("path")
            .attr("d", this.arc)
            .attr("fill-rule", "evenodd")
            .style("fill", d => this.colorScale(d.data.name))
            .style("opacity", 1)
            .on("mouseover", d => this.mouseover(d, this, element))
            .on("click", d => this.zoom(d, this));

        // Add the mouseleave handler to the bounding circle.
        d3.select(element).select("#container").on("mouseleave", d => this.mouseleave(d, this, element));

        // Get total size of the tree = value of root node from partition.
        this.totalSize = path.datum().value;

        /* Add 'curtain' rectangle to hide entire graph */
        this.curtain = d3.select(element).select('#sunBurstSvg')
            .append("g")
            .append('rect')
            .attr('x', -1 * this.width)
            .attr('y', -1 * this.height)
            .attr('height', this.height)
            .attr('width', 0)
            .attr('class', 'curtain')
            .attr('transform', 'rotate(180)')
            .style('fill', '#fafafa')
    }

    // Basic setup of page elements.
    private initializeBreadcrumbTrail(element, radius) {
        // Add the svg area.
        d3.select(element).select("#sequence").append("svg")
            .attr("height", 50)
            .attr("id", "trail")
            .style("width", 'auto');

        // Place the breadcrumb trail lower
        d3.select(element).select('#sequence')
            .select('svg')
            .attr("transform", d => "translate(0," + this.explanationHeight / 2 + ")");
    }

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    private mouseover(d, thisClass, element) {
        let percentage = Number((100 * d.value / thisClass.totalSize).toPrecision(3));
        let value = thisClass.formatNumber(d.value);
        let percentageString = `${percentage}%`;

        if (percentage < 0.1) {
            percentageString = "< 0.1%";
        }

        // Update of the percentage of the explanation
        d3.select(element).select("#percentage")
            .text(percentageString);

        // Update of the percentage of the explanation
        d3.select(element).select("#value")
            .text(value);

        let sequenceArray = d.ancestors().reverse();
        thisClass.updateBreadcrumbs(sequenceArray, percentageString, thisClass, element); // Update of the breadcrumb trail

        // Fade all the segments.
        thisClass.chart.selectAll("path")
            .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        thisClass.chart.selectAll("path")
            .filter(function (node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    private updateBreadcrumbs(nodeArray, percentageString, thisClass, element) {
        thisClass.stringsLength = [];

        // Data join; key function combines name and depth (= position in sequence).
        let trail = d3.select(element).select("#trail")
            .selectAll("g")
            .data(nodeArray, (d: any) => d.data.name + d.depth);

        // Remove exiting nodes.
        trail.exit().remove();

        // Add breadcrumb and label for entering nodes.
        let entering = trail.enter().append("g");

        // Dynamic size ot trail
        // 1. We draw the text of each section of the trail
        entering.append("text")
            .attr("y", thisClass.b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.data.name;
            })
            .each(function (d) {
                let stringLength = (<SVGTextContentElement>this).getComputedTextLength();
                d3.select(this).attr("x", () => ( thisClass.b.w + stringLength + thisClass.b.t) / 2);

            });

        // 2. We calculate the effective size ot these texts
        d3.select(element).select('#trail').selectAll('g').select('text').each(function (d) {
            let stringLength = (<SVGTextContentElement>this).getComputedTextLength();
            thisClass.stringsLength.push(stringLength);
        });

        // 3. We draw the polygons adapted to the text size
        entering.append("polygon")
            .attr("points", (d, i) => thisClass.breadcrumbPoints(d, i, this, thisClass, thisClass.stringsLength[i]))
            .style("fill", d => thisClass.colorScale(d.data.name))
            .each(function () {
                // 4. We place polygons back of the texts
                let firstChild = (<Node>this).parentNode.firstChild;

                if (firstChild) {
                    (<Node>this).parentNode.insertBefore(<Node>this, firstChild);
                }
            });

        // Merge enter and update selections; set position for all nodes and we calculate the size of the sequence
        let translation = 0; // Translation of each polygon
        let SequenceTotalSize = 0; // Total size of the trail

        entering.merge(trail).attr("transform", (d, i) => {
            translation += ((i == 0) ? 0 : (thisClass.b.w + thisClass.b.s + thisClass.stringsLength[i - 1]));
            SequenceTotalSize += thisClass.b.w + thisClass.stringsLength[i] + thisClass.b.t;

            return "translate(" + translation + ", 0)";
        });

        // Position of the sequence
        d3.select(element).select('#sequence')
            .select('svg')
            .attr("transform", d => "translate(" + ((thisClass.width  - SequenceTotalSize - thisClass.explanationWidth) / 2)   + "," + (thisClass.height / 2 - thisClass.radius + thisClass.margin.top)  + ")");

        // Position of the explanation
        d3.select(element).select('#explanation')
            .style("top", thisClass.height / 2 - thisClass.radius - 50 - thisClass.explanationHeight / 4  + 'px')
            .style("left", (thisClass.width + SequenceTotalSize - thisClass.explanationWidth) / 2 + 'px');

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select(element).select("#trail")
            .style("visibility", "");

        // Make the explanation trail visible, if it's hidden.
        d3.select(element).select("#explanation")
            .style("visibility", "");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    private breadcrumbPoints(d, i, node, thisClass, textLength) {
        let points = [];
        points.push("0,0");
        points.push(thisClass.b.w + textLength + ",0");
        points.push(thisClass.b.w + textLength + thisClass.b.t + "," + (thisClass.b.h / 2));
        points.push(thisClass.b.w + textLength + "," + thisClass.b.h);
        points.push("0," + thisClass.b.h);

        // For the leftmost breadcrumb we don't include 6th vertex
        if (i > 0) {
            points.push(thisClass.b.t + "," + (thisClass.b.h / 2));
        }

        return points.join(" ");
    }

    // Restore everything to full opacity when moving off the visualization.
    private mouseleave(d, thisClass, element) {
        // Hide the breadcrumb trail
        d3.select(element).select("#trail")
            .style("visibility", "hidden");

        // Hide explanation
        d3.select(element).select("#explanation")
            .style("visibility", "hidden");

        // Deactivate all segments during transition.
        thisClass.chart.selectAll("path")
            .on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        thisClass.chart.selectAll("path")
            .transition()
            .duration(250)
            .style("opacity", 1)
            .on("end", function () {
                d3.select(this).on("mouseover", d => thisClass.mouseover(d, thisClass, element));
            });
    }

    zoom(d, thisClass) {
        thisClass.chart.transition()
            .duration(750)
            .tween("scale", function () {
                let xd = d3.interpolate(thisClass.xScale.domain(), [d.x0, d.x1]);
                let yd = d3.interpolate(thisClass.yScale.domain(), [d.y0, 1]);
                let yr = d3.interpolate(thisClass.yScale.range(), [d.y0 ? 20 : 0, thisClass.radius]);

                return t => {
                    thisClass.xScale.domain(xd(t));
                    thisClass.yScale.domain(yd(t)).range(yr(t));
                };
            })
            .selectAll("path")
            .attrTween("d", d => {
                return function () {
                    return thisClass.arc(d);
                };
            });
    }


    load() {
        this.curtain.attr('width', this.width);

        this.curtain.transition()
            .duration(2000)
            .attr('width', 0);
    }

    ease() {
        this.curtain.transition()
            .duration(600)
            .attr('width', this.width);
    }
}

const sample = [
    {
        "name": "flare",
        "children": [{
            "name": "analytics",
            "children": [
                {
                    "name": "cluster",
                    "children": [
                        {"name": "AgglomerativeCluster", "size": 3938},
                        {"name": "CommunityStructure", "size": 3812},
                        {"name": "HierarchicalCluster", "size": 6714},
                        {"name": "MergeEdge", "size": 743}]
                },{
                    "name": "graph",
                    "children": [
                        {"name": "BetweennessCentrality", "size": 3534},
                        {"name": "LinkDistance", "size": 5731},
                        {"name": "MaxFlowMinCut", "size": 7840},
                        {"name": "ShortestPaths", "size": 5914},
                        {"name": "SpanningTree", "size": 3416}]
                },{
                    "name": "optimization",
                    "children": [
                        {"name": "AspectRatioBanker", "size": 7074}]
                }]
    },{
   "name": "animate",
   "children": [
        {"name": "Easing", "size": 17010},
        {"name": "FunctionSequence", "size": 5842},
        {
            "name": "interpolate",
            "children": [
                {"name": "ArrayInterpolator", "size": 1983},
                {"name": "ColorInterpolator", "size": 2047},
                {"name": "DateInterpolator", "size": 1375},
                {"name": "Interpolator", "size": 8746},
                {"name": "MatrixInterpolator", "size": 2202},
                {"name": "NumberInterpolator", "size": 1382},
                {"name": "ObjectInterpolator", "size": 1629},
                {"name": "PointInterpolator", "size": 1675},
                {"name": "RectangleInterpolator", "size": 2042}]
        },{"name": "ISchedulable", "size": 1041},
        {"name": "Parallel", "size": 5176},
        {"name": "Pause", "size": 449},
        {"name": "Scheduler", "size": 5593},
        {"name": "Sequence", "size": 5534},
        {"name": "Transition", "size": 9201},
        {"name": "Transitioner", "size": 19975},
        {"name": "TransitionEvent", "size": 1116},
        {"name": "Tween", "size": 6006}]
  },
  {
   "name": "data",
   "children": [
    {
     "name": "converters",
     "children": [
      {"name": "Converters", "size": 721},
      {"name": "DelimitedTextConverter", "size": 4294},
      {"name": "GraphMLConverter", "size": 9800},
      {"name": "IDataConverter", "size": 1314},
      {"name": "JSONConverter", "size": 2220}
     ]
    },
    {"name": "DataField", "size": 1759},
    {"name": "DataSchema", "size": 2165},
    {"name": "DataSet", "size": 586},
    {"name": "DataSource", "size": 3331},
    {"name": "DataTable", "size": 772},
    {"name": "DataUtil", "size": 3322}
   ]
  },
  {
   "name": "display",
   "children": [
    {"name": "DirtySprite", "size": 8833},
    {"name": "LineSprite", "size": 1732},
    {"name": "RectSprite", "size": 3623},
    {"name": "TextSprite", "size": 10066}
   ]
  },
  {
   "name": "flex",
   "children": [
    {"name": "FlareVis", "size": 4116}
   ]
  },
  {
   "name": "physics",
   "children": [
    {"name": "DragForce", "size": 1082},
    {"name": "GravityForce", "size": 1336},
    {"name": "IForce", "size": 319},
    {"name": "NBodyForce", "size": 10498},
    {"name": "Particle", "size": 2822},
    {"name": "Simulation", "size": 9983},
    {"name": "Spring", "size": 2213},
    {"name": "SpringForce", "size": 1681}
   ]
  },
  {
   "name": "query",
   "children": [
    {"name": "AggregateExpression", "size": 1616},
    {"name": "And", "size": 1027},
    {"name": "Arithmetic", "size": 3891},
    {"name": "Average", "size": 891},
    {"name": "BinaryExpression", "size": 2893},
    {"name": "Comparison", "size": 5103},
    {"name": "CompositeExpression", "size": 3677},
    {"name": "Count", "size": 781},
    {"name": "DateUtil", "size": 4141},
    {"name": "Distinct", "size": 933},
    {"name": "Expression", "size": 5130},
    {"name": "ExpressionIterator", "size": 3617},
    {"name": "Fn", "size": 3240},
    {"name": "If", "size": 2732},
    {"name": "IsA", "size": 2039},
    {"name": "Literal", "size": 1214},
    {"name": "Match", "size": 3748},
    {"name": "Maximum", "size": 843},
    {
     "name": "methods",
     "children": [
      {"name": "add", "size": 593},
      {"name": "and", "size": 330},
      {"name": "average", "size": 287},
      {"name": "count", "size": 277},
      {"name": "distinct", "size": 292},
      {"name": "div", "size": 595},
      {"name": "eq", "size": 594},
      {"name": "fn", "size": 460},
      {"name": "gt", "size": 603},
      {"name": "gte", "size": 625},
      {"name": "iff", "size": 748},
      {"name": "isa", "size": 461},
      {"name": "lt", "size": 597},
      {"name": "lte", "size": 619},
      {"name": "max", "size": 283},
      {"name": "min", "size": 283},
      {"name": "mod", "size": 591},
      {"name": "mul", "size": 603},
      {"name": "neq", "size": 599},
      {"name": "not", "size": 386},
      {"name": "or", "size": 323},
      {"name": "orderby", "size": 307},
      {"name": "range", "size": 772},
      {"name": "select", "size": 296},
      {"name": "stddev", "size": 363},
      {"name": "sub", "size": 600},
      {"name": "sum", "size": 280},
      {"name": "update", "size": 307},
      {"name": "variance", "size": 335},
      {"name": "where", "size": 299},
      {"name": "xor", "size": 354},
      {"name": "_", "size": 264}
     ]
    },
    {"name": "Minimum", "size": 843},
    {"name": "Not", "size": 1554},
    {"name": "Or", "size": 970},
    {"name": "Query", "size": 13896},
    {"name": "Range", "size": 1594},
    {"name": "StringUtil", "size": 4130},
    {"name": "Sum", "size": 791},
    {"name": "Variable", "size": 1124},
    {"name": "Variance", "size": 1876},
    {"name": "Xor", "size": 1101}
   ]
  },
  {
   "name": "scale",
   "children": [
    {"name": "IScaleMap", "size": 2105},
    {"name": "LinearScale", "size": 1316},
    {"name": "LogScale", "size": 3151},
    {"name": "OrdinalScale", "size": 3770},
    {"name": "QuantileScale", "size": 2435},
    {"name": "QuantitativeScale", "size": 4839},
    {"name": "RootScale", "size": 1756},
    {"name": "Scale", "size": 4268},
    {"name": "ScaleType", "size": 1821},
    {"name": "TimeScale", "size": 5833}
   ]
  },
  {
   "name": "util",
   "children": [
    {"name": "Arrays", "size": 8258},
    {"name": "Colors", "size": 10001},
    {"name": "Dates", "size": 8217},
    {"name": "Displays", "size": 12555},
    {"name": "Filter", "size": 2324},
    {"name": "Geometry", "size": 10993},
    {
     "name": "heap",
     "children": [
      {"name": "FibonacciHeap", "size": 9354},
      {"name": "HeapNode", "size": 1233}
     ]
    },
    {"name": "IEvaluable", "size": 335},
    {"name": "IPredicate", "size": 383},
    {"name": "IValueProxy", "size": 874},
    {
     "name": "math",
     "children": [
      {"name": "DenseMatrix", "size": 3165},
      {"name": "IMatrix", "size": 2815},
      {"name": "SparseMatrix", "size": 3366}
     ]
    },
    {"name": "Maths", "size": 17705},
    {"name": "Orientation", "size": 1486},
    {
     "name": "palette",
     "children": [
      {"name": "ColorPalette", "size": 6367},
      {"name": "Palette", "size": 1229},
      {"name": "ShapePalette", "size": 2059},
      {"name": "SizePalette", "size": 2291}
     ]
    },
    {"name": "Property", "size": 5559},
    {"name": "Shapes", "size": 19118},
    {"name": "Sort", "size": 6887},
    {"name": "Stats", "size": 6557},
    {"name": "Strings", "size": 22026}
   ]
  },
  {
   "name": "vis",
   "children": [
    {
     "name": "axis",
     "children": [
      {"name": "Axes", "size": 1302},
      {"name": "Axis", "size": 24593},
      {"name": "AxisGridLine", "size": 652},
      {"name": "AxisLabel", "size": 636},
      {"name": "CartesianAxes", "size": 6703}
     ]
    },
    {
     "name": "controls",
     "children": [
      {"name": "AnchorControl", "size": 2138},
      {"name": "ClickControl", "size": 3824},
      {"name": "Control", "size": 1353},
      {"name": "ControlList", "size": 4665},
      {"name": "DragControl", "size": 2649},
      {"name": "ExpandControl", "size": 2832},
      {"name": "HoverControl", "size": 4896},
      {"name": "IControl", "size": 763},
      {"name": "PanZoomControl", "size": 5222},
      {"name": "SelectionControl", "size": 7862},
      {"name": "TooltipControl", "size": 8435}
     ]
    },
    {
     "name": "data",
     "children": [
      {"name": "Data", "size": 20544},
      {"name": "DataList", "size": 19788},
      {"name": "DataSprite", "size": 10349},
      {"name": "EdgeSprite", "size": 3301},
      {"name": "NodeSprite", "size": 19382},
      {
       "name": "render",
       "children": [
        {"name": "ArrowType", "size": 698},
        {"name": "EdgeRenderer", "size": 5569},
        {"name": "IRenderer", "size": 353},
        {"name": "ShapeRenderer", "size": 2247}
       ]
      },
      {"name": "ScaleBinding", "size": 11275},
      {"name": "Tree", "size": 7147},
      {"name": "TreeBuilder", "size": 9930}
     ]
    },
    {
     "name": "events",
     "children": [
      {"name": "DataEvent", "size": 2313},
      {"name": "SelectionEvent", "size": 1880},
      {"name": "TooltipEvent", "size": 1701},
      {"name": "VisualizationEvent", "size": 1117}
     ]
    },
    {
     "name": "legend",
     "children": [
      {"name": "Legend", "size": 20859},
      {"name": "LegendItem", "size": 4614},
      {"name": "LegendRange", "size": 10530}
     ]
    },
    {
     "name": "operator",
     "children": [
      {
       "name": "distortion",
       "children": [
        {"name": "BifocalDistortion", "size": 4461},
        {"name": "Distortion", "size": 6314},
        {"name": "FisheyeDistortion", "size": 3444}
       ]
      },
      {
       "name": "encoder",
       "children": [
        {"name": "ColorEncoder", "size": 3179},
        {"name": "Encoder", "size": 4060},
        {"name": "PropertyEncoder", "size": 4138},
        {"name": "ShapeEncoder", "size": 1690},
        {"name": "SizeEncoder", "size": 1830}
       ]
      },
      {
       "name": "filter",
       "children": [
        {"name": "FisheyeTreeFilter", "size": 5219},
        {"name": "GraphDistanceFilter", "size": 3165},
        {"name": "VisibilityFilter", "size": 3509}
       ]
      },
      {"name": "IOperator", "size": 1286},
      {
       "name": "label",
       "children": [
        {"name": "Labeler", "size": 9956},
        {"name": "RadialLabeler", "size": 3899},
        {"name": "StackedAreaLabeler", "size": 3202}
       ]
      },
      {
       "name": "layout",
       "children": [
        {"name": "AxisLayout", "size": 6725},
        {"name": "BundledEdgeRouter", "size": 3727},
        {"name": "CircleLayout", "size": 9317},
        {"name": "CirclePackingLayout", "size": 12003},
        {"name": "DendrogramLayout", "size": 4853},
        {"name": "ForceDirectedLayout", "size": 8411},
        {"name": "IcicleTreeLayout", "size": 4864},
        {"name": "IndentedTreeLayout", "size": 3174},
        {"name": "Layout", "size": 7881},
        {"name": "NodeLinkTreeLayout", "size": 12870},
        {"name": "PieLayout", "size": 2728},
        {"name": "RadialTreeLayout", "size": 12348},
        {"name": "RandomLayout", "size": 870},
        {"name": "StackedAreaLayout", "size": 9121},
        {"name": "TreeMapLayout", "size": 9191}
       ]
      },
      {"name": "Operator", "size": 2490},
      {"name": "OperatorList", "size": 5248},
      {"name": "OperatorSequence", "size": 4190},
      {"name": "OperatorSwitch", "size": 2581},
      {"name": "SortOperator", "size": 2023}
     ]
    },
    {"name": "Visualization", "size": 16540}
   ]
  }
 ]
}
]



/*
// Functions enabling parsinf of csv and the construction of the json

d3.text("./client/app/charts/sunburst-chart/sunBurstSample.csv", function(text) {
    let csv = d3.csvParseRows(text);
    let json = buildHierarchy(csv);
});

function buildHierarchy(csv) {
    let root = {"name": "root", "children": []};
    
    for (let i = 0; i < csv.length; i++) {
        let sequence = csv[i][0];
        let size = +csv[i][1];
        
        if (isNaN(size)) { // e.g. if this is a header row
            continue;
        }

        let parts = sequence.split("-");
        let currentNode = root;
    
        for (let j = 0; j < parts.length; j++) {
            let children = currentNode["children"];
            let nodeName = parts[j];
            let childNode;

            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
 	            let foundChild = false;

 	            for (let k = 0; k < children.length; k++) {
 	                if (children[k]["name"] == nodeName) {
 	                    childNode = children[k];
 	                    foundChild = true;
 	                    break;
 	                }
 	            }
                
                // If we don't already have a child node for this branch, create it.
 	            if (!foundChild) {
 	                childNode = {"name": nodeName, "children": []};
 	                children.push(childNode);
 	            }
 	
                currentNode = childNode;
            } else {
 	            // Reached the end of the sequence; create a leaf node.
 	            childNode = {"name": nodeName, "size": size};
 	            children.push(childNode);
            }
        }
    }

    return root;
};
*/

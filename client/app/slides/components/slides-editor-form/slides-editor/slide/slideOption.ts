export const titleAlign: Array<string> = [
    "left", "right", "center"
]
export const graphType: Array<any> = [
    {
        value: "noGraph",
        type: "No Graph"
    },
    {
        value: "ngGraph",
        type: "Graph builder"
    },
    {
        value: "HierarchicalEdgeBundling",
        type: "Hierarchical edge bundling"
    },
    {
        value: "lineChart",
        type: "Line Chart"
    },
    {
        value: "advancedPieChart",
        type: "Advanced Pie Chart"
    },
    {
        value: "gaugeChart",
        type: "Gauge Chart"
    },
    {
        value: "image",
        type: "Image"
    }];

export const pageLayoutOption: Array<any> = [
    {
        value: "FullScreenGraph",
        type: "Full Screen Graph",
        icon: ["fa-area-chart"]
    }, {
        value: "textInCenter",
        type: "Text in Center",
        icon: ["fa-align-center"]
    },
    {
        value: "textInCenterImageBackground",
        type: "Text + Image Background",
        icon: ["fa-picture-o"]
    },
    {
        value: "LeftGraphRightText",
        type: "Graph on Left +  Text on Right",
        icon: [ "fa-area-chart","fa-align-right"]
    },
    {
        value: "LeftTextRightGraph",
        type: "Text on Left +  Graph on Right",
        icon: ["fa-align-left","fa-area-chart" ]
    }
];

export const titleAlign: Array<string>=[
  "left","right","center"
]
export const graphType: Array<any> = [
    {
        value: "ngGraph",
        type: "Graph builder"
    },
    {
        value: "forceDirectedGraph",
        type: "Force Directed Graph"
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
    /* hide image part
  {
      value: "image",
      type: "Image"
  },
  */
    {
        value: "noGraph",
        type: "No Graph"
    }];

export const pageLayoutOption: Array<any> = [
    {
        value: "FullScreenGraph",
        type: "Full Screen Graph"
    }, {
        value: "textInCenter",
        type: "Text in Center"
    },
    /* hide image part
    {
        value: "textInCenterImageBackground",
        type: "Text in Center + Image Background"
    },
    */
    {
        value: "LeftGraphRightText",
        type: "Graph on Left +  Text on Right"
    },
    {
        value: "LeftTextRightGraph",
        type: "Text on Left +  Graph on Right"
    }
];

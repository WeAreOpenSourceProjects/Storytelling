import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import {Chart} from '../chart.class';
@Component({
    selector: 'app-force-directed-graph',
    templateUrl: './force-directed-graph.component.html',
    styleUrls: ['./force-directed-graph.component.scss']
})
export class ForceDirectedGraphComponent extends Chart implements OnInit {
    @ViewChild('chart') private chartContainer: ElementRef;
    private chart: any;
    private width: number;
    private height: number;
    private data: any;
    private simulation: any;
    private link: any;
    private node: any;

    constructor() {
        super()
    }

    ngOnInit() {
        // Set data

        this.data = this.dataInput[0];


        this.init();
    }

    ticked() {
        this.link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    dragended(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    dragstarted(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    shrink() {
        this.simulation
            //.force("gravity", d3.forceManyBody())
            .force("x", d3.forceX().strength(1).x(this.width / 2))
            .force("y", d3.forceY().strength(1).y(this.height / 2))
        //  .force("charge", d3.forceManyBody().strength(30))
        this.simulation.alpha(0.1).restart();
    }
    expand() {
        this.simulation
            //.force("gravity", d3.forceManyBody())
            .force("x", d3.forceX().strength(0).x(this.width / 2))
            .force("y", d3.forceY().strength(0).y(this.height / 2));
        this.simulation.alpha(1).restart()
    }
    focusLink(link){
      this.link.filter((d, i) => i == link["index"]).attr("opacity",1);
    }
    fadeLink(link){
      this.link.filter((d, i) => i == link["index"]).attr("opacity",.1);
    }
    centerPoint(node){
      this.node.filter((d, i) => i == node["index"]).attr("r",15).attr("opacity",1);
    }
    focus(node) {
        this.node.filter((d, i) => i == node["index"]).attr("opacity",1);
    }
    fade(node) {
        this.node.filter((d, i) => i == node["index"]).attr("r",8).attr("opacity",.1);
    }
    reset(){
      console.log("reset");
      this.node.transition().duration(200).attr("r",8).attr("opacity",1);
      this.link.transition().duration(200).attr("opacity",1);
    }
    transition() {
        this.shrink();
        setTimeout(_ => {
            this.expand()
        }, 800);
    }
    setData(data) {
        //  this.data=data[0];


    }
    init() {
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth;
        this.height = element.offsetHeight;
        let svg = d3.select(element).append('svg')
            //    .attr('width', element.offsetWidth)
            //  .attr('height', element.offsetHeight);
            //    .atrr("overflow", "visible")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 " + element.offsetWidth + " " + element.offsetHeight)
            .classed("allow-overflow", true);

        //var width = +this.svg.attr("width");
        //var height = +this.svg.attr("height");

        let color = d3.scaleOrdinal(d3.schemeCategory20);

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d: { id: string, group: number }) { return d.id; }).distance(50))
            .force("charge", d3.forceManyBody().strength(-40))
            .force("center", d3.forceCenter(element.offsetWidth / 2, element.offsetHeight / 2))
            .force("x", d3.forceX().strength(0).x(this.width / 2))
            .force("y", d3.forceY().strength(0).y(this.height / 2))

        //      .force("center", d3.forceCenter(width / 2, height / 2))



        this.link = svg.append("g")
            .attr("class", "links")
            .selectAll(".link")
            .data(this.data.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke-width", function(d) { return Math.sqrt(d['value']); })
            .attr("stroke", "#999")


        this.node = svg.append("g")
            .attr("class", "nodes")
            .selectAll(".node")
            .data(this.data.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 8)
            .attr("fill", (d) => { return color(d['group']); })
            .on("click", _ => {
                let targetId = d3.select(d3.event.target).datum()['id'];
                //fade all node
                this.node.each(d=>{
                  this.fade(d);
                  if(d.id==targetId) this.centerPoint(d);
                })
                //find relative links
                let connectedLink = this.link.each(d => {
                    this.fadeLink(d);
                    if (d.source.id == targetId|| d.target.id == targetId) {
                        this.focus(d.target)
                        this.focus(d.source)
                        this.focusLink(d);
                    }
                })

            })
            .call(d3.drag()
                .on("start", (d) => { return this.dragstarted(d) })
                .on("drag", (d) => { return this.dragged(d) })
                .on("end", (d) => { return this.dragended(d) }))


        d3.select(element).on("click",_=>{

          if(d3.event.target.attributes.class&&d3.event.target.attributes.class.nodeValue=="node") return;
          this.reset()
        });
        this.node.append("title")
            .text(function(d) { return d.id; });

        this.simulation
            .nodes(this.data.nodes)
            .on("tick", () => { return this.ticked() });

        this.simulation.force("link")
            .links(this.data.links)


        //*********legend
        let legendBox = svg.append("g")
            .attr("class", "legends")
            .attr("transform", "translate(120,200)")



        let legendRectSize = 12;
        let legendSpacing = 24;
        let legends = legendBox.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;

                var vert = i * height;
                return 'translate(' + 0 + ',' + vert + ')';
            });

        legends.append('circle')
            .attr("r", legendRectSize / 2)
            .style('fill', color)
            .style('stroke', color);

        legends.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing / 2)
            .attr("transform", "translate(0,5)")
            .text(d => "group" + d);

    }

    load() {
        this.transition();

    }
    ease() {
        this.transition();

    } 

}

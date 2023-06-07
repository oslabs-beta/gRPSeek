import React, { useEffect, useRef } from "react";
import "../../styles.scss";
import {Tooltip} from "react-tooltip";
import * as d3 from "d3";
import { BufferReader } from "protobufjs";

function Tree(props) {
  const ref = useRef(null);
  const svgRef = useRef(null);
  console.log("inside tree component: ", props.treeData);

  const colors = ['rgb(52,95,95)', 'rgb(27, 65, 65)', 'rgb(10, 10, 10)', 'rgb(99, 99, 99)']
  // const clearTree = () => {
  //   d3.select("svg").selectAll("*").remove();
  //   console.log("this is props.treedata", props.treeData);
  // };

  useEffect(() => {
    if (props.treeData) {
      if (svgRef.current) {
        svgRef.current.remove();
      }
    }

    //creates an svg with a height and width
    const svgWidth = 1500;
    const svgHeight = 800;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    svgRef.current = svg;

    //creates a hierarchical layout using data from proto file
    const treeRoot = d3.hierarchy(props.treeData);

    //defines size of the tree
    const treeLayout = d3.tree().size([1100, 600]);
    treeLayout(treeRoot);

    //creates an svg group ('g') element for links and appends it to the svg
    const g = svg.append("g").attr("transform", "translate(200,125)");

    const link = g
      .selectAll(".link")
      .data(treeRoot.links()) //use links from root node
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("stroke", "#888") //set color of line
      .attr("stroke-width", 1.5) //set thickness of line
      .attr("fill", "none"); //set fill of path

    //creates the nodes
    const node = g
      .selectAll(".node")
      .data(treeRoot.descendants())
      .enter()
      .append("g")
      .attr(
        "class",
        (d) => "node" + (d.children ? "node--internal" : "node--leaf")
      )
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")

    node
      .append("circle")
      .attr("r", 8)
      .attr("fill", (d) => (d.children ? "rgb(52,95,95)" : "gb(32, 60, 60)")); //radius of circle

    node
      .append("text")
      .attr("class", "text")
      .attr("dy", ".35em")
      .attr("y", (d) => (d.children ? -20 : 20))
      .style("text-anchor", "middle")
      .text((d) => d.data.name);
  }, [props.treeData]);

  return (
    <div className="tree--container" >
      <div ref={ref}></div>
      
    </div>
  );
}

export default Tree;

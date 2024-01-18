import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ReadCSVService } from './read-csv.service';
import { hexbin } from 'd3-hexbin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'spatialge_testapp';
  containerId = '#scatter';
  scatterPlotData = [
    {
      "xValue": 0,
      "yValue": 0,
      "totalCounts": 0
    }
  ];
  xMin = Infinity
  xMax = -Infinity
  yMin = Infinity
  yMax = -Infinity
  totalCountsMax = 0;
  totalCountsMin = Infinity;

  scaleFactor = 0.0836575;

  totalCounts: any = {}

  plotOpacityValue  = 1
  imageOpacityValue = .5

  overlayImage  = true
  displayPlot = true;
  displayImage = true;

  constructor(private csvService: ReadCSVService) { }

  ngOnInit(): void {
    this.readCSV();
  }

  updatePlotOpacity(value: number): void {
    this.plotOpacityValue = value;
  }

  updateImageOpacity(value: number): void {
    this.imageOpacityValue = value;
  }

  readCSV(): void {
    this.csvService.getCSVData().subscribe(
      (data: string) => {
        // Process the CSV data here
        let parsedData = this.parseTSV(data)
        console.log("parsedData:  ", parsedData)
        for (let obj of parsedData) {
          const parsedX = parseInt(obj['xpos']);
          const parsedY = parseInt(obj['ypos']);
          const totalCounts = parseInt(obj['total_counts'])

          if (!isNaN(parsedX) && !isNaN(parsedY) && !isNaN(totalCounts)) {
            let temp = {
              "xValue": parsedX,
              "yValue": parsedY,
              "totalCounts": totalCounts
            }
            let keyName = parsedX + "_" + parsedY
            this.totalCounts[keyName] = totalCounts
            this.scatterPlotData.push(temp)

            this.xMin = Math.min(this.xMin, parsedX);
            this.xMax = Math.max(this.xMax, parsedX);

            this.yMin = Math.min(this.yMin, parsedY);
            this.yMax = Math.max(this.yMax, parsedY);

            this.totalCountsMax = Math.max(this.totalCountsMax, totalCounts)
            this.totalCountsMin = Math.min(this.totalCountsMin, totalCounts)
          }

        }
        this.createScatterPlot()
        // this.createHexbinPlot()
      },
      (error) => {
        console.error('Error occurred while fetching the CSV file:', error);
      }
    );
  }

  // Parse TSV data
  parseTSV(tsvContent: string): any[] {
    const lines = tsvContent.split('\n');
    const headers = ['index', ...lines[0].split('\t')];
    const objectsArray = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split('\t');
      const obj: any = {};

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }

      objectsArray.push(obj);
    }

    return objectsArray;
  }

  createScatterPlot() {

    // set the dimensions and margins of the graph
    var margin = { top: 10 + 38, right: 30, bottom: 100, left: 100 + 11},
      width = 433 - margin.left - margin.right,
      height = 462 - margin.top - margin.bottom;

    d3.select(this.containerId)
      .selectAll('svg')
      .remove();

    // append the svg object to the body of the page
    var svg = d3.select(this.containerId)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const color = d3.scaleLinear<string>()
      .domain([0, this.totalCountsMax])
    .range(["rgba(0, 0, 0, 0)", "black"]);

    var x = d3.scaleLinear()
      .domain([this.xMin, this.xMax * (1+this.scaleFactor)])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([this.yMin, this.yMax])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(this.scatterPlotData)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.xValue) })
      .attr("cy", function (d) { return height - y(d.yValue); })
      .attr("r", 2)
      // .style("fill", "#69b3a2")
      .attr("fill", function (d) {
            return color(d.totalCounts)
          })
  }

  createHexbinPlot(): void {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(this.containerId)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([this.xMin * .9, this.xMax * 1.1])
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([this.yMin * .9, this.yMax * 1.1])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Sample data
    let data: any = [];
    for (let i = 0; i < this.scatterPlotData.length; i++) {
      data.push([x(this.scatterPlotData[i].xValue), y(this.scatterPlotData[i].yValue), this.scatterPlotData[i]['totalCounts']])
    }

    // Create a hexbin generator
    const hexbinGenerator = hexbin().radius(5);

    // Compute the hexbins
    const hexbins = hexbinGenerator(data);

    const color = d3.scaleLinear<string>()
      .domain([0, 600])
      .range(["rgba(0, 0, 0, 0)", "tomato"]);

    // Plot the hexbins
    svg.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height)

    // let test = this.totalCounts
    svg.append("g")
      .attr("clip-path", "url(#clip)")
      .selectAll("path")
      .data(hexbins)
      .join("path")
      .attr("d", hexbinGenerator.hexagon())
      .attr("transform", function (d) {
        return `translate(${d.x}, ${d.y})`
      })
      .attr("fill", function (d) {
        return color(Math.random() * 600);
      })
      .attr("stroke", "black")
      .attr("stroke-width", "0.1")
  }
}

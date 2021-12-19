document.addEventListener("DOMContentLoaded", function () {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    true
  );
  req.send();
  req.onload = () => {
    const json = JSON.parse(req.responseText);
    let dataset = json.data;
    for (let i = 0; i < dataset.length; i++) {
      dataset[i].push(Date.parse(dataset[i][0]));
    }
    createChart(dataset);
  };

  function createChart(dataset) {
    const w = 1000;
    const h = 600;
    const padding = 60;
    const barWidth = 2;

    d3.select("#title").text("Bar Chart of US GDP");

    var tooltip = d3
      .select(".chartContainer")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, (d) => new Date(d[0])))
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - padding, padding]);

    const svg = d3
      .select(".chartContainer")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d[2]))
      .attr("y", (d) => yScale(d[1]))
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("width", barWidth)
      .attr("height", (d, i) => h - padding - yScale(d[1]))
      .attr("fill", "#1E1E1E")
      .attr("class", "bar")
      .on("mouseover", function (d, i) {
        tooltip
          .transition()
          .duration(0)
          .style("top", h + 30 + "px")
          .style("left", w / 2 + "px")
          .style("opacity", 0.9);
        tooltip
          .html(i[0] + "<br>" + "$" + i[1] + " Billion")
          .attr("data-date", i[0])
          .attr("data-gdp", i[1]);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis)
      .attr("class", "tick");

    svg
      .append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis)
      .attr("class", "tick");
  }
});

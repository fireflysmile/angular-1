'use strict';

/* App Module */
var directives = angular.module('directives', []);

// directive center popup
directives.directive('centerScreen', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var window = angular.element($window);

            setPosition();

            window.on('resize', function() {
                setPosition();
            });

            function setPosition() {
                var x = (window.innerHeight() - element.innerHeight())/2,
                    y = (window.innerWidth() - element.innerWidth())/2;

                x = x > 0 ? x : 0;
                y = y > 0 ? y : 0;
                element.css({'top': x, 'left': y});
            }
        }
    }
});

// derective auto width
directives.directive('autoWidth', function ($window) {
    return {
        restrict: 'A',
        scope: {
            element: '@',
            parent: '@'
        },
        link: function (scope, element, attrs) {
            var ele = angular.element(scope.element),
                parent = angular.element(scope.parent),
                window = angular.element($window);
            setWidth();

            window.on('resize', function () {
                setWidth();
            })

            function setWidth() {
                var width = parent.outerWidth() - ele.outerWidth();
                element.css({'width': width})
            }
        }
    }
});

// derective auto height
directives.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            
            scope.style = function () {
                return { 
                    'height': (newValue.h - 116) + 'px'
                };
            };
            scope.style1 = function () {
                return { 
                    'height': (newValue.h - 230) + 'px'
                };
            };
            scope.style2 = function () {
                return { 
                    'height': (newValue.h - 163) + 'px'
                };
            };
            scope.style3 = function () {
                return { 
                    'height': (newValue.h - 254) + 'px'
                };
            };
            scope.style4 = function () {
                return { 
                    'height': (newValue.h - 53) + 'px'
                };
            };
            scope.style5 = function () {
                return { 
                    'height': (newValue.h - 215) + 'px'
                };
            };
            scope.style6 = function () {
                return { 
                    'height': (newValue.h - 130) + 'px'
                };
            };
            scope.style7 = function () {
                return { 
                    'height': (newValue.h - 358) + 'px'
                };
            };
            
        }, true);
    
        w.bind('resize', function () {
            scope.$apply();
        });
    }
})

// draw chart
directives.directive('drawChart', function ($window) {
  return {
    restrict: 'A',
    scope: {
      chartLabel: '=chartLabel',
      chartData: '=chartValue'
    },
    link: function (scope, element, attrs) {
      // console.log(scope.chartLabel)
      var window = angular.element($window);
      var fontXAxis = 0;
      if (window.outerWidth() < 767) {
        fontXAxis = 8;
      }
      else fontXAxis = 12;

      console.log(scope.chartData)
      var ctx = element[0].getContext('2d');
      var lineChartData = {
              labels : scope.chartLabel,
              datasets : [
                  {
                      label: "Active",
                      fillColor : "transparent",
                      strokeColor : "#009851",
                      pointColor : ['#009851'],
                      pointStrokeColor : "#ffffff",
                      data: scope.chartData[0]
                  },{
                      label: "Pipeline",
                      fillColor : "transparent",
                      strokeColor : "#f57212",
                      pointColor : ['#f57212'],
                      pointStrokeColor : "#ffffff",
                      data: scope.chartData[1]
                  }
              ]

          };


      Chart.types.Line.extend({
      name: "LineAlt",
      initialize: function() {
        Chart.types.Line.prototype.initialize.apply(this, arguments);

        var originalShowTooltip = this.showTooltip;

        this.showTooltip = function(activePoints) {

              if (activePoints.length) {
                var ctx = this.chart.ctx;
                var scale = this.scale;
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#7abaf7';
                ctx.beginPath();
                ctx.moveTo(activePoints[0].x, scale.startPoint);
                ctx.lineTo(activePoints[0].x, scale.endPoint);
                ctx.stroke();
                ctx.restore();
              }

              return originalShowTooltip.apply(this, arguments);
            }
          }
        });

          new Chart(ctx).LineAlt(lineChartData, {
              scaleShowVerticalLines: false,
              scaleShowHorizontalLines: true,
              bezierCurveTension : 0.4,
              pointDot : true,
              pointDotRadius : 4,
              datasetStroke : true,
              datasetStrokeWidth : 1,
              datasetFill : true,
              bezierCurve : false,
              scaleShowLabels: true,
              multiTooltipTemplate: "<%= datasetLabel %> <%=value%>",
              fillColor: "rgba(220,220,220,0.2)",
              scaleFontColor: '#333333',
              scaleFontSize: fontXAxis,
              scaleOverride: true,
              scaleSteps: 5,
              scaleStepWidth: 25,
              scaleStartValue: 0,
              showScale: true,
              scaleLineColor: 'transparent',
              tooltipCornerRadius: 5,
              tooltipEvents: ["click","mousemove","mouseout"],
              tooltipXPadding: 14,
              tooltipYPadding: 8,
              tooltipFillColor: "#000",
              tooltipTitleFontSize: 15,
              tooltipCaretSize: 6,
              responsive: false,
              rangeColor: [0],
              customTooltips: function(tooltip) {
                var tooltipEl = $('#chartjs-tooltip');
                if (!tooltip) {
                  tooltipEl.css({
                    opacity: 1
                  });
                  return;
                }
                tooltipEl.removeClass('above below');
                tooltipEl.addClass(tooltip.yAlign);
                var innerHtml = '<span class="chartjs-tooltip-title">' + this.title + '</span>';
                
                for (var i = tooltip.labels.length - 1; i >= 0; i--) {
                  innerHtml += [
                    '<div class="chartjs-tooltip-section">',
                    ' <span class="chartjs-tooltip-value" style="color:' + tooltip.legendColors[i].fill + '">' + tooltip.labels[i] + '</span>',
                    '</div>'
                  ].join('');
                }
                
                tooltipEl.html(innerHtml);

                tooltipEl.css({
                  opacity: 1,
                  left: tooltip.chart.canvas.offsetLeft + tooltip.x + 60 + 'px',
                  top: tooltip.chart.canvas.offsetTop + tooltip.y - 40 + 'px',
                  fontFamily: tooltip.fontFamily,
                  fontSize: tooltip.fontSize,
                  fontStyle: tooltip.fontStyle,
              });
              }
          });
      legend(document.getElementById("lineLegend"), lineChartData);
    }
  }
});
directives.directive('drawChartMb', function ($window) {
  return {
    restrict: 'A',
    scope: {
      chartLabel: '=chartLabel',
      chartData: '=chartValue'
    },
    link: function (scope, element, attrs) {
      // console.log(scope.chartLabel)
      var window = angular.element($window);
      var fontXAxis = 0;
      if (window.outerWidth() < 767) {
        fontXAxis = 8;
      }
      else fontXAxis = 12;

      console.log(scope.chartData)
      var ctx = element[0].getContext('2d');
      var lineChartData = {
              labels : scope.chartLabel,
              datasets : [
                  {
                      label: "Active",
                      fillColor : "transparent",
                      strokeColor : "#009851",
                      pointColor : ['#009851'],
                      pointStrokeColor : "#ffffff",
                      data: scope.chartData[0]
                  },{
                      label: "Pipeline",
                      fillColor : "transparent",
                      strokeColor : "#f57212",
                      pointColor : ['#f57212'],
                      pointStrokeColor : "#ffffff",
                      data: scope.chartData[1]
                  }
              ]

          };

        Chart.types.Line.extend({
          name: "LineAlt",
          initialize: function() {
          Chart.types.Line.prototype.initialize.apply(this, arguments);
            var originalShowTooltip = this.showTooltip;
            this.showTooltip = function(activePoints) {

              if (activePoints.length) {
                var ctx = this.chart.ctx;
                var scale = this.scale;
                ctx.save();
                ctx.strokeStyle = '#7abaf7';
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(activePoints[0].x, scale.startPoint);
                ctx.lineTo(activePoints[0].x, scale.endPoint);
                ctx.stroke();
                ctx.restore();
              }
              return originalShowTooltip.apply(this, arguments);
            }
          }

        });

          new Chart(ctx).LineAlt(lineChartData, {
              scaleShowVerticalLines: false,
              scaleShowHorizontalLines: true,
              bezierCurveTension : 0.4,
              pointDot : true,
              pointDotRadius : 4,
              pointDotStrokeWidth: 2,
              datasetStroke : true,
              datasetStrokeWidth : 1,
              datasetFill : true,
              bezierCurve : false,
              scaleShowLabels: true,
              multiTooltipTemplate: "<%= datasetLabel %> <%=value%>",
              fillColor: "rgba(220,220,220,0.2)",
              scaleFontColor: '#333333',
              scaleFontSize: fontXAxis,
              scaleLineColor: 'transparent',
              scaleOverride: true,
              scaleSteps: 5,
              scaleStepWidth: 25,
              scaleStartValue: 0,
              tooltipCornerRadius: 5,
              tooltipEvents: ["click","mousemove","mouseout"],
              tooltipXPadding: 14,
              tooltipYPadding: 8,
              tooltipFillColor: "#000",
              tooltipTitleFontSize: 15,
              tooltipCaretSize: 6,
              responsive: true,
              rangeColor: [0],
              customTooltips: function(tooltip) {
                var tooltipEl = $('#chartjs-tooltip');
                if (!tooltip) {
                  tooltipEl.css({
                    opacity: 0
                  });
                  return;
                }
                tooltipEl.removeClass('above below');
                tooltipEl.addClass(tooltip.yAlign);
                var innerHtml = '<span class="chartjs-tooltip-title">' + this.title + '</span>';
                for (var i = tooltip.labels.length - 1; i >= 0; i--) {
                  innerHtml += [
                    '<div class="chartjs-tooltip-section">',
                    ' <span class="chartjs-tooltip-value" style="color:' + tooltip.legendColors[i].fill + '">' + tooltip.labels[i] + '</span>',
                    '</div>'
                  ].join('');
                }
                
                tooltipEl.html(innerHtml);

                tooltipEl.css({
                  opacity: 1,
                  left: tooltip.chart.canvas.offsetLeft + tooltip.x + 60 + 'px',
                  top: tooltip.chart.canvas.offsetTop + tooltip.y - 40 + 'px',
                  fontFamily: tooltip.fontFamily,
                  fontSize: tooltip.fontSize,
                  fontStyle: tooltip.fontStyle,
              });
              }
          });
      legend(document.getElementById("lineLegend"), lineChartData);
    }
  }
});
// enter key
directives.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
// donut chart d3 js
directives.directive('customChart', function($parse, $window){
   return{
      restrict:'EA',
       link: function(scope, elem, attrs){

              var w = 230,
                  h = 190,
                  r = 78,
                  lh = 33,
                  inner = 54,
                  color = d3.scale.ordinal()
                .range(["#009851" , "#f57212" , "#e50000", "#046ccf", "#949494"]);


              if (screen.width < 1023){
                w = 190,
                h = 155,
                r = 61,
                inner = 40,            
                lh = 25
             }

              var data = [{"label":"Active", "value":4}, 
                      {"label":"Pipeline", "value":5}, 
                      {"label":"Stalled", "value":4},
                      {"label":"Completed", "value":4},
                      {"label":"Not good fits", "value":5}];

              var total = d3.sum(data, function(d) {
                  return d3.sum(d3.values(d));
              });

              var vis = d3.select("#chart")
                  .append("svg:svg")
                  .classed("svg-container", true) //container class to make it responsive
                  .data([data])
                      .attr("width", w)
                      .attr("height", h)
                  .append("svg:g")
                      .attr("transform", "translate(" + r * 1.1 + "," + r * 1.1 + ")")

              var textTop = vis.append("text")
                  .attr("dy", ".35em")
                  .style("text-anchor", "middle")
                  .attr("class", "text-top")
                  .text(total)
                  .attr("y", -10),

                  textBottom = vis.append("text")
                  .attr("dy", ".35em")
                  .style("text-anchor", "middle")
                  .attr("class", "text-bottom")
                  .text( "Total Project" )
                  .attr("y", 10);

              var arc = d3.svg.arc()
                  .innerRadius(inner)
                  .outerRadius(r);

              var arcOver = d3.svg.arc()
                  .innerRadius(inner + 5)
                  .outerRadius(r + 5);
               
              var pie = d3.layout.pie()
                  .value(function(d) { return d.value; });
               
              var arcs = vis.selectAll("g.slice")
                  .data(pie)
                  .enter()
                      .append("svg:g")
                          .attr("class", "slice")
                          .on("mouseover", function(d) {

                              textBottom.text(d3.select(this).datum().data.label)
                                  .attr("y", 10);
                              textTop.text(d3.select(this).datum().data.value)
                                  .attr("y", -10);
                              d3.select(this).style("cursor", "pointer");
                          })
                          .on("mouseout", function(d) {
                              
                              textBottom.text( "Total Project" )
                                  .attr("y", 10);
                              textTop.text(total);
                          });

              arcs.append("svg:path")
                  .attr("fill", function(d, i) { return color(i); } )
                  .attr("d", arc);

              arcs.append("svg:text")
                  .attr("class", "text-outside")
                  .attr("transform", function(d) {
                      var c = arc.centroid(d),
                          x = c[0],
                          y = c[1],
                          // pythagorean theorem for hypotenuse
                          h = Math.sqrt(x*x + y*y);
                      return "translate(" + (x/h * inner * 1.6) +  ',' +
                         (y/h * inner * 1.7) +  ")"; 
                  }) 
                  .attr("text-anchor", function(d) {
                      // are we past the center?
                      return (d.endAngle + d.startAngle)/2 > Math.PI ?
                          "end" : "start";
                  })
                  .style("fill", function(d, i) { return color(i); })
                  .text(function(d, i) { return ((data[i].value/total)*100).toFixed(0) + "%"; });

              var legend = d3.select("#chart").append("svg")
                  .attr("class", "legend-d3")
                  .attr("width", 110)
                  .selectAll("g")
                  .data(data)
                  .enter().append("g")
                  .attr("transform", function(d, i) { return "translate(0," + i * lh + ")"; });


              legend.append("rect")
                  .attr("width", 10)
                  .attr("height", 10)
                  .style("fill", function(d, i) { return color(i); });

              legend.append("text")
                  .attr("width", 100)
                  .attr("height", 100)
                  .attr("x", 15)
                  .attr("y", 5)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.label + " " + "(" + d.value + ")"; });

       }
   };
});
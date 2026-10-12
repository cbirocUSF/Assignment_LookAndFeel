/* ==========================================================================
   analytics.js - the three Chart.js visualizations
   Mountainview Institute of Technology Scholarship Portal
   Author: Christopher Biroc  |  ISM 6225 Assignment 1

   Every series is calculated from the shared SCHOLARSHIPS array in data.js
   using the aggregation helpers defined there, so the charts always agree
   with the catalog shown on the Manage Scholarships page.

   Chart 1 - Horizontal bar: total dollars committed by category
   Chart 2 - Doughnut:       share of individual awards by category
   Chart 3 - Line:           total institutional aid disbursed by year
   ========================================================================== */

/* Categorical palette built around the institution's brand colors. */
var CHART_COLORS = [
  '#367588',  /* brand teal       - Merit */
  '#c9a227',  /* brand gold       - Need-Based */
  '#2f4f4f',  /* brand slate      - STEM */
  '#6fa8b5',  /* light teal       - Athletic */
  '#8a6a3a',  /* timber brown     - First-Generation */
  '#4f8f82'   /* teal green       - Graduate Research */
];

var GRID_COLOR = '#e1e8ea';
var TEXT_COLOR = '#2f4f4f';

document.addEventListener('DOMContentLoaded', function () {
  // Shared defaults so all three charts look like one system.
  Chart.defaults.font.family = '"Segoe UI", system-ui, Arial, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = TEXT_COLOR;

  // The summary tiles are decoration; the charts are the point of the page.
  // Wrapping the tiles means a problem up there can never stop the charts
  // from drawing below.
  try {
    fillAnalyticsSummary();
  } catch (error) {
    console.error('Could not fill the summary tiles:', error);
  }

  buildDollarsByCategoryChart();
  buildAwardShareChart();
  buildAidTrendChart();
});

/**
 * Writes text into an element, quietly doing nothing if the element is not on
 * the page. Without this guard a renamed or missing id throws a TypeError and
 * stops every line of script after it.
 */
function setText(elementId, value) {
  var element = document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}

/* --------------------------------------------------------------------------
   Summary tiles above the charts
   -------------------------------------------------------------------------- */
function fillAnalyticsSummary() {
  var summary = portfolioSummary(SCHOLARSHIPS);

  // The most recent year in the all-sources trend series, converted from
  // millions back to dollars so the two figures can be compared directly.
  var latestYear = AID_BY_YEAR[AID_BY_YEAR.length - 1];
  var allAidDollars = latestYear.millions * 1000000;

  // What portion of all student aid the named scholarship catalog represents.
  // Showing this explicitly keeps the $3.2M and $39.7M figures from looking
  // like they contradict each other.
  var catalogShare = (summary.totalCommitted / allAidDollars) * 100;

  setText('sumCommitted', '$' + (summary.totalCommitted / 1000000).toFixed(2) + 'M');
  setText('sumAllAid', '$' + latestYear.millions.toFixed(1) + 'M');
  setText('sumShare', catalogShare.toFixed(1) + '%');
  setText('sumAwards', summary.totalAwards);
}

/* --------------------------------------------------------------------------
   Chart 1 - Dollars committed by category (horizontal bar)
   -------------------------------------------------------------------------- */
function buildDollarsByCategoryChart() {
  var data = totalDollarsByCategory(SCHOLARSHIPS);

  var labels = [];
  var values = [];

  for (var i = 0; i < data.length; i++) {
    labels.push(data[i].category);
    values.push(data[i].total);
  }

  new Chart(document.getElementById('dollarsByCategoryChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Dollars committed',
        data: values,
        backgroundColor: CHART_COLORS,
        borderRadius: 4,
        borderWidth: 0
      }]
    },
    options: {
      indexAxis: 'y',          /* horizontal bars so the labels stay readable */
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return formatCurrency(context.parsed.x) + ' committed';
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: GRID_COLOR },
          ticks: {
            callback: function (value) {
              return '$' + (value / 1000) + 'K';
            }
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   Chart 2 - Share of individual awards by category (doughnut)
   -------------------------------------------------------------------------- */
function buildAwardShareChart() {
  var data = awardCountByCategory(SCHOLARSHIPS);

  var labels = [];
  var values = [];
  var total = 0;

  for (var i = 0; i < data.length; i++) {
    labels.push(data[i].category);
    values.push(data[i].awards);
    total = total + data[i].awards;
  }

  new Chart(document.getElementById('awardShareChart'), {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Awards available',
        data: values,
        backgroundColor: CHART_COLORS,
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, padding: 12 }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var count = context.parsed;
              var share = ((count / total) * 100).toFixed(1);
              return context.label + ': ' + count + ' awards (' + share + '%)';
            }
          }
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   Chart 3 - Total aid disbursed by year (line)
   -------------------------------------------------------------------------- */
function buildAidTrendChart() {
  var labels = [];
  var values = [];

  for (var i = 0; i < AID_BY_YEAR.length; i++) {
    labels.push(AID_BY_YEAR[i].year);
    values.push(AID_BY_YEAR[i].millions);
  }

  new Chart(document.getElementById('aidTrendChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'All student aid disbursed ($M)',
        data: values,
        borderColor: '#367588',
        backgroundColor: 'rgba(54, 117, 136, 0.12)',
        borderWidth: 3,
        pointBackgroundColor: '#c9a227',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return '$' + context.parsed.y.toFixed(1) + ' million, all sources';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: GRID_COLOR },
          ticks: {
            callback: function (value) {
              return '$' + value + 'M';
            }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

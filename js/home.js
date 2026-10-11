/* ==========================================================================
   home.js - builds the statistics band and the featured award cards
   Mountainview Institute of Technology Scholarship Portal
   Author: Christopher Biroc  |  ISM 6225 Assignment 1

   The home page numbers are calculated from the same array that feeds the
   CRUD table and the charts, so the three pages can never disagree.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  fillStatisticsBand();
  buildFeaturedCards();
});

/**
 * Writes the four portfolio-level totals into the statistics tiles.
 */
function fillStatisticsBand() {
  var summary = portfolioSummary(SCHOLARSHIPS);

  // Show the committed total in millions, which reads better than seven digits.
  var millions = (summary.totalCommitted / 1000000).toFixed(1);

  document.getElementById('statCommitted').textContent = '$' + millions + 'M';
  document.getElementById('statAwards').textContent = summary.totalAwards;
  document.getElementById('statPrograms').textContent = summary.openPrograms;
  document.getElementById('statAverage').textContent = formatCurrency(summary.averageAward);
}

/**
 * Shows the four open programs with the earliest deadlines.
 */
function buildFeaturedCards() {
  var container = document.getElementById('featuredCards');

  // Work on a copy so sorting does not reorder the shared dataset.
  var openPrograms = [];

  for (var i = 0; i < SCHOLARSHIPS.length; i++) {
    if (SCHOLARSHIPS[i].status === 'Open') {
      openPrograms.push(SCHOLARSHIPS[i]);
    }
  }

  // ISO dates sort correctly as plain strings, so no Date objects are needed.
  openPrograms.sort(function (a, b) {
    if (a.deadline < b.deadline) {
      return -1;
    }
    if (a.deadline > b.deadline) {
      return 1;
    }
    return 0;
  });

  var featured = openPrograms.slice(0, 4);

  for (var j = 0; j < featured.length; j++) {
    container.appendChild(buildCard(featured[j]));
  }
}

/**
 * Builds one Bootstrap column containing a scholarship card.
 */
function buildCard(record) {
  var column = document.createElement('div');
  column.className = 'col-sm-6 col-lg-3';

  var card = document.createElement('div');
  card.className = 'mit-card p-4 h-100 d-flex flex-column';

  var pill = document.createElement('span');
  pill.className = 'pill mb-3 align-self-start';
  pill.textContent = record.category;

  var title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = record.name;

  var amount = document.createElement('div');
  amount.className = 'card-amount mb-1';
  amount.textContent = formatCurrency(record.amount);

  var awards = document.createElement('div');
  awards.className = 'text-muted small mb-3';
  awards.textContent = record.awards + ' awards available';

  var details = document.createElement('div');
  details.className = 'text-muted small mt-auto';
  details.innerHTML =
    '<strong>Deadline:</strong> ' + formatDate(record.deadline) + '<br>' +
    '<strong>Minimum GPA:</strong> ' + record.minGpa.toFixed(1);

  card.appendChild(pill);
  card.appendChild(title);
  card.appendChild(amount);
  card.appendChild(awards);
  card.appendChild(details);
  column.appendChild(card);

  return column;
}

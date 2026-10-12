/* ==========================================================================
   data.js - the static sample dataset for the whole site
   Mountainview Institute of Technology Scholarship Portal
   Author: Christopher Biroc  |  ISM 6225 Assignment 1

   One shared dataset feeds both the Manage Scholarships page (CRUD) and the
   Analytics page (charts), so the numbers on the charts always match the
   records in the table. In a data-driven version of this site these arrays
   would come from a database query instead of a JavaScript file.

   All figures are invented sample data for a fictional institution.
   ========================================================================== */

/* The scholarship catalog. Each object is one award program. */
var SCHOLARSHIPS = [
  {
    id: 1,
    name: "Golden Pick Merit Scholarship",
    category: "Merit",
    amount: 12000,
    awards: 25,
    deadline: "2027-02-15",
    minGpa: 3.7,
    status: "Open"
  },
  {
    id: 2,
    name: "Prospector First-Generation Award",
    category: "First-Generation",
    amount: 8000,
    awards: 40,
    deadline: "2027-01-31",
    minGpa: 3.0,
    status: "Open"
  },
  {
    id: 3,
    name: "Deep Vein Engineering Grant",
    category: "STEM",
    amount: 15000,
    awards: 18,
    deadline: "2027-03-01",
    minGpa: 3.5,
    status: "Open"
  },
  {
    id: 4,
    name: "Summit Need-Based Tuition Grant",
    category: "Need-Based",
    amount: 6500,
    awards: 120,
    deadline: "2027-04-15",
    minGpa: 2.5,
    status: "Open"
  },
  {
    id: 5,
    name: "Miners Athletic Scholarship",
    category: "Athletic",
    amount: 10000,
    awards: 30,
    deadline: "2027-02-28",
    minGpa: 2.8,
    status: "Open"
  },
  {
    id: 6,
    name: "Quartz Graduate Research Fellowship",
    category: "Graduate Research",
    amount: 22000,
    awards: 12,
    deadline: "2027-01-15",
    minGpa: 3.6,
    status: "Open"
  },
  {
    id: 7,
    name: "Trailblazer Transfer Scholarship",
    category: "Merit",
    amount: 5000,
    awards: 55,
    deadline: "2027-05-01",
    minGpa: 3.2,
    status: "Open"
  },
  {
    id: 8,
    name: "Assay Lab Data Science Award",
    category: "STEM",
    amount: 9500,
    awards: 22,
    deadline: "2027-03-20",
    minGpa: 3.4,
    status: "Open"
  },
  {
    id: 9,
    name: "Bedrock Veterans Tuition Grant",
    category: "Need-Based",
    amount: 7500,
    awards: 35,
    deadline: "2027-04-01",
    minGpa: 2.5,
    status: "Open"
  },
  {
    id: 10,
    name: "Headframe Alumni Legacy Award",
    category: "Merit",
    amount: 4000,
    awards: 60,
    deadline: "2026-06-01",
    minGpa: 3.0,
    status: "Closed"
  }
];

/* The list of valid categories, used to build the dropdown and the charts. */
var CATEGORIES = [
  "Merit",
  "Need-Based",
  "STEM",
  "Athletic",
  "First-Generation",
  "Graduate Research"
];

/* Total student aid disbursed from ALL sources, in millions of dollars.
   This is a wider measure than the SCHOLARSHIPS catalog above. Alongside the
   named scholarship programs it includes federal Pell grants, student loans,
   state aid, tuition waivers and graduate assistantship stipends, so the
   catalog's $3.22M commitment is only about 8% of the 2026 figure. The two
   also differ in basis: the catalog counts dollars committed for one
   application cycle, this array counts dollars actually disbursed in a year. */
var AID_BY_YEAR = [
  { year: "2020", millions: 18.4 },
  { year: "2021", millions: 21.2 },
  { year: "2022", millions: 24.9 },
  { year: "2023", millions: 27.6 },
  { year: "2024", millions: 31.8 },
  { year: "2025", millions: 35.1 },
  { year: "2026", millions: 39.7 }
];

/* --------------------------------------------------------------------------
   Aggregation helpers. The analytics page calls these instead of holding a
   second hard-coded copy of the numbers.
   -------------------------------------------------------------------------- */

/**
 * Total dollars committed per category: amount x number of awards.
 * Returns an array of { category, total } in CATEGORIES order.
 */
function totalDollarsByCategory(records) {
  var results = [];

  for (var c = 0; c < CATEGORIES.length; c++) {
    var runningTotal = 0;

    for (var r = 0; r < records.length; r++) {
      if (records[r].category === CATEGORIES[c]) {
        runningTotal = runningTotal + (records[r].amount * records[r].awards);
      }
    }

    results.push({ category: CATEGORIES[c], total: runningTotal });
  }

  return results;
}

/**
 * Number of individual awards offered per category.
 * Returns an array of { category, awards } in CATEGORIES order.
 */
function awardCountByCategory(records) {
  var results = [];

  for (var c = 0; c < CATEGORIES.length; c++) {
    var runningCount = 0;

    for (var r = 0; r < records.length; r++) {
      if (records[r].category === CATEGORIES[c]) {
        runningCount = runningCount + records[r].awards;
      }
    }

    results.push({ category: CATEGORIES[c], awards: runningCount });
  }

  return results;
}

/**
 * Portfolio-level totals used by the home page and the analytics summary.
 */
function portfolioSummary(records) {
  var totalCommitted = 0;
  var totalAwards = 0;
  var openPrograms = 0;

  for (var i = 0; i < records.length; i++) {
    totalCommitted = totalCommitted + (records[i].amount * records[i].awards);
    totalAwards = totalAwards + records[i].awards;

    if (records[i].status === "Open") {
      openPrograms = openPrograms + 1;
    }
  }

  return {
    programs: records.length,
    openPrograms: openPrograms,
    totalAwards: totalAwards,
    totalCommitted: totalCommitted,
    averageAward: totalAwards > 0 ? Math.round(totalCommitted / totalAwards) : 0
  };
}

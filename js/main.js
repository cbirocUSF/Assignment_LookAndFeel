/* ==========================================================================
   main.js - shared behavior loaded by every page
   Mountainview Institute of Technology Scholarship Portal
   Author: Christopher Biroc  |  ISM 6225 Assignment 1

   Two small jobs:
     1. Mark the current page in the navigation bar, so the same nav markup
        can be copied onto every page without hand-editing an "active" class.
     2. Stamp the current year into the footer.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentNavLink();
  stampFooterYear();
});

/**
 * Compares each nav link's filename to the filename in the address bar and
 * adds Bootstrap's .active class to the one that matches.
 */
function highlightCurrentNavLink() {
  // location.pathname ends in "/" on the GitHub Pages root, so fall back
  // to index.html in that case.
  var path = window.location.pathname;
  var currentFile = path.substring(path.lastIndexOf('/') + 1);

  if (currentFile === '') {
    currentFile = 'index.html';
  }

  var navLinks = document.querySelectorAll('.mit-navbar .nav-link');

  for (var i = 0; i < navLinks.length; i++) {
    var linkFile = navLinks[i].getAttribute('href');

    if (linkFile === currentFile) {
      navLinks[i].classList.add('active');
      navLinks[i].setAttribute('aria-current', 'page');
    }
  }
}

/**
 * Writes the current year into any element with id="footerYear".
 */
function stampFooterYear() {
  var yearSpan = document.getElementById('footerYear');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   Shared formatting helpers, used by the CRUD and analytics pages.
   -------------------------------------------------------------------------- */

/**
 * Formats a number as whole US dollars, e.g. 12000 -> "$12,000".
 */
function formatCurrency(value) {
  return '$' + Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Converts an ISO date string (yyyy-mm-dd) into "Mon d, yyyy".
 * Built from the string parts rather than new Date() so the date does not
 * shift by a day depending on the viewer's time zone.
 */
function formatDate(isoDate) {
  if (!isoDate) {
    return '';
  }

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var parts = isoDate.split('-');

  if (parts.length !== 3) {
    return isoDate;
  }

  var monthIndex = parseInt(parts[1], 10) - 1;
  var day = parseInt(parts[2], 10);

  return months[monthIndex] + ' ' + day + ', ' + parts[0];
}

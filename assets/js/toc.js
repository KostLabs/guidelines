document.addEventListener("DOMContentLoaded", function() {
  var content = document.getElementById('main-content');
  var toc = document.getElementById('sidebar');
  var headers = content.querySelectorAll('h1, h2, h3, h4, h5, h6');

  if (headers.length > 0 && toc) {
    // Add a heading to the TOC
    var tocHeading = document.createElement('h2');
    tocHeading.textContent = 'Table of Contents';
    tocHeading.className = 'text-xl font-bold mb-4 text-gray-800';
    toc.appendChild(tocHeading);
    
    var tocList = document.createElement('ul');
    tocList.classList.add('space-y-1');

    headers.forEach(function(header) {
      var level = parseInt(header.tagName.substr(1));
      var text = header.textContent;
      var id = header.id || text.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      header.id = id;

      var link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = text;
      link.classList.add('text-gray-700', 'hover:text-blue-600', 'block', 'py-1', 'transition', 'duration-150');

      var listItem = document.createElement('li');
      listItem.classList.add('toc-item', 'border-l-2', 'border-transparent', 'hover:border-blue-500', 'pl-' + Math.min((level - 1) * 3, 12), 'text-sm', 'level-' + level);

      // Make items expandable/collapsible
      if (level > 2) {
        listItem.classList.add('hidden');
      }

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    toc.appendChild(tocList);

    // Initialize toggle functionality for TOC
    initTOCToggle(toc);
  }
});

// Extracted to function so it can be reused for mobile menu
function initTOCToggle(container) {
  var tocItems = container.querySelectorAll('.toc-item');
  tocItems.forEach(function(item) {
    var link = item.querySelector('a');
    link.addEventListener('click', function(e) {
      // Don't prevent default - we still want it to navigate
      var currentLevel = getLevel(item);
      var nextItem = item.nextElementSibling;

      while (nextItem && getLevel(nextItem) > currentLevel) {
        if (getLevel(nextItem) === currentLevel + 1) {
          nextItem.classList.toggle('hidden');
        }
        nextItem = nextItem.nextElementSibling;
      }
    });
  });
}

function getLevel(element) {
  var classes = element.className.split(' ');
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].startsWith('level-')) {
      return parseInt(classes[i].split('-')[1]);
    }
  }
  return 0;
}
// Shared utilities for GoFixr tool pages
function loadRelatedTools(category) {
    fetch('../tools-data.json').then(function(r) { return r.json(); }).then(function(tools) {
        var related = tools.filter(function(t) { return t.category === category; }).slice(0, 3);
        var el = document.getElementById('relatedTools');
        if (!el) return;
        el.innerHTML = related.map(function(t) {
            return '<a href="' + t.slug + '.html" class="tool-card block">' +
                '<div class="text-3xl mb-2"><span role="img" aria-label="tool icon">' + t.icon + '</span></div>' +
                '<h4 class="font-bold">' + t.name + '</h4>' +
                '<p class="text-sm text-gray-600">' + t.desc + '</p></a>';
        }).join('');
    });
}

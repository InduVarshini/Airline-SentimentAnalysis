// Debugging helper - to show messages in browser console
function debug(message) {
    console.log(`[Tableau Dashboard] ${message}`);
}

debug('Script started');

// Global viz variable
let viz = null;
let vizLoaded = false;

// Tableau dashboard URL 
const url = "https://public.tableau.com/views/BritishAirwaysCustomerSentimentDashboard/Dashboard?:language=en-US&:display_count=n&:origin=viz_share_link";
const vizContainer = document.getElementById('vizContainer');

// Check if container exists
if (!vizContainer) {
    debug('ERROR: Viz container element not found');
} else {
    debug('Viz container found');
}

// Tableau options without width/height (handled in HTML/CSS)
const options = {
    hideTabs: true,
    hideToolbar: false,
    device: "desktop",
    onFirstInteractive: function() {
        debug('Dashboard is now interactive');
        vizLoaded = true;
        enableExportButtons();
    }
};

// Initialize visualization
function initViz() {
    try {
        debug('Initializing visualization...');
        
        // Ensure Tableau API is available
        if (typeof tableau === 'undefined' || !tableau.Viz) {
            debug('ERROR: Tableau API not loaded');
            loadTableauAPI();
            return;
        }

        createViz();
    } catch (error) {
        debug(`ERROR initializing viz: ${error.message}`);
    }
}

// Load Tableau API if not available
function loadTableauAPI() {
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
    script.onload = function() {
        debug('Tableau API loaded manually');
        createViz();
    };
    script.onerror = function() {
        debug('Failed to load Tableau API manually');
    };
    document.head.appendChild(script);
}

// Create Tableau viz
function createViz() {
    try {
        viz = new tableau.Viz(vizContainer, url, options);
        setupExportButtons();
        
        // Listen for errors
        viz.addEventListener(tableau.TableauEventName.ERROR, function(errorEvent) {
            debug(`Tableau error: ${errorEvent.getErrorMessage()}`);
        });
    } catch (error) {
        debug(`ERROR creating viz: ${error.message}`);
    }
}

// Setup export buttons
function setupExportButtons() {
    const exportPDF = document.getElementById('exportPDF');
    const exportImage = document.getElementById('exportImage');

    if (!exportPDF || !exportImage) {
        debug('Export buttons not found in DOM');
        return;
    }

    debug('Adding event listeners to export buttons');

    exportPDF.addEventListener('click', function(e) {
        e.preventDefault();
        exportDashboard('PDF');
    });

    exportImage.addEventListener('click', function(e) {
        e.preventDefault();
        exportDashboard('Image');
    });

    debug('Export buttons set up');
}

// Handle dashboard exports
function exportDashboard(type) {
    if (!viz || !vizLoaded) {
        debug(`ERROR: Cannot export ${type} - viz not ready`);
        alert('Dashboard is still loading. Please try again in a moment.');
        return;
    }

    try {
        debug(`Opening ${type} export dialog`);
        if (type === 'PDF') {
            viz.showExportPDFDialog();
        } else if (type === 'Image') {
            viz.showExportImageDialog();
        }
    } catch (error) {
        debug(`ERROR exporting ${type}: ${error.message}`);
        alert(`Could not generate ${type}. Please check if popups are blocked.`);
    }
}

// Enable export buttons once viz is interactive
function enableExportButtons() {
    const exportPDF = document.getElementById('exportPDF');
    const exportImage = document.getElementById('exportImage');

    if (exportPDF) {
        exportPDF.disabled = false;
    }

    if (exportImage) {
        exportImage.disabled = false;
    }

    debug('Export buttons enabled');
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded, starting initialization');
    setTimeout(initViz, 500);
});

// Additional check for older browsers
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    debug('Document already loaded, initializing now');
    setTimeout(initViz, 500);
}

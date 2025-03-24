// Debugging helper - shows messages in console
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

// Tableau options with improved event handling
const options = {
    hideTabs: true,
    hideToolbar: false,
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
        
        // Make sure Tableau API is available
        if (typeof tableau === 'undefined' || !tableau.Viz) {
            debug('ERROR: Tableau API not loaded');
            
            // Try to reload the API
            const script = document.createElement('script');
            script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
            script.onload = function() {
                debug('Tableau API loaded manually');
                initVizAfterApiLoad();
            };
            script.onerror = function() {
                debug('Failed to load Tableau API manually');
            };
            document.head.appendChild(script);
            return;
        }
        
        initVizAfterApiLoad();
    } catch (error) {
        debug(`ERROR initializing viz: ${error.message}`);
    }
}

function initVizAfterApiLoad() {
    try {
        // Create the viz
        viz = new tableau.Viz(vizContainer, url, options);
        
        // Add listeners for export buttons right away, but they'll check if viz is loaded
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
    
    // PDF export function
    exportPDF.addEventListener('click', function(e) {
        debug('PDF button clicked');
        e.preventDefault(); // Prevent any default action
        
        if (!viz || !vizLoaded) {
            debug('ERROR: Cannot export PDF - viz not ready');
            alert('Dashboard is still loading. Please try again in a moment.');
            return;
        }
        
        try {
            debug('Opening PDF export dialog');
            viz.showExportPDFDialog();
        } catch (error) {
            debug(`ERROR exporting PDF: ${error.message}`);
            alert('Could not generate PDF. Please check if popups are blocked.');
        }
    });
    
    // Image export function
    exportImage.addEventListener('click', function(e) {
        debug('Image button clicked');
        e.preventDefault(); // Prevent any default action
        
        if (!viz || !vizLoaded) {
            debug('ERROR: Cannot export image - viz not ready');
            alert('Dashboard is still loading. Please try again in a moment.');
            return;
        }
        
        try {
            debug('Opening image export dialog');
            viz.showExportImageDialog();
        } catch (error) {
            debug(`ERROR exporting image: ${error.message}`);
            alert('Could not generate image. Please check if popups are blocked.');
        }
    });
    
    debug('Export buttons set up');
}

// Enable the buttons once viz is interactive
function enableExportButtons() {
    const exportPDF = document.getElementById('exportPDF');
    const exportImage = document.getElementById('exportImage');
    
    if (exportPDF) {
        exportPDF.disabled = false;
        exportPDF.title = 'Generate PDF report';
    }
    
    if (exportImage) {
        exportImage.disabled = false;
        exportImage.title = 'Generate image of dashboard';
    }
    
    debug('Export buttons enabled');
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded, starting initialization');
    
    // Small delay to ensure everything is ready
    setTimeout(initViz, 500);
});

// Additional check for older browsers
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    debug('Document already loaded, initializing now');
    setTimeout(initViz, 500);
}

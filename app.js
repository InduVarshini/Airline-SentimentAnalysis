console.log('Is this working?');
let viz;
//Add Share Link to Tableau Public in here
const url = "https://public.tableau.com/views/BritishAirwaysCustomerSentimentDashboard/Dashboard?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link";
const vizContainer = document.getElementById('vizContainer');
const options = {
    hideTabs: true,
    height: 1000,
    width: 1200,
    onFirstInteraction: function() {
        workbook = viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();
        console.log("My dashboard is interactive");
    }
};

//create a function to generate the viz element
function initViz() {
    console.log('Executing the initViz function!');
    viz = new tableau.Viz(vizContainer, url, options);
}

// Function to ensure Tableau API is loaded before initializing
function waitForTableau() {
    if (typeof tableau !== 'undefined' && tableau.Viz) {
        console.log('Tableau API is loaded');
        initViz();
        setupExportButtons();
    } else {
        console.log('Waiting for Tableau API to load...');
        setTimeout(waitForTableau, 100);
    }
}

// Setup export buttons function
function setupExportButtons() {
    console.log('Setting up export buttons');
    const exportPDF = document.getElementById('exportPDF');
    const exportImage = document.getElementById('exportImage');
    
    if (!exportPDF || !exportImage) {
        console.error('Export buttons not found in DOM');
        return;
    }
    
    //click on the pdf button to generate pdf of dashboard
    function generatePDF() {
        console.log('PDF button clicked');
        if (viz && viz.showExportPDFDialog) {
            console.log('Showing PDF export dialog');
            viz.showExportPDFDialog();
        } else {
            console.error('Viz not loaded or PDF export not available');
        }
    }
    
    //click on image to generate image of dashboard
    function generateImage() {
        console.log('Image button clicked');
        if (viz && viz.showExportImageDialog) {
            console.log('Showing image export dialog');
            viz.showExportImageDialog();
        } else {
            console.error('Viz not loaded or image export not available');
        }
    }
    
    // Add event listeners
    exportPDF.addEventListener("click", generatePDF);
    exportImage.addEventListener("click", generateImage);
    console.log('Export buttons configured');
}

// run the initialization when the page loads
document.addEventListener("DOMContentLoaded", waitForTableau);

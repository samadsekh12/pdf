document.addEventListener('DOMContentLoaded', () => {
    const homeView = document.getElementById('home-view');
    const toolView = document.getElementById('tool-view');
    let currentTool = null;
    let originalImage = null;

    // Initialize the application
    function init() {
        populateTools();
        setupEventListeners();
    }

    // Event Listeners
    function setupEventListeners() {
        // Dropdown and navigation
        document.body.addEventListener('click', handleGlobalClick);
        
        // File handling
        document.body.addEventListener('change', handleFileChange);
        document.body.addEventListener('input', handleInputChange);
        
        // Drag and drop
        setupDragAndDrop();
    }

    // Your existing functions here (populateTools, navigateToTool, etc.)

    // Initialize the app
    init();
});

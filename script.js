// Tool functionality
function openTool(toolId) {
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    const modalTitle = document.getElementById('tool-modal-title');
    
    // Set the title based on the tool
    switch(toolId) {
        case 'pdf-to-word':
            modalTitle.textContent = 'Convert PDF to Word';
            break;
        case 'pdf-to-image':
            modalTitle.textContent = 'Convert PDF to Image';
            break;
        case 'merge-pdf':
            modalTitle.textContent = 'Merge PDF Files';
            break;
    }
    
    modal.show();
}

// Drag and drop functionality
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('active');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('active');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

function handleFiles(files) {
    // Here you would implement the file processing logic
    // For now, we'll just log the files
    console.log('Files received:', files);
    
    // Show processing state
    uploadArea.innerHTML = `
        <div class="processing">
            <i class="fas fa-spinner fa-spin"></i>
            <h4>Processing your file...</h4>
        </div>
    `;
    
    // Simulate processing
    setTimeout(() => {
        uploadArea.innerHTML = `
            <div class="success">
                <i class="fas fa-check-circle"></i>
                <h4>File processed successfully!</h4>
                <button class="btn btn-primary mt-3" onclick="downloadResult()">
                    Download Result
                </button>
            </div>
        `;
    }, 2000);
}

function downloadResult() {
    // Implement actual download functionality
    alert('Download would start here in a real implementation');
}

// Initialize tooltips and popovers if using Bootstrap
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

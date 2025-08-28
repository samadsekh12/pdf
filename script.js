// Configuration
const CONFIG = {
    currentUser: 'samadsekh12',
    currentDateTime: '2025-08-28 05:52:27',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: {
        'pdf-to-word': ['.pdf'],
        'pdf-to-excel': ['.pdf'],
        'pdf-to-ppt': ['.pdf'],
        'pdf-to-jpg': ['.pdf'],
        'word-to-pdf': ['.doc', '.docx'],
        'excel-to-pdf': ['.xls', '.xlsx'],
        'jpg-to-pdf': ['.jpg', '.jpeg', '.png'],
        'merge-pdf': ['.pdf']
    }
};

// Utility Functions
const Utils = {
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    showNotification(message, type = 'success') {
        const notification = `
            <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        document.getElementById('upload-area').insertAdjacentHTML('beforeend', notification);
    },

    validateFile(file, allowedExtensions) {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedExtensions.includes(extension)) {
            this.showNotification(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`, 'danger');
            return false;
        }
        
        if (file.size > CONFIG.maxFileSize) {
            this.showNotification('File size exceeds 100MB limit', 'danger');
            return false;
        }
        
        return true;
    }
};

// Tool Handlers
const ToolHandlers = {
    'pdf-to-word': function(file) {
        if (!Utils.validateFile(file, CONFIG.supportedFormats['pdf-to-word'])) return;
        
        // Show processing UI
        document.getElementById('upload-area').innerHTML = `
            <div class="processing-state text-center">
                <div class="spinner-border text-primary mb-3"></div>
                <h4>Converting PDF to Word</h4>
                <p class="text-muted">This may take a few moments...</p>
            </div>
        `;
        
        // Simulate conversion (replace with actual conversion logic)
        setTimeout(() => {
            Utils.showNotification('PDF converted to Word successfully!');
            // Add download link logic here
        }, 2000);
    },
    
    'pdf-to-excel': function(file) {
        if (!Utils.validateFile(file, CONFIG.supportedFormats['pdf-to-excel'])) return;
        
        document.getElementById('upload-area').innerHTML = `
            <div class="processing-state text-center">
                <div class="spinner-border text-primary mb-3"></div>
                <h4>Converting PDF to Excel</h4>
                <p class="text-muted">Extracting tables...</p>
            </div>
        `;
        
        setTimeout(() => {
            Utils.showNotification('PDF converted to Excel successfully!');
        }, 2000);
    },
    
    'pdf-to-jpg': function(file) {
        if (!Utils.validateFile(file, CONFIG.supportedFormats['pdf-to-jpg'])) return;
        
        document.getElementById('upload-area').innerHTML = `
            <div class="processing-state text-center">
                <div class="spinner-border text-primary mb-3"></div>
                <h4>Converting PDF to Images</h4>
                <p class="text-muted">Extracting pages...</p>
            </div>
        `;
        
        setTimeout(() => {
            Utils.showNotification('PDF converted to images successfully!');
        }, 2000);
    },
    
    'jpg-to-pdf': function(files) {
        const validFiles = Array.from(files).every(file => 
            Utils.validateFile(file, CONFIG.supportedFormats['jpg-to-pdf'])
        );
        
        if (!validFiles) return;
        
        document.getElementById('upload-area').innerHTML = `
            <div class="processing-state text-center">
                <div class="spinner-border text-primary mb-3"></div>
                <h4>Converting Images to PDF</h4>
                <p class="text-muted">Creating PDF file...</p>
            </div>
        `;
        
        setTimeout(() => {
            Utils.showNotification('Images converted to PDF successfully!');
        }, 2000);
    },
    
    'merge-pdf': function(files) {
        const validFiles = Array.from(files).every(file => 
            Utils.validateFile(file, CONFIG.supportedFormats['merge-pdf'])
        );
        
        if (!validFiles) return;
        
        document.getElementById('upload-area').innerHTML = `
            <div class="merge-pdf-options">
                <h4 class="mb-4">Selected PDFs</h4>
                <div class="selected-files mb-4">
                    ${Array.from(files).map((file, index) => `
                        <div class="file-item">
                            <i class="fas fa-file-pdf"></i>
                            <span>${file.name}</span>
                            <small class="text-muted">${Utils.formatFileSize(file.size)}</small>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary w-100" onclick="mergePDFs()">
                    <i class="fas fa-object-group me-2"></i>Merge PDFs
                </button>
            </div>
        `;
    }
};

// Event Handlers
function openTool(toolId) {
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    const modalTitle = document.getElementById('tool-modal-title');
    const fileInput = document.getElementById('file-input');
    
    // Reset upload area
    document.getElementById('upload-area').innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <h4>Drag & Drop Files Here</h4>
        <p>or</p>
        <button class="btn btn-primary" onclick="document.getElementById('file-input').click()">
            Choose Files
        </button>
        <input type="file" id="file-input" hidden>
        <div class="mt-3">
            <small class="text-muted">
                Supported formats: ${CONFIG.supportedFormats[toolId].join(', ')}
            </small>
        </div>
    `;
    
    // Configure modal for specific tool
    switch(toolId) {
        case 'pdf-to-word':
            modalTitle.textContent = 'Convert PDF to Word';
            fileInput.accept = '.pdf';
            fileInput.multiple = false;
            break;
        case 'pdf-to-excel':
            modalTitle.textContent = 'Convert PDF to Excel';
            fileInput.accept = '.pdf';
            fileInput.multiple = false;
            break;
        case 'pdf-to-ppt':
            modalTitle.textContent = 'Convert PDF to PowerPoint';
            fileInput.accept = '.pdf';
            fileInput.multiple = false;
            break;
        case 'pdf-to-jpg':
            modalTitle.textContent = 'Convert PDF to Images';
            fileInput.accept = '.pdf';
            fileInput.multiple = false;
            break;
        case 'word-to-pdf':
            modalTitle.textContent = 'Convert Word to PDF';
            fileInput.accept = '.doc,.docx';
            fileInput.multiple = false;
            break;
        case 'excel-to-pdf':
            modalTitle.textContent = 'Convert Excel to PDF';
            fileInput.accept = '.xls,.xlsx';
            fileInput.multiple = false;
            break;
        case 'jpg-to-pdf':
            modalTitle.textContent = 'Convert Images to PDF';
            fileInput.accept = '.jpg,.jpeg,.png';
            fileInput.multiple = true;
            break;
        case 'merge-pdf':
            modalTitle.textContent = 'Merge PDF Files';
            fileInput.accept = '.pdf';
            fileInput.multiple = true;
            break;
    }
    
    currentTool = toolId;
    modal.show();
}

// Handle file uploads
let currentTool = null;
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
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (!currentTool || !files.length) return;
    
    if (ToolHandlers[currentTool]) {
        ToolHandlers[currentTool](files.length === 1 ? files[0] : files);
    }
}

// Merge PDFs function
function mergePDFs() {
    document.getElementById('upload-area').innerHTML = `
        <div class="processing-state text-center">
            <div class="spinner-border text-primary mb-3"></div>
            <h4>Merging PDF Files</h4>
            <p class="text-muted">Combining your PDFs...</p>
        </div>
    `;
    
    setTimeout(() => {
        Utils.showNotification('PDFs merged successfully!');
    }, 2000);
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

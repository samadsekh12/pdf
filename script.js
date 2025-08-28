// Global variables
const currentUser = 'samadsekh12';
const currentDateTime = '2025-08-28 05:27:27';

// PDF to Word functionality
function handlePDFToWord(file) {
    const uploadArea = document.getElementById('upload-area');
    
    const options = `
        <div class="pdf-word-options">
            <div class="preview-container mb-4">
                <i class="fas fa-file-pdf fa-3x text-danger mb-3"></i>
                <h5>${file.name}</h5>
                <small class="text-muted">Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</small>
            </div>
            <div class="conversion-options">
                <div class="form-group mb-3">
                    <label class="form-label">Output Format</label>
                    <select class="form-select" id="word-format">
                        <option value="docx">Word Document (.docx)</option>
                        <option value="doc">Word 97-2003 (.doc)</option>
                    </select>
                </div>
                <div class="form-group mb-3">
                    <label class="form-label">OCR Language</label>
                    <select class="form-select" id="ocr-language">
                        <option value="eng">English</option>
                        <option value="fra">French</option>
                        <option value="deu">German</option>
                        <option value="spa">Spanish</option>
                    </select>
                </div>
                <button class="btn btn-primary w-100" onclick="convertPDFToWord('${file.name}')">
                    <i class="fas fa-file-word me-2"></i>Convert to Word
                </button>
            </div>
        </div>
    `;
    
    uploadArea.innerHTML = options;
}

function convertPDFToWord(filename) {
    showProcessingState('Converting PDF to Word...');
    
    // Simulate processing time
    setTimeout(() => {
        const outputFormat = document.getElementById('word-format').value;
        const newFilename = filename.replace('.pdf', `.${outputFormat}`);
        
        showSuccess(`Converted successfully! Download will start automatically.`);
        
        // In a real implementation, you would process the PDF here
        console.log(`Converting ${filename} to ${outputFormat}`);
    }, 2000);
}

// PDF to Image functionality
function handlePDFToImage(file) {
    const uploadArea = document.getElementById('upload-area');
    
    const options = `
        <div class="pdf-image-options">
            <div class="preview-container mb-4">
                <i class="fas fa-file-pdf fa-3x text-danger mb-3"></i>
                <h5>${file.name}</h5>
                <small class="text-muted">Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</small>
            </div>
            <div class="conversion-options">
                <div class="form-group mb-3">
                    <label class="form-label">Image Format</label>
                    <select class="form-select" id="image-format">
                        <option value="jpg">JPEG Image (.jpg)</option>
                        <option value="png">PNG Image (.png)</option>
                    </select>
                </div>
                <div class="form-group mb-3">
                    <label class="form-label">Resolution (DPI)</label>
                    <select class="form-select" id="image-dpi">
                        <option value="72">72 DPI (Screen)</option>
                        <option value="150">150 DPI (Standard)</option>
                        <option value="300">300 DPI (High Quality)</option>
                    </select>
                </div>
                <div class="form-check mb-3">
                    <input type="checkbox" class="form-check-input" id="extract-all" checked>
                    <label class="form-check-label">Convert all pages</label>
                </div>
                <button class="btn btn-primary w-100" onclick="convertPDFToImage('${file.name}')">
                    <i class="fas fa-images me-2"></i>Convert to Images
                </button>
            </div>
        </div>
    `;
    
    uploadArea.innerHTML = options;
}

function convertPDFToImage(filename) {
    showProcessingState('Converting PDF to Images...');
    
    // Simulate processing time
    setTimeout(() => {
        const imageFormat = document.getElementById('image-format').value;
        const dpi = document.getElementById('image-dpi').value;
        const extractAll = document.getElementById('extract-all').checked;
        
        showSuccess(`Converted successfully! Images will be downloaded as a ZIP file.`);
        
        // In a real implementation, you would process the PDF here
        console.log(`Converting ${filename} to ${imageFormat} at ${dpi} DPI`);
    }, 2000);
}

// Merge PDF functionality
function handleMergePDF(files) {
    const uploadArea = document.getElementById('upload-area');
    
    const filesList = Array.from(files)
        .map((file, index) => `
            <div class="pdf-file-item" id="pdf-${index}">
                <div class="d-flex align-items-center">
                    <i class="fas fa-file-pdf text-danger me-3"></i>
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${file.name}</h6>
                        <small class="text-muted">${(file.size / (1024 * 1024)).toFixed(2)} MB</small>
                    </div>
                    <div class="pdf-controls">
                        <button class="btn btn-sm btn-light" onclick="movePDF(${index}, 'up')">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="btn btn-sm btn-light" onclick="movePDF(${index}, 'down')">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="removePDF(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    
    const options = `
        <div class="merge-pdf-options">
            <h5 class="mb-3">Selected PDF Files</h5>
            <div class="pdf-files-list mb-4">
                ${filesList}
            </div>
            <div class="merge-options">
                <div class="form-group mb-3">
                    <label class="form-label">Output Filename</label>
                    <input type="text" class="form-control" id="output-filename" 
                        value="merged-pdf-${Date.now()}.pdf">
                </div>
                <button class="btn btn-primary w-100" onclick="mergePDFs()">
                    <i class="fas fa-object-group me-2"></i>Merge PDFs
                </button>
            </div>
        </div>
    `;
    
    uploadArea.innerHTML = options;
    window.pdfFiles = Array.from(files);
}

function movePDF(index, direction) {
    if (direction === 'up' && index > 0) {
        [window.pdfFiles[index], window.pdfFiles[index - 1]] = 
        [window.pdfFiles[index - 1], window.pdfFiles[index]];
    } else if (direction === 'down' && index < window.pdfFiles.length - 1) {
        [window.pdfFiles[index], window.pdfFiles[index + 1]] = 
        [window.pdfFiles[index + 1], window.pdfFiles[index]];
    }
    handleMergePDF(window.pdfFiles);
}

function removePDF(index) {
    window.pdfFiles.splice(index, 1);
    if (window.pdfFiles.length === 0) {
        resetUploadArea();
    } else {
        handleMergePDF(window.pdfFiles);
    }
}

function mergePDFs() {
    showProcessingState('Merging PDFs...');
    
    // Simulate processing time
    setTimeout(() => {
        const outputFilename = document.getElementById('output-filename').value;
        showSuccess(`PDFs merged successfully! Download will start automatically.`);
        
        // In a real implementation, you would merge the PDFs here
        console.log(`Merging ${window.pdfFiles.length} PDFs into ${outputFilename}`);
    }, 2000);
}

// Update the existing openTool function
function openTool(toolId) {
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    const modalTitle = document.getElementById('tool-modal-title');
    const fileInput = document.getElementById('file-input');
    
    switch(toolId) {
        case 'pdf-to-word':
            modalTitle.textContent = 'Convert PDF to Word';
            fileInput.accept = '.pdf';
            fileInput.multiple = false;
            break;
        case 'pdf-to-image':
            modalTitle.textContent = 'Convert PDF to Image';
            fileInput.accept = '.pdf';
            fileInput.multiple = false;
            break;
        case 'merge-pdf':
            modalTitle.textContent = 'Merge PDF Files';
            fileInput.accept = '.pdf';
            fileInput.multiple = true;
            break;
        // ... your existing cases for image tools ...
    }
    
    resetUploadArea();
    modal.show();
}

// Update the existing handleFiles function
function handleFiles(files) {
    const currentTool = document.getElementById('tool-modal-title').textContent;
    
    switch(currentTool) {
        case 'Convert PDF to Word':
            handlePDFToWord(files[0]);
            break;
        case 'Convert PDF to Image':
            handlePDFToImage(files[0]);
            break;
        case 'Merge PDF Files':
            handleMergePDF(files);
            break;
        // ... your existing cases for image tools ...
    }
}

// Utility functions
function resetUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    uploadArea.innerHTML = `
        <div class="upload-prompt text-center">
            <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3"></i>
            <h4>Drag & Drop your files here</h4>
            <p class="text-muted">or</p>
            <button class="btn btn-primary" onclick="document.getElementById('file-input').click()">
                Choose File
            </button>
            <input type="file" id="file-input" hidden>
        </div>
    `;
}

function showProcessingState(message) {
    const uploadArea = document.getElementById('upload-area');
    uploadArea.innerHTML = `
        <div class="processing text-center">
            <div class="spinner-border text-primary mb-3"></div>
            <h4>${message}</h4>
            <p class="text-muted">This may take a few moments...</p>
        </div>
    `;
}

function showSuccess(message) {
    const alert = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.getElementById('upload-area').insertAdjacentHTML('beforeend', alert);
}

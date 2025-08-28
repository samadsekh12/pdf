// Global Variables
const currentUser = 'samadsekh12';
const currentDateTime = '2025-08-28 05:35:11';

// Utility Functions
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const showNotification = (message, type = 'success') => {
    const notification = `
        <div class="notification notification-${type} animate-slide-in">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <div class="notification-progress"></div>
        </div>
    `;
    document.getElementById('notifications').innerHTML = notification;
    setTimeout(() => {
        document.getElementById('notifications').innerHTML = '';
    }, 3000);
};

// Image Resize Functionality
const handleImageResize = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = function() {
            const uploadArea = document.getElementById('upload-area');
            uploadArea.innerHTML = `
                <div class="tool-container animate-slide-in">
                    <div class="preview-section">
                        <div class="image-preview">
                            <img src="${e.target.result}" id="preview-image" alt="Preview">
                        </div>
                        <div class="image-info">
                            <div class="info-item">
                                <span class="label">Original Size:</span>
                                <span class="value">${this.width} × ${this.height}px</span>
                            </div>
                            <div class="info-item">
                                <span class="label">File Size:</span>
                                <span class="value">${formatFileSize(file.size)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel">
                        <h3 class="panel-title">Resize Options</h3>
                        <div class="settings-grid">
                            <div class="form-group">
                                <label class="form-label">Width (px)</label>
                                <input type="number" class="form-control" id="width-input" 
                                    value="${this.width}" onchange="updateDimensions('width')">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Height (px)</label>
                                <input type="number" class="form-control" id="height-input" 
                                    value="${this.height}" onchange="updateDimensions('height')">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-check">
                                <input type="checkbox" class="form-check-input" id="aspect-ratio" checked>
                                <span class="form-check-label">Maintain aspect ratio</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Quality</label>
                            <select class="form-select" id="quality-input">
                                <option value="1">High Quality</option>
                                <option value="0.8">Medium Quality</option>
                                <option value="0.6">Low Quality</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Output Format</label>
                            <select class="form-select" id="format-input">
                                <option value="image/jpeg">JPEG</option>
                                <option value="image/png">PNG</option>
                                <option value="image/webp">WebP</option>
                            </select>
                        </div>
                        <button class="btn btn-primary w-100" onclick="resizeImage()">
                            <i class="fas fa-compress-arrows-alt me-2"></i>Resize Image
                        </button>
                    </div>
                </div>
            `;
        };
    };
};

const updateDimensions = (changedDimension) => {
    if (!document.getElementById('aspect-ratio').checked) return;
    
    const img = document.querySelector('#preview-image');
    const originalRatio = img.naturalWidth / img.naturalHeight;
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    
    if (changedDimension === 'width') {
        const newWidth = parseInt(widthInput.value);
        heightInput.value = Math.round(newWidth / originalRatio);
    } else {
        const newHeight = parseInt(heightInput.value);
        widthInput.value = Math.round(newHeight * originalRatio);
    }
};

const resizeImage = () => {
    const img = document.querySelector('#preview-image');
    const width = parseInt(document.getElementById('width-input').value);
    const height = parseInt(document.getElementById('height-input').value);
    const quality = parseFloat(document.getElementById('quality-input').value);
    const format = document.getElementById('format-input').value;
    
    // Show processing state
    const btn = document.querySelector('.btn-primary');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    // Create canvas and resize
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Enable better quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw and export
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized-image-${Date.now()}.${format.split('/')[1]}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Reset button and show success
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-compress-arrows-alt me-2"></i>Resize Image';
        showNotification('Image resized successfully!');
    }, format, quality);
};

// Image to PDF Functionality
const handleImageToPDF = (files) => {
    const uploadArea = document.getElementById('upload-area');
    uploadArea.innerHTML = `
        <div class="tool-container animate-slide-in">
            <div class="preview-section">
                <div class="selected-images" id="selected-images">
                    <h4 class="section-title">Selected Images (${files.length})</h4>
                    <div class="image-grid" id="image-grid"></div>
                </div>
            </div>
            <div class="settings-panel">
                <h3 class="panel-title">PDF Options</h3>
                <div class="form-group">
                    <label class="form-label">Page Size</label>
                    <select class="form-select" id="page-size">
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Orientation</label>
                    <select class="form-select" id="orientation">
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Image Quality</label>
                    <select class="form-select" id="pdf-quality">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <button class="btn btn-primary w-100" id="generate-pdf-btn">
                    <i class="fas fa-file-pdf me-2"></i>Generate PDF
                </button>
            </div>
        </div>
    `;
    
    const imageGrid = document.getElementById('image-grid');
    window.pdfImages = [];
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (e) => {
            window.pdfImages.push(e.target.result);
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-item animate-slide-in';
            imgContainer.style = `--delay: ${index * 0.1}s`;
            imgContainer.innerHTML = `
                <img src="${e.target.result}" alt="Selected image ${index + 1}">
                <div class="image-overlay">
                    <span class="image-number">${index + 1}</span>
                </div>
            `;
            imageGrid.appendChild(imgContainer);
            
            if (window.pdfImages.length === files.length) {
                document.getElementById('generate-pdf-btn').onclick = generatePDF;
            }
        };
    });
};

const generatePDF = () => {
    const { jsPDF } = window.jspdf;
    const orientation = document.getElementById('orientation').value;
    const pageSize = document.getElementById('page-size').value;
    const quality = document.getElementById('pdf-quality').value;
    
    // Show processing state
    const btn = document.getElementById('generate-pdf-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';
    
    // Create PDF
    const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
    });
    
    let processedImages = 0;
    window.pdfImages.forEach((imgData, index) => {
        const img = new Image();
        img.src = imgData;
        
        img.onload = () => {
            if (index > 0) {
                doc.addPage();
            }
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Calculate dimensions
            const imgRatio = img.width / img.height;
            const pageRatio = pageWidth / pageHeight;
            
            let finalWidth, finalHeight;
            if (imgRatio > pageRatio) {
                finalWidth = pageWidth;
                finalHeight = pageWidth / imgRatio;
            } else {
                finalHeight = pageHeight;
                finalWidth = pageHeight * imgRatio;
            }
            
            // Center image
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;
            
            // Add image with quality setting
            doc.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight, null, 
                quality === 'high' ? 'FAST' : 'MEDIUM');
            
            processedImages++;
            
            if (processedImages === window.pdfImages.length) {
                const filename = `converted-images-${Date.now()}.pdf`;
                doc.save(filename);
                
                // Reset button and show success
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Generate PDF';
                showNotification('PDF generated successfully!');
            }
        };
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tool handlers
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    // Drag and drop handlers
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
        handleFiles(e.dataTransfer.files);
    });
    
    // File input handler
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
});

// File handling based on current tool
const handleFiles = (files) => {
    const currentTool = document.getElementById('tool-modal-title').textContent;
    
    switch(currentTool) {
        case 'Resize Image':
            handleImageResize(files[0]);
            break;
        case 'Convert Images to PDF':
            handleImageToPDF(files);
            break;
        default:
            console.log('Unknown tool');
    }
};

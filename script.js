// Professional Configuration
const CONFIG = {
    user: 'samadsekh12',
    currentDateTime: '2025-08-28 05:42:59',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedImageFormats: ['image/jpeg', 'image/png', 'image/gif'],
    pdfOptions: {
        defaultPageSize: 'a4',
        defaultOrientation: 'portrait',
        compression: 'MEDIUM'
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
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        const uploadArea = document.getElementById('upload-area');
        uploadArea.insertAdjacentHTML('beforeend', notification);
    },

    showLoading(message = 'Processing...') {
        return `
            <div class="loading-state">
                <div class="spinner-border text-primary mb-3"></div>
                <h5>${message}</h5>
            </div>
        `;
    }
};

// Image Resizer Module
const ImageResizer = {
    init(file) {
        if (!CONFIG.supportedImageFormats.includes(file.type)) {
            Utils.showNotification('Unsupported file format', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => this.setupUI(e.target.result, file);
        reader.readAsDataURL(file);
    },

    setupUI(imgData, file) {
        const img = new Image();
        img.onload = function() {
            const ui = `
                <div class="resize-container">
                    <div class="preview-section">
                        <img src="${imgData}" id="preview-image" class="img-preview">
                        <div class="image-info mt-3">
                            <div class="info-item">
                                <span>Original Size: ${this.width}x${this.height}px</span>
                                <span>File Size: ${Utils.formatFileSize(file.size)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="resize-controls mt-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label class="form-label">Width (px)</label>
                                    <input type="number" id="width-input" class="form-control" 
                                        value="${this.width}" onchange="ImageResizer.updateDimensions('width')">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label class="form-label">Height (px)</label>
                                    <input type="number" id="height-input" class="form-control" 
                                        value="${this.height}" onchange="ImageResizer.updateDimensions('height')">
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <div class="form-check">
                                <input type="checkbox" id="aspect-ratio" class="form-check-input" checked>
                                <label class="form-check-label">Maintain aspect ratio</label>
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <label class="form-label">Quality</label>
                            <select id="quality-input" class="form-select">
                                <option value="1">High Quality</option>
                                <option value="0.8">Medium Quality</option>
                                <option value="0.6">Low Quality</option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label class="form-label">Output Format</label>
                            <select id="format-input" class="form-select">
                                <option value="image/jpeg">JPEG</option>
                                <option value="image/png">PNG</option>
                                <option value="image/webp">WebP</option>
                            </select>
                        </div>
                        <button class="btn btn-primary w-100" onclick="ImageResizer.process()">
                            <i class="fas fa-compress-arrows-alt me-2"></i>Resize Image
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('upload-area').innerHTML = ui;
        };
        img.src = imgData;
    },

    updateDimensions(changedDimension) {
        if (!document.getElementById('aspect-ratio').checked) return;

        const img = document.getElementById('preview-image');
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
    },

    process() {
        const img = document.getElementById('preview-image');
        const width = parseInt(document.getElementById('width-input').value);
        const height = parseInt(document.getElementById('height-input').value);
        const quality = parseFloat(document.getElementById('quality-input').value);
        const format = document.getElementById('format-input').value;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        // Enable better quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

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

            Utils.showNotification('Image resized successfully!');
        }, format, quality);
    }
};

// PDF Generator Module
const PDFGenerator = {
    images: [],

    init(files) {
        this.images = [];
        const ui = `
            <div class="pdf-container">
                <div class="selected-images mb-4">
                    <h5 class="mb-3">Selected Images (${files.length})</h5>
                    <div class="image-grid" id="image-grid"></div>
                </div>
                <div class="pdf-controls">
                    <div class="form-group mb-3">
                        <label class="form-label">Page Size</label>
                        <select id="page-size" class="form-select">
                            <option value="a4">A4</option>
                            <option value="letter">Letter</option>
                            <option value="legal">Legal</option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Orientation</label>
                        <select id="orientation" class="form-select">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Image Quality</label>
                        <select id="pdf-quality" class="form-select">
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
        document.getElementById('upload-area').innerHTML = ui;

        this.loadImages(files);
    },

    loadImages(files) {
        const imageGrid = document.getElementById('image-grid');
        let loadedImages = 0;

        Array.from(files).forEach((file, index) => {
            if (!CONFIG.supportedImageFormats.includes(file.type)) {
                Utils.showNotification(`Unsupported file format: ${file.name}`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.images.push(e.target.result);

                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-item';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Image ${index + 1}">
                    <div class="image-overlay">
                        <span class="image-number">${index + 1}</span>
                    </div>
                `;
                imageGrid.appendChild(imgContainer);

                loadedImages++;
                if (loadedImages === files.length) {
                    document.getElementById('generate-pdf-btn').onclick = () => this.generatePDF();
                }
            };
            reader.readAsDataURL(file);
        });
    },

    generatePDF() {
        const { jsPDF } = window.jspdf;
        const orientation = document.getElementById('orientation').value;
        const pageSize = document.getElementById('page-size').value;
        const quality = document.getElementById('pdf-quality').value;

        const btn = document.getElementById('generate-pdf-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating PDF...';

        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize
        });

        let processedImages = 0;

        this.images.forEach((imgData, index) => {
            const img = new Image();
            img.src = imgData;

            img.onload = () => {
                if (index > 0) doc.addPage();

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

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

                const x = (pageWidth - finalWidth) / 2;
                const y = (pageHeight - finalHeight) / 2;

                doc.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight, null, 
                    quality === 'high' ? 'FAST' : 'MEDIUM');

                processedImages++;

                if (processedImages === this.images.length) {
                    doc.save(`converted-images-${Date.now()}.pdf`);
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Generate PDF';
                    Utils.showNotification('PDF generated successfully!');
                }
            };
        });
    }
};

// Event Handlers
function handleFiles(files) {
    const currentTool = document.getElementById('tool-modal-title').textContent;
    
    switch(currentTool) {
        case 'Resize Image':
            ImageResizer.init(files[0]);
            break;
        case 'Convert Images to PDF':
            PDFGenerator.init(files);
            break;
    }
}

function openTool(toolId) {
    const modal = new bootstrap.Modal(document.getElementById('tool-modal'));
    const modalTitle = document.getElementById('tool-modal-title');
    const fileInput = document.getElementById('file-input');
    
    switch(toolId) {
        case 'image-resize':
            modalTitle.textContent = 'Resize Image';
            fileInput.accept = 'image/*';
            fileInput.multiple = false;
            break;
        case 'image-to-pdf':
            modalTitle.textContent = 'Convert Images to PDF';
            fileInput.accept = 'image/*';
            fileInput.multiple = true;
            break;
    }
    
    modal.show();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
});

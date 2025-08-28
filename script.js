// Add to CONFIG object
const CONFIG = {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: {
        'resize-image': ['.jpg', '.jpeg', '.png', '.gif'],
        'image-to-pdf': ['.jpg', '.jpeg', '.png'],
        // ... other formats
    },
    imageSizes: {
        small: { width: 640, height: 480 },
        medium: { width: 1280, height: 720 },
        large: { width: 1920, height: 1080 },
        custom: { width: null, height: null }
    }
};

// Add these methods to ToolHandler class
class ToolHandler {
    // ... existing methods ...

    handleImageResize(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                const processZone = document.getElementById('processZone');
                processZone.innerHTML = `
                    <div class="resize-container">
                        <div class="preview-section mb-4">
                            <img src="${e.target.result}" id="preview-image" class="img-preview">
                            <div class="image-info mt-3">
                                <span>Original Size: ${img.width} × ${img.height}px</span>
                                <span>File Size: ${Utils.formatFileSize(file.size)}</span>
                            </div>
                        </div>
                        <div class="resize-controls">
                            <div class="mb-3">
                                <label class="form-label">Preset Sizes</label>
                                <select class="form-select" id="size-preset" onchange="toolHandler.updateResizeInputs()">
                                    <option value="custom">Custom Size</option>
                                    <option value="small">Small (640×480)</option>
                                    <option value="medium">Medium (1280×720)</option>
                                    <option value="large">Large (1920×1080)</option>
                                </select>
                            </div>
                            <div class="row mb-3">
                                <div class="col-6">
                                    <label class="form-label">Width (px)</label>
                                    <input type="number" id="width-input" class="form-control" 
                                        value="${img.width}" onchange="toolHandler.updateDimensions('width')">
                                </div>
                                <div class="col-6">
                                    <label class="form-label">Height (px)</label>
                                    <input type="number" id="height-input" class="form-control" 
                                        value="${img.height}" onchange="toolHandler.updateDimensions('height')">
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input type="checkbox" id="maintain-aspect" class="form-check-input" checked>
                                    <label class="form-check-label">Maintain aspect ratio</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Output Format</label>
                                <select class="form-select" id="output-format">
                                    <option value="image/jpeg">JPEG</option>
                                    <option value="image/png">PNG</option>
                                    <option value="image/webp">WebP</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Quality</label>
                                <input type="range" class="form-range" id="quality-input" 
                                    min="0" max="100" value="90">
                                <div class="d-flex justify-content-between">
                                    <small>Lower quality</small>
                                    <small>Better quality</small>
                                </div>
                            </div>
                            <button class="btn btn-primary w-100" onclick="toolHandler.processImageResize()">
                                <i class="fas fa-compress-arrows-alt me-2"></i>Resize Image
                            </button>
                        </div>
                    </div>
                `;
            };
        };
        reader.readAsDataURL(file);
    }

    updateResizeInputs() {
        const preset = document.getElementById('size-preset').value;
        const widthInput = document.getElementById('width-input');
        const heightInput = document.getElementById('height-input');
        
        if (preset !== 'custom') {
            const size = CONFIG.imageSizes[preset];
            widthInput.value = size.width;
            heightInput.value = size.height;
            this.updateDimensions('width');
        }
    }

    updateDimensions(changed) {
        if (!document.getElementById('maintain-aspect').checked) return;
        
        const img = document.getElementById('preview-image');
        const ratio = img.naturalWidth / img.naturalHeight;
        const widthInput = document.getElementById('width-input');
        const heightInput = document.getElementById('height-input');
        
        if (changed === 'width') {
            const width = parseInt(widthInput.value);
            heightInput.value = Math.round(width / ratio);
        } else {
            const height = parseInt(heightInput.value);
            widthInput.value = Math.round(height * ratio);
        }
    }

    processImageResize() {
        const img = document.getElementById('preview-image');
        const width = parseInt(document.getElementById('width-input').value);
        const height = parseInt(document.getElementById('height-input').value);
        const quality = parseInt(document.getElementById('quality-input').value) / 100;
        const format = document.getElementById('output-format').value;
        
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

    handleImageToPDF(files) {
        const processZone = document.getElementById('processZone');
        processZone.innerHTML = `
            <div class="pdf-container">
                <div class="selected-images mb-4">
                    <h5>Selected Images (${files.length})</h5>
                    <div class="image-grid" id="image-grid"></div>
                </div>
                <div class="pdf-controls">
                    <div class="mb-3">
                        <label class="form-label">Page Size</label>
                        <select class="form-select" id="page-size">
                            <option value="a4">A4</option>
                            <option value="letter">Letter</option>
                            <option value="legal">Legal</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Orientation</label>
                        <select class="form-select" id="orientation">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Image Quality</label>
                        <select class="form-select" id="pdf-quality">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <button class="btn btn-primary w-100" onclick="toolHandler.processImageToPDF()">
                        <i class="fas fa-file-pdf me-2"></i>Generate PDF
                    </button>
                </div>
            </div>
        `;

        const imageGrid = document.getElementById('image-grid');
        this.pdfImages = [];
        
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.pdfImages.push(e.target.result);
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-item';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Image ${index + 1}">
                    <div class="image-overlay">
                        <span class="image-number">${index + 1}</span>
                    </div>
                `;
                imageGrid.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    }

    processImageToPDF() {
        const { jsPDF } = window.jspdf;
        const orientation = document.getElementById('orientation').value;
        const pageSize = document.getElementById('page-size').value;
        const quality = document.getElementById('pdf-quality').value;
        
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize
        });
        
        this.pdfImages.forEach((imgData, index) => {
            if (index > 0) doc.addPage();
            
            const img = new Image();
            img.src = imgData;
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, null, 
                quality === 'high' ? 'FAST' : 'MEDIUM');
        });
        
        doc.save(`converted-images-${Date.now()}.pdf`);
        Utils.showNotification('PDF generated successfully!');
    }

    handleFiles(files) {
        if (!this.currentTool || !files.length) return;
        
        switch (this.currentTool) {
            case 'resize-image':
                this.handleImageResize(files[0]);
                break;
            case 'image-to-pdf':
                this.handleImageToPDF(files);
                break;
            // ... other cases
        }
    }
}

// Initialize
const toolHandler = new ToolHandler();

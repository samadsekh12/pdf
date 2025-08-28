// Global variables
const currentUser = 'samadsekh12';
const currentDateTime = '2025-08-28 05:39:24';

// Tool functionality
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
        // Other cases...
    }
    
    modal.show();
}

// Handle file uploads
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
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const currentTool = document.getElementById('tool-modal-title').textContent;
    
    switch(currentTool) {
        case 'Resize Image':
            handleImageResize(files[0]);
            break;
        case 'Convert Images to PDF':
            handleImageToPDF(files);
            break;
        default:
            showProcessingState();
            break;
    }
}

// Image resize functionality
function handleImageResize(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = function() {
            const resizeOptions = `
                <div class="resize-options">
                    <div class="preview-container mb-4">
                        <img src="${e.target.result}" id="preview-image" class="img-fluid">
                    </div>
                    <div class="controls">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label>Width (px)</label>
                                    <input type="number" id="width-input" class="form-control" 
                                        value="${this.width}" onchange="updateDimensions('width')">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label>Height (px)</label>
                                    <input type="number" id="height-input" class="form-control" 
                                        value="${this.height}" onchange="updateDimensions('height')">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input type="checkbox" id="aspect-ratio" class="form-check-input" checked>
                                <label class="form-check-label">Maintain aspect ratio</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label>Quality</label>
                            <select id="quality-input" class="form-select">
                                <option value="1">High</option>
                                <option value="0.8">Medium</option>
                                <option value="0.6">Low</option>
                            </select>
                        </div>
                        <button class="btn btn-primary w-100" onclick="resizeImage()">
                            Resize Image
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('upload-area').innerHTML = resizeOptions;
        }
    }
}

function updateDimensions(changedDimension) {
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
}

function resizeImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.querySelector('#preview-image');
    
    const width = parseInt(document.getElementById('width-input').value);
    const height = parseInt(document.getElementById('height-input').value);
    const quality = parseFloat(document.getElementById('quality-input').value);
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(img, 0, 0, width, height);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized-image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSuccess('Image resized successfully!');
    }, 'image/jpeg', quality);
}

// Image to PDF functionality
function handleImageToPDF(files) {
    const previewUI = `
        <div class="pdf-options">
            <div class="selected-images mb-4" id="selected-images"></div>
            <div class="controls">
                <div class="mb-3">
                    <label>Page Size</label>
                    <select id="page-size" class="form-select">
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label>Orientation</label>
                    <select id="orientation" class="form-select">
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>
                <button class="btn btn-primary w-100" id="generate-pdf-btn">
                    Generate PDF
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('upload-area').innerHTML = previewUI;
    
    // Preview images
    const selectedImages = document.getElementById('selected-images');
    window.pdfImages = [];
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (e) => {
            window.pdfImages.push(e.target.result);
            
            const imgPreview = document.createElement('div');
            imgPreview.className = 'image-preview-item';
            imgPreview.innerHTML = `
                <img src="${e.target.result}" alt="Selected image ${index + 1}">
                <span class="image-number">${index + 1}</span>
            `;
            selectedImages.appendChild(imgPreview);
            
            if (window.pdfImages.length === files.length) {
                document.getElementById('generate-pdf-btn').onclick = generatePDF;
            }
        }
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const orientation = document.getElementById('orientation').value;
    const pageSize = document.getElementById('page-size').value;
    
    const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
    });
    
    window.pdfImages.forEach((imgData, index) => {
        if (index > 0) {
            doc.addPage();
        }
        
        const img = new Image();
        img.src = imgData;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
    });
    
    doc.save(`converted-images-${Date.now()}.pdf`);
    showSuccess('PDF generated successfully!');
}

function showSuccess(message) {
    const alert = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.getElementById('upload-area').insertAdjacentHTML('beforeend', alert);
}

function showProcessingState() {
    document.getElementById('upload-area').innerHTML = `
        <div class="processing">
            <i class="fas fa-spinner fa-spin"></i>
            <h4>Processing...</h4>
        </div>
    `;
}

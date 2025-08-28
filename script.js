// Configuration
const CONFIG = {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: {
        'pdf-to-word': ['.pdf'],
        'pdf-to-ppt': ['.pdf'],
        'pdf-to-excel': ['.pdf'],
        'pdf-to-jpg': ['.pdf'],
        'word-to-pdf': ['.doc', '.docx'],
        'ppt-to-pdf': ['.ppt', '.pptx'],
        'excel-to-pdf': ['.xls', '.xlsx'],
        'jpg-to-pdf': ['.jpg', '.jpeg', '.png'],
        'merge-pdf': ['.pdf'],
        'split-pdf': ['.pdf'],
        'compress-pdf': ['.pdf'],
        'edit-pdf': ['.pdf'],
        'sign-pdf': ['.pdf'],
        'watermark-pdf': ['.pdf'],
        'protect-pdf': ['.pdf'],
        'unlock-pdf': ['.pdf'],
        'rotate-pdf': ['.pdf'],
        'organize-pdf': ['.pdf'],
        'repair-pdf': ['.pdf'],
        'html-to-pdf': []
    }
};

// PDF Tools Handler
class PDFTools {
    constructor() {
        this.currentTool = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Tool cards click handler
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => {
                this.currentTool = card.dataset.tool;
                this.openToolModal();
            });
        });

        // Upload zone handlers
        const uploadZone = document.getElementById('upload-zone');
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('active');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('active');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('active');
            this.handleFiles(e.dataTransfer.files);
        });

        // File input handler
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    openToolModal() {
        const modal = new bootstrap.Modal(document.getElementById('toolModal'));
        const modalTitle = document.getElementById('modal-title');
        const fileInput = document.getElementById('file-input');
        
        // Reset zones
        document.getElementById('upload-zone').style.display = 'block';
        document.getElementById('process-zone').style.display = 'none';
        
        // Configure modal based on tool
        switch(this.currentTool) {
            case 'merge-pdf':
                modalTitle.textContent = 'Merge PDF Files';
                fileInput.accept = '.pdf';
                fileInput.multiple = true;
                break;
            case 'split-pdf':
                modalTitle.textContent = 'Split PDF';
                fileInput.accept = '.pdf';
                fileInput.multiple = false;
                break;
            // Add cases for other tools
        }
        
        modal.show();
    }

    handleFiles(files) {
        if (!this.currentTool || !files.length) return;
        
        // Validate files
        if (!this.validateFiles(files)) return;
        
        // Show processing UI
        const processZone = document.getElementById('process-zone');
        processZone.style.display = 'block';
        document.getElementById('upload-zone').style.display = 'none';
        
        // Process files based on tool
        switch(this.currentTool) {
            case 'merge-pdf':
                this.handleMergePDF(files);
                break;
            case 'split-pdf':
                this.handleSplitPDF(files[0]);
                break;
            case 'compress-pdf':
                this.handleCompressPDF(files[0]);
                break;
            // Add cases for other tools
        }
    }

    validateFiles(files) {
        const allowedFormats = CONFIG.supportedFormats[this.currentTool];
        
        for (let file of files) {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedFormats.includes(extension)) {
                this.showNotification(`Invalid file format. Allowed: ${allowedFormats.join(', ')}`, 'error');
                return false;
            }
            
            if (file.size > CONFIG.maxFileSize) {
                this.showNotification('File size exceeds 100MB limit', 'error');
                return false;
            }
        }
        
        return true;
    }

    handleMergePDF(files) {
        const processZone = document.getElementById('process-zone');
        processZone.innerHTML = `
            <div class="selected-files mb-4">
                <h5>Selected Files (${files.length})</h5>
                ${Array.from(files).map((file, index) => `
                    <div class="file-item">
                        <i class="fas fa-file-pdf"></i>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <small class="text-muted">${this.formatFileSize(file.size)}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="pdfTools.removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary w-100" onclick="pdfTools.mergePDFs()">
                <i class="fas fa-object-group me-2"></i>Merge PDFs
            </button>
        `;
    }

    handleSplitPDF(file) {
        // Implementation for splitting PDF
    }

    handleCompressPDF(file) {
        // Implementation for compressing PDF
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize
const pdfTools = new PDFTools();

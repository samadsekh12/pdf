// Configuration
const CONFIG = {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: {
        'convert-pdf': ['.pdf'],
        'merge-pdf': ['.pdf'],
        'split-pdf': ['.pdf'],
        'compress-pdf': ['.pdf']
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

    updateDateTime() {
        const now = new Date();
        const datetime = now.toISOString()
            .replace('T', ' ')
            .slice(0, 19);
        document.getElementById('current-datetime').textContent = datetime;
    },

    showNotification(message, type = 'success') {
        // Implementation for showing notifications
    }
};

// Tool Handlers
class ToolHandler {
    constructor() {
        this.initializeEventListeners();
        this.currentTool = null;
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
        const uploadZone = document.getElementById('uploadZone');
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
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    openToolModal() {
        const modal = new bootstrap.Modal(document.getElementById('toolModal'));
        modal.show();
    }

    handleFiles(files) {
        if (!this.currentTool || !files.length) return;

        const processZone = document.getElementById('processZone');
        processZone.style.display = 'block';
        document.getElementById('uploadZone').style.display = 'none';

        // Show processing UI based on tool type
        switch (this.currentTool) {
            case 'convert-pdf':
                this.handleConvertPDF(files[0]);
                break;
            case 'merge-pdf':
                this.handleMergePDF(files);
                break;
            case 'split-pdf':
                this.handleSplitPDF(files[0]);
                break;
            case 'compress-pdf':
                this.handleCompressPDF(files[0]);
                break;
        }
    }

    handleConvertPDF(file) {
        processZone.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary mb-3"></div>
                <h4>Converting PDF</h4>
                <p>Please wait while we process your file...</p>
            </div>
        `;
        
        // Simulate processing
        setTimeout(() => {
            Utils.showNotification('PDF converted successfully!');
        }, 2000);
    }

    handleMergePDF(files) {
        // Implementation for merging PDFs
    }

    handleSplitPDF(file) {
        // Implementation for splitting PDF
    }

    handleCompressPDF(file) {
        // Implementation for compressing PDF
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start the datetime update
    Utils.updateDateTime();
    setInterval(() => Utils.updateDateTime(), 1000);

    // Initialize tool handler
    new ToolHandler();
});

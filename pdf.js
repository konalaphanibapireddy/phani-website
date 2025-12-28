const MAX_FILES = 2000;

// Get API base URL dynamically
function getApiBase() {
    const origin = window.location.origin;
    if (!origin || origin === 'null' || origin.startsWith('file://')) {
        // Fallback if opened as file or origin unavailable
        return 'http://localhost:3000/api';
    }
    return `${origin}/api`;
}

let allPDFs = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPDFs();
    setupFileUpload();
    setupSearch();
});

// Load all PDFs
async function loadPDFs() {
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/pdfs`);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        allPDFs = await response.json();
        displayPDFs(allPDFs);
        updateStats();
    } catch (error) {
        console.error('Error loading PDFs:', error);
        const errorMessage = error.message.includes('fetch') 
            ? 'Cannot connect to server. Make sure the server is running (npm start)'
            : error.message;
        showToast(errorMessage, 'error');
        document.getElementById('pdfsList').innerHTML = 
            `<div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p><strong>Connection Error</strong></p>
                <p>${errorMessage}</p>
                <p style="margin-top: 20px; font-size: 0.9em;">Make sure you:</p>
                <ol style="text-align: left; display: inline-block; margin-top: 10px;">
                    <li>Have started the server: <code>npm start</code></li>
                    <li>Are accessing via: <code>http://localhost:3000/pdf.html</code></li>
                    <li>Check the browser console (F12) for details</li>
                </ol>
            </div>`;
    }
}

// Setup file upload
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    
    // Click to upload
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });
    
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            uploadFile(files[0]);
        } else {
            showToast('Please drop a PDF file', 'error');
        }
    });
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.type === 'application/pdf') {
            uploadFile(file);
        } else {
            showToast('Please select a PDF file', 'error');
            fileInput.value = '';
        }
    }
}

// Upload file
async function uploadFile(file) {
    // Check file limit
    if (allPDFs.length >= MAX_FILES) {
        showToast(`File limit reached. Maximum ${MAX_FILES} files allowed.`, 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('pdf', file);
    
    const fileInfo = document.getElementById('fileInfo');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
    progressContainer.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressText.textContent = 'Uploading...';
    
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Upload complete!';
            
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                fileInfo.textContent = '';
                document.getElementById('fileInput').value = '';
                loadPDFs();
                showToast('PDF uploaded successfully!', 'success');
            }, 1000);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        progressContainer.classList.add('hidden');
        const errorMsg = error.message.includes('fetch') || error.message.includes('Failed')
            ? 'Cannot connect to server. Make sure the server is running (npm start)'
            : error.message;
        showToast(errorMsg, 'error');
        fileInfo.textContent = '';
    }
}

// Display PDFs
function displayPDFs(pdfs) {
    const pdfsList = document.getElementById('pdfsList');
    
    if (pdfs.length === 0) {
        pdfsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <p>No PDFs uploaded yet. Upload your first PDF to get started!</p>
            </div>
        `;
        return;
    }
    
    pdfsList.innerHTML = pdfs.map(pdf => {
        // Generate full link for viewing and copying (backward compatibility: use httpsLink if fullLink doesn't exist)
        let fullLink = pdf.fullLink || pdf.httpsLink;
        // If no full link exists, generate one from current origin
        if (!fullLink) {
            fullLink = `${window.location.origin}${pdf.link}`;
        }
        // For localhost, ensure we use HTTP not HTTPS
        fullLink = fullLink.replace('https://localhost', 'http://localhost');
        
        const escapedFileName = escapeHtml(pdf.originalName);
        
        return `
        <div class="pdf-card">
            <div class="pdf-icon">📄</div>
            <div class="pdf-name">${escapedFileName}</div>
            <div class="pdf-info">
                <div>Uploaded: ${formatDate(pdf.uploadDate)}</div>
                <div>Size: ${formatFileSize(pdf.size)}</div>
                <div style="font-size: 0.85em; color: #667eea; margin-top: 8px; padding: 8px; background: #f0f2ff; border-radius: 5px; word-break: break-all;">
                    🔗 <strong>Link:</strong> ${escapeHtml(fullLink)}
                </div>
            </div>
            <a href="${escapeHtml(fullLink)}" target="_blank" class="pdf-link">View PDF</a>
            <div class="pdf-actions">
                <button class="btn btn-small btn-edit" 
                        data-pdf-id="${pdf.id}"
                        data-pdf-name="${escapedFileName}"
                        data-pdf-original="${escapeHtml(pdf.originalName)}">
                    Edit
                </button>
                <button class="btn btn-small btn-copy" 
                        data-pdf-link="${escapeHtml(pdf.link)}"
                        data-pdf-full-link="${escapeHtml(fullLink)}"
                        data-pdf-name="${escapedFileName}">
                    Copy Link
                </button>
                <button class="btn btn-small btn-delete" 
                        data-pdf-id="${pdf.id}"
                        data-pdf-name="${escapedFileName}">
                    Delete
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    // Attach event listeners to copy buttons
    document.querySelectorAll('.btn-copy').forEach(button => {
        button.addEventListener('click', function() {
            const link = this.getAttribute('data-pdf-link');
            const fullLink = this.getAttribute('data-pdf-full-link');
            const fileName = this.getAttribute('data-pdf-name');
            copyLink(link, fileName, fullLink);
        });
    });
    
    // Attach event listeners to delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-pdf-id');
            const fileName = this.getAttribute('data-pdf-name');
            deletePDF(id, fileName);
        });
    });
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allPDFs.filter(pdf => 
            pdf.originalName.toLowerCase().includes(query)
        );
        displayPDFs(filtered);
    });
}

// Copy link to clipboard
async function copyLink(link, fileName, fullLink = '') {
    // Use provided full link if available, otherwise generate from current origin
    let linkToCopy;
    if (fullLink && fullLink.trim() !== '') {
        linkToCopy = fullLink;
    } else {
        // Generate full link from current origin
        linkToCopy = `${window.location.origin}${link}`;
    }
    
    try {
        await navigator.clipboard.writeText(linkToCopy);
        showToast(`Link for "${fileName}" copied to clipboard!`, 'success');
    } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = linkToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Link for "${fileName}" copied to clipboard!`, 'success');
    }
}

// Edit PDF
async function editPDF(id, fileName, originalName) {
    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h2>Edit PDF</h2>
                <button class="edit-modal-close">&times;</button>
            </div>
            <div class="edit-modal-body">
                <div class="edit-field">
                    <label for="edit-pdf-name">PDF Name:</label>
                    <input type="text" id="edit-pdf-name" value="${escapeHtml(originalName)}" class="edit-input">
                </div>
                <div class="edit-field">
                    <label for="edit-pdf-file">Replace PDF File (Optional):</label>
                    <input type="file" id="edit-pdf-file" accept=".pdf" class="edit-input">
                    <small>Leave empty to keep current file</small>
                </div>
                 <div class="edit-field">
                     <button type="button" class="btn btn-primary" id="edit-pdf-content-btn" style="width: 100%; margin-top: 10px;">
                         ✏️ Edit PDF Content (Click to Add Text)
                     </button>
                 </div>
            </div>
            <div class="edit-modal-footer">
                <button class="btn btn-primary" id="save-edit-btn">Save Changes</button>
                <button class="btn btn-secondary" id="cancel-edit-btn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal handlers
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    };
    
    modal.querySelector('.edit-modal-close').addEventListener('click', closeModal);
    modal.querySelector('#cancel-edit-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Edit PDF content handler - open PDF editor
    modal.querySelector('#edit-pdf-content-btn').addEventListener('click', async () => {
        try {
            const pdf = allPDFs.find(p => p.id === id);
            if (!pdf) {
                showToast('PDF not found', 'error');
                return;
            }
            const pdfUrl = `${window.location.origin}${pdf.link}`;
            await openPdfEditor(id, pdfUrl, closeModal);
        } catch (error) {
            console.error('Error opening PDF editor:', error);
            showToast('Error opening PDF editor: ' + error.message, 'error');
        }
    });
    
    // Save handler
    modal.querySelector('#save-edit-btn').addEventListener('click', async () => {
        const newName = modal.querySelector('#edit-pdf-name').value.trim();
        const newFile = modal.querySelector('#edit-pdf-file').files[0];
        
        if (!newName) {
            showToast('PDF name cannot be empty', 'error');
            return;
        }
        
        try {
            const API_BASE = getApiBase();
            const formData = new FormData();
            formData.append('originalName', newName);
            if (newFile) {
                formData.append('pdf', newFile);
            }
            
            const response = await fetch(`${API_BASE}/pdfs/${id}`, {
                method: 'PUT',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showToast('PDF updated successfully!', 'success');
                closeModal();
                loadPDFs(); // Reload the list
            } else {
                throw new Error(result.error || 'Update failed');
            }
        } catch (error) {
            console.error('Edit error:', error);
            showToast(error.message || 'Error updating PDF', 'error');
        }
    });
}

// Open PDF Editor for content editing
async function openPdfEditor(pdfId, pdfUrl, closeNameModal) {
    // Close the name edit modal first
    if (closeNameModal) closeNameModal();
    
    // Create PDF editor modal
    const editorModal = document.createElement('div');
    editorModal.className = 'edit-modal';
    editorModal.innerHTML = `
        <div class="edit-modal-content" style="max-width: 90vw; width: 1200px; height: 90vh; display: flex; flex-direction: column;">
            <div class="edit-modal-header">
                <h2>✏️ Edit PDF Content</h2>
                <button class="edit-modal-close">&times;</button>
            </div>
            <div class="edit-modal-body" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                <div style="display: flex; gap: 20px; flex: 1; overflow: hidden;">
                        <div style="flex: 1; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3>PDF Editor - Click to Add Text</h3>
                            <button class="btn btn-small" id="clear-all-text-btn" style="background: #dc3545; color: white;">Clear All Text</button>
                        </div>
                        <div style="position: relative; flex: 1; border: 2px solid #e0e0e0; border-radius: 8px; overflow: auto; background: #f5f5f5;">
                            <canvas id="pdf-canvas" style="display: block; margin: 0 auto; cursor: crosshair;"></canvas>
                            <div id="text-input-overlay" style="position: absolute; display: none;">
                                <input type="text" id="inline-text-input" style="padding: 5px; border: 2px solid #667eea; border-radius: 4px; font-size: 14px; min-width: 200px;">
                            </div>
                        </div>
                        <div style="margin-top: 10px;">
                            <label>Font Size:</label>
                            <input type="number" id="editor-font-size" value="12" min="8" max="72" class="edit-input" style="width: 100px; display: inline-block;">
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <h3>Added Text Elements</h3>
                        <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px; max-height: 400px; overflow-y: auto;">
                            <div id="text-elements-list" style="display: flex; flex-direction: column; gap: 5px;">
                                <p style="color: #999; font-size: 0.9em;">No text added yet. Click on the PDF to add text.</p>
                            </div>
                        </div>
                        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                            <small style="color: #666;">
                                <strong>Instructions:</strong><br>
                                1. Click anywhere on the PDF to add text<br>
                                2. Type your text and press Enter<br>
                                3. Click on text elements in the list to delete them<br>
                                4. Click "Save PDF Changes" when done
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="edit-modal-footer">
                <button class="btn btn-primary" id="save-pdf-content-btn">💾 Save PDF Changes</button>
                <button class="btn btn-secondary" id="cancel-pdf-edit-btn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(editorModal);
    setTimeout(() => editorModal.classList.add('show'), 10);
    
    let pdfDoc = null;
    let pdfBytes = null;
    let pdfJsDoc = null;
    let currentPage = 1;
    let canvas = null;
    let ctx = null;
    let textElements = []; // Array to store added text elements: {id, text, x, y, page, fontSize}
    let textIdCounter = 0;
    let isAddingText = false;
    let currentClickX = 0;
    let currentClickY = 0;
    
    // Load PDF with pdf-lib for editing
    try {
        if (!window.PDFLib) {
            throw new Error('PDF library not loaded. Please refresh the page.');
        }
        
        const { PDFDocument } = window.PDFLib;
        const response = await fetch(pdfUrl);
        pdfBytes = await response.arrayBuffer();
        pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Also load with PDF.js for rendering
        if (window.pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            pdfJsDoc = await loadingTask.promise;
            
            // Initialize canvas
            canvas = editorModal.querySelector('#pdf-canvas');
            ctx = canvas.getContext('2d');
            
            // Render first page
            await renderPage(1);
        }
    } catch (error) {
        console.error('Error loading PDF:', error);
        showToast('Error loading PDF: ' + error.message, 'error');
    }
    
    // Render PDF page to canvas
    async function renderPage(pageNum) {
        if (!pdfJsDoc || !canvas) return;
        
        try {
            const page = await pdfJsDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            // Draw all text elements on this page
            textElements.forEach(elem => {
                if (elem.page === pageNum) {
                    ctx.fillStyle = '#000000';
                    ctx.font = `${elem.fontSize || 12}px Arial`;
                    ctx.fillText(elem.text, elem.x, elem.y);
                }
            });
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    }
    
    // Update text elements list
    function updateTextElementsList() {
        const listContainer = editorModal.querySelector('#text-elements-list');
        if (!listContainer) return;
        
        if (textElements.length === 0) {
            listContainer.innerHTML = '<p style="color: #999; font-size: 0.9em;">No text added yet. Click on the PDF to add text.</p>';
            return;
        }
        
        listContainer.innerHTML = textElements.map((elem, index) => `
            <div style="padding: 8px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${elem.text}</strong><br>
                    <small style="color: #666;">Page ${elem.page}, Position: (${Math.round(elem.x)}, ${Math.round(elem.y)})</small>
                </div>
                <button class="btn btn-small btn-delete" data-text-id="${elem.id}" style="padding: 5px 10px; font-size: 0.8em;">Delete</button>
            </div>
        `).join('');
        
        // Attach delete handlers
        listContainer.querySelectorAll('[data-text-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-text-id'));
                textElements = textElements.filter(e => e.id !== id);
                updateTextElementsList();
                renderPage(currentPage);
            });
        });
    }
    
    // Canvas click handler - add text at clicked position
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (isAddingText) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Show text input at clicked position
            const overlay = editorModal.querySelector('#text-input-overlay');
            const input = editorModal.querySelector('#inline-text-input');
            
            if (!overlay || !input) return;
            
            overlay.style.display = 'block';
            overlay.style.left = (rect.left + x) + 'px';
            overlay.style.top = (rect.top + y - 10) + 'px';
            
            input.value = '';
            input.focus();
            
            currentClickX = x;
            currentClickY = y;
            isAddingText = true;
            
            // Handle text input
            const handleTextInput = (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    if (e.key === 'Enter' && input.value.trim()) {
                        const fontSize = parseFloat(editorModal.querySelector('#editor-font-size')?.value) || 12;
                        const textId = textIdCounter++;
                        
                        textElements.push({
                            id: textId,
                            text: input.value.trim(),
                            x: currentClickX,
                            y: currentClickY,
                            page: currentPage,
                            fontSize: fontSize
                        });
                        
                        updateTextElementsList();
                        renderPage(currentPage);
                        showToast('Text added! Click on it in the list to delete.', 'success');
                    }
                    
                    overlay.style.display = 'none';
                    input.removeEventListener('keydown', handleTextInput);
                    input.removeEventListener('blur', handleBlur);
                    isAddingText = false;
                }
            };
            
            const handleBlur = () => {
                overlay.style.display = 'none';
                input.removeEventListener('keydown', handleTextInput);
                input.removeEventListener('blur', handleBlur);
                isAddingText = false;
            };
            
            input.addEventListener('keydown', handleTextInput);
            input.addEventListener('blur', handleBlur);
        });
    }
    
    // Clear all text
    const clearBtn = editorModal.querySelector('#clear-all-text-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Clear all added text?')) {
                textElements = [];
                updateTextElementsList();
                renderPage(currentPage);
            }
        });
    }
    
    // Initialize text elements list
    updateTextElementsList();
    
    // Close modal handler
    const closeEditorModal = () => {
        editorModal.classList.remove('show');
        setTimeout(() => document.body.removeChild(editorModal), 300);
    };
    
    editorModal.querySelector('.edit-modal-close').addEventListener('click', closeEditorModal);
    editorModal.querySelector('#cancel-pdf-edit-btn').addEventListener('click', closeEditorModal);
    editorModal.addEventListener('click', (e) => {
        if (e.target === editorModal) closeEditorModal();
    });
    
    
    // Save PDF handler - apply all text elements to PDF
    editorModal.querySelector('#save-pdf-content-btn').addEventListener('click', async () => {
        try {
            if (!pdfDoc) {
                showToast('PDF not loaded', 'error');
                return;
            }
            
            // Reload PDF to get fresh copy
            const { PDFDocument, rgb } = window.PDFLib;
            const response = await fetch(pdfUrl);
            const freshBytes = await response.arrayBuffer();
            const freshPdfDoc = await PDFDocument.load(freshBytes);
            
            // Add all text elements to PDF
            textElements.forEach(elem => {
                const pages = freshPdfDoc.getPages();
                if (elem.page > 0 && elem.page <= pages.length) {
                    const page = pages[elem.page - 1]; // PDF pages are 0-indexed
                    const { width, height } = page.getSize();
                    
                    // Convert canvas coordinates to PDF coordinates
                    // Note: Canvas Y is top-down, PDF Y is bottom-up
                    const pdfX = elem.x * (width / canvas.width);
                    const pdfY = height - (elem.y * (height / canvas.height));
                    
                    page.drawText(elem.text, {
                        x: pdfX,
                        y: pdfY,
                        size: elem.fontSize || 12,
                        color: rgb(0, 0, 0),
                    });
                }
            });
            
            // Save the PDF
            const modifiedBytes = await freshPdfDoc.save();
            
            // Create FormData to send the updated PDF
            const formData = new FormData();
            const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
            formData.append('pdf', blob, 'edited.pdf');
            
            const API_BASE = getApiBase();
            const saveResponse = await fetch(`${API_BASE}/pdfs/${pdfId}`, {
                method: 'PUT',
                body: formData
            });
            
            const result = await saveResponse.json();
            
            if (saveResponse.ok) {
                showToast('PDF saved successfully!', 'success');
                closeEditorModal();
                loadPDFs(); // Reload the list
            } else {
                throw new Error(result.error || 'Save failed');
            }
        } catch (error) {
            console.error('Error saving PDF:', error);
            showToast('Error saving PDF: ' + error.message, 'error');
        }
    });
    
    // Initialize text elements list
    updateTextElementsList();
}

// Delete PDF
async function deletePDF(id, fileName) {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
        return;
    }
    
    try {
        const API_BASE = getApiBase();
        const response = await fetch(`${API_BASE}/pdfs/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('PDF deleted successfully', 'success');
            loadPDFs();
        } else {
            throw new Error(result.error || 'Delete failed');
        }
    } catch (error) {
        console.error('Delete error:', error);
        const errorMsg = error.message.includes('fetch') || error.message.includes('Failed')
            ? 'Cannot connect to server. Make sure the server is running (npm start)'
            : error.message;
        showToast(errorMsg, 'error');
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalFiles').textContent = allPDFs.length;
    document.getElementById('remainingFiles').textContent = Math.max(0, MAX_FILES - allPDFs.length);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}


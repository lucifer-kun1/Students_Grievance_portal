// Global variables
let currentUser = null;
let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let admins = JSON.parse(localStorage.getItem('admins')) || [
    { email: 'admin@cs.edu', password: 'admin123', department: 'Computer Science' },
    { email: 'admin@it.edu', password: 'admin123', department: 'IT' },
    { email: 'admin@ee.edu', password: 'admin123', department: 'Electronics' },
    { email: 'admin@me.edu', password: 'admin123', department: 'Mechanical' },
    { email: 'admin@ce.edu', password: 'admin123', department: 'Civil' },
    { email: 'admin@bcom.edu', password: 'admin123', department: 'BCOM' },
    { email: 'admin@bms.edu', password: 'admin123', department: 'BMS' },
    { email: 'admin@jrscience11.edu', password: 'admin123', department: 'JR.CLG Science-11' },
    { email: 'admin@jrscience12.edu', password: 'admin123', department: 'JR.CLG Science-12' },
    { email: 'admin@jrcommerce11.edu', password: 'admin123', department: 'JR.CLG Commerce-11' },
    { email: 'admin@jrcommerce12.edu', password: 'admin123', department: 'JR.CLG Commerce-12' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    checkAutoEscalation();
    setInterval(checkAutoEscalation, 60000); // Check every minute
});

function initializeApp() {
    // Set up form event listeners
    setupEventListeners();
    
    // Always ensure latest admin credentials are available
    localStorage.setItem('admins', JSON.stringify(admins));
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.type === 'student') {
            showStudentDashboard();
        } else if (currentUser.type === 'admin') {
            showAdminDashboard();
        }
    }
}

function setupEventListeners() {
    // Student forms
    document.getElementById('studentLoginForm').addEventListener('submit', handleStudentLogin);
    document.getElementById('studentRegisterForm').addEventListener('submit', handleStudentRegister);
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Modal close events
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Chatbot input
    document.getElementById('chatbotInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = ['home', 'about', 'contact'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// Modal functions
function showStudentLogin() {
    document.getElementById('studentLoginModal').style.display = 'block';
}

function showStudentRegister() {
    document.getElementById('studentRegisterModal').style.display = 'block';
}

function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Authentication functions
function handleStudentLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    const departmentToComplain = document.getElementById('studentDepartment').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { ...user, type: 'student', departmentToComplain };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('studentLoginModal');
        showNotification('Login successful!', 'success');
        showStudentDashboard();
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function handleStudentRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const studentId = document.getElementById('regStudentId').value;
    const department = document.getElementById('regDepartment').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already exists!', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        studentId,
        department,
        password,
        registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    closeModal('studentRegisterModal');
    showNotification('Registration successful! Please login.', 'success');
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const department = document.getElementById('adminDepartment').value;
    
    // Get fresh admin data from localStorage
    const freshAdmins = JSON.parse(localStorage.getItem('admins')) || admins;
    const admin = freshAdmins.find(a => a.email === email && a.password === password && a.department === department);
    
    if (admin) {
        currentUser = { ...admin, type: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('adminLoginModal');
        showNotification('Admin login successful!', 'success');
        showAdminDashboard();
    } else {
        showNotification('Invalid admin credentials! Please check email, password, and department.', 'error');
    }
}

// Dashboard functions
function showStudentDashboard() {
    document.body.innerHTML = `
        <div class="dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h1><i class="fas fa-user-graduate"></i> Student Dashboard</h1>
                    <div>
                        <span>Welcome, ${currentUser.name}</span>
                        <button class="btn btn-secondary" onclick="logout()" style="margin-left: 1rem;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${getStudentComplaints().length}</div>
                        <div class="stat-label">Total Complaints</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${getStudentComplaints().filter(c => c.status === 'pending').length}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${getStudentComplaints().filter(c => c.status === 'resolved').length}</div>
                        <div class="stat-label">Resolved</div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="dashboard-sidebar">
                        <h3 style="color: white; margin-bottom: 1rem;">Actions</h3>
                        <button class="btn btn-primary" onclick="showNewComplaintForm()" style="width: 100%; margin-bottom: 1rem;">
                            <i class="fas fa-plus"></i> New Complaint
                        </button>
                        <button class="btn btn-secondary" onclick="refreshComplaints()" style="width: 100%;">
                            <i class="fas fa-refresh"></i> Refresh
                        </button>
                    </div>
                    
                    <div class="dashboard-main">
                        <h3 style="margin-bottom: 1rem;">My Complaints</h3>
                        <div id="complaintsContainer">
                            ${renderStudentComplaints()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- New Complaint Modal -->
        <div id="newComplaintModal" class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <span class="close" onclick="closeModal('newComplaintModal')">&times;</span>
                <h2><i class="fas fa-plus"></i> Submit New Complaint</h2>
                <form id="newComplaintForm">
                    <div class="form-group">
                        <label for="complaintTitle">Title</label>
                        <input type="text" id="complaintTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="complaintCategory">Category</label>
                        <select id="complaintCategory" required>
                            <option value="">Select Category</option>
                            <option value="Academic">Academic</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Administrative">Administrative</option>
                            <option value="Hostel">Hostel</option>
                            <option value="Library">Library</option>
                            <option value="Canteen">Canteen</option>
                            <option value="Transport">Transport</option>
                            <option value="Fees">Fees</option>
                            <option value="Examination">Examination</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="complaintDescription">Description</label>
                        <textarea id="complaintDescription" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="complaintFiles">Attach Files (Optional)</label>
                        <div class="file-upload-area" onclick="document.getElementById('complaintFiles').click();">
                            <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: #667eea;"></i>
                            <p>Click to upload files or drag and drop</p>
                            <p style="font-size: 0.9rem; opacity: 0.8;">Supports: Images, Videos, Audio, Documents, PDFs (Max 5MB each)</p>
                            <input type="file" id="complaintFiles" multiple accept="*/*,.jpg,.jpeg,.png,.gif,.bmp,.webp,.mp4,.avi,.mov,.wmv,.mp3,.wav,.aac,.pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx" style="display: none;" onchange="handleFileUpload(this)">
                        </div>
                        <div id="uploadedFiles"></div>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Submit Complaint
                    </button>
                </form>
            </div>
        </div>
        
        ${getChatbotHTML()}
    `;
    
    // Add event listener for new complaint form
    document.getElementById('newComplaintForm').addEventListener('submit', handleNewComplaint);
    setupFileUpload();
}

function showAdminDashboard() {
    const departmentComplaints = getDepartmentComplaints();
    
    document.body.innerHTML = `
        <div class="dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h1><i class="fas fa-user-shield"></i> Admin Dashboard - ${currentUser.department}</h1>
                    <div>
                        <span>Welcome, Admin</span>
                        <button class="btn btn-secondary" onclick="logout()" style="margin-left: 1rem;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${departmentComplaints.length}</div>
                        <div class="stat-label">Total Complaints</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${departmentComplaints.filter(c => c.status === 'pending').length}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${departmentComplaints.filter(c => c.status === 'processing').length}</div>
                        <div class="stat-label">Processing</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${departmentComplaints.filter(c => c.status === 'escalated').length}</div>
                        <div class="stat-label">Escalated</div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="dashboard-sidebar">
                        <h3 style="color: white; margin-bottom: 1rem;">Filters</h3>
                        <div class="form-group">
                            <label style="color: white;">Status Filter</label>
                            <select id="statusFilter" onchange="filterComplaints()" style="width: 100%;">
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="resolved">Resolved</option>
                                <option value="escalated">Escalated</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="color: white;">Category Filter</label>
                            <select id="categoryFilter" onchange="filterComplaints()" style="width: 100%;">
                                <option value="">All Categories</option>
                                <option value="Academic">Academic</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Administrative">Administrative</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Library">Library</option>
                                <option value="Canteen">Canteen</option>
                                <option value="Transport">Transport</option>
                                <option value="Fees">Fees</option>
                                <option value="Examination">Examination</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button class="btn btn-secondary" onclick="refreshAdminComplaints()" style="width: 100%;">
                            <i class="fas fa-refresh"></i> Refresh
                        </button>
                    </div>
                    
                    <div class="dashboard-main">
                        <h3 style="margin-bottom: 1rem;">Department Complaints</h3>
                        <div id="adminComplaintsContainer">
                            ${renderAdminComplaints()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        ${getChatbotHTML()}
    `;
}

// Complaint functions
function getStudentComplaints() {
    return complaints.filter(c => c.studentId === currentUser.id);
}

function getDepartmentComplaints() {
    return complaints.filter(c => {
        const student = users.find(u => u.id === c.studentId);
        return student && student.department === currentUser.department;
    });
}

function renderStudentComplaints() {
    const studentComplaints = getStudentComplaints();
    
    if (studentComplaints.length === 0) {
        return '<p>No complaints submitted yet.</p>';
    }
    
    return studentComplaints.map(complaint => `
        <div class="complaint-card">
            <div class="complaint-header">
                <span class="complaint-id">#${complaint.id}</span>
                <span class="status-badge status-${complaint.status}">${complaint.status}</span>
            </div>
            <h4>${complaint.title}</h4>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <p><strong>Submitted:</strong> ${new Date(complaint.submittedAt).toLocaleDateString()}</p>
            ${complaint.files && complaint.files.length > 0 ? `
                <div>
                    <strong>Attachments:</strong>
                    ${complaint.files.map(file => `<span class="file-attachment">${file.name}</span>`).join(', ')}
                </div>
            ` : ''}
            ${complaint.adminResponse ? `
                <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <strong>Admin Response:</strong>
                    <p>${complaint.adminResponse}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderAdminComplaints() {
    const departmentComplaints = getDepartmentComplaints();
    
    if (departmentComplaints.length === 0) {
        return '<p>No complaints for this department.</p>';
    }
    
    return departmentComplaints.map(complaint => {
        const student = users.find(u => u.id === complaint.studentId);
        return `
            <div class="complaint-card">
                <div class="complaint-header">
                    <span class="complaint-id">#${complaint.id}</span>
                    <span class="status-badge status-${complaint.status}">${complaint.status}</span>
                </div>
                <h4>${complaint.title}</h4>
                <p><strong>Student:</strong> ${student ? student.name : 'Unknown'} (${student ? student.studentId : 'N/A'})</p>
                <p><strong>Category:</strong> ${complaint.category}</p>
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Submitted:</strong> ${new Date(complaint.submittedAt).toLocaleDateString()}</p>
                ${complaint.files && complaint.files.length > 0 ? `
                    <div>
                        <strong>Attachments:</strong>
                        ${complaint.files.map(file => `
                            <a href="#" onclick="downloadFile('${file.name}', '${file.data}')" class="file-attachment">
                                <i class="fas fa-download"></i> ${file.name}
                            </a>
                        `).join(', ')}
                    </div>
                ` : ''}
                <div style="margin-top: 1rem;">
                    <div class="form-group">
                        <label>Update Status:</label>
                        <select onchange="updateComplaintStatus(${complaint.id}, this.value)">
                            <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${complaint.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="escalated" ${complaint.status === 'escalated' ? 'selected' : ''}>Escalated</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Admin Response:</label>
                        <textarea placeholder="Enter your response..." onblur="updateAdminResponse(${complaint.id}, this.value)">${complaint.adminResponse || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showNewComplaintForm() {
    document.getElementById('newComplaintModal').style.display = 'block';
}

function handleNewComplaint(e) {
    e.preventDefault();
    
    const title = document.getElementById('complaintTitle').value;
    const category = document.getElementById('complaintCategory').value;
    const description = document.getElementById('complaintDescription').value;
    const files = window.uploadedFiles || [];
    
    const newComplaint = {
        id: Date.now(),
        studentId: currentUser.id,
        title,
        category,
        description,
        files,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        adminResponse: null
    };
    
    complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    closeModal('newComplaintModal');
    showNotification('Complaint submitted successfully!', 'success');
    refreshComplaints();
    
    // Reset form
    document.getElementById('newComplaintForm').reset();
    document.getElementById('uploadedFiles').innerHTML = '';
    window.uploadedFiles = [];
}

function setupFileUpload() {
    const fileArea = document.querySelector('.file-upload-area');
    
    fileArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileArea.classList.add('dragover');
    });
    
    fileArea.addEventListener('dragleave', () => {
        fileArea.classList.remove('dragover');
    });
    
    fileArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFileUpload({ files });
    });
}

function handleFileUpload(input) {
    const files = Array.from(input.files);
    window.uploadedFiles = window.uploadedFiles || [];
    
    files.forEach(file => {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`File "${file.name}" is too large (max 5MB). Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`, 'error');
            return;
        }
        
        // Check if file already exists
        if (window.uploadedFiles.some(f => f.name === file.name)) {
            showNotification(`File "${file.name}" is already uploaded`, 'error');
            return;
        }
        
        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
            'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv', 'video/webm',
            'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm', 'mp3', 'wav', 'aac', 'ogg', 'flac', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            showNotification(`File type "${file.type || fileExtension}" is not supported for file "${file.name}"`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            window.uploadedFiles.push({
                name: file.name,
                data: e.target.result,
                size: file.size,
                type: file.type || 'unknown',
                extension: fileExtension
            });
            updateFileDisplay();
            showNotification(`File "${file.name}" uploaded successfully`, 'success');
        };
        
        reader.onerror = function() {
            showNotification(`Error uploading file "${file.name}". Please try again.`, 'error');
        };
        
        // Handle different file types appropriately
        if (file.type.startsWith('text/')) {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    });
}

function updateFileDisplay() {
    const container = document.getElementById('uploadedFiles');
    
    function getFileIcon(fileName, fileType) {
        const ext = fileName.split('.').pop().toLowerCase();
        
        // Image files
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext) || fileType.startsWith('image/')) {
            return 'fas fa-image';
        }
        // Video files
        if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'].includes(ext) || fileType.startsWith('video/')) {
            return 'fas fa-video';
        }
        // Audio files
        if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(ext) || fileType.startsWith('audio/')) {
            return 'fas fa-music';
        }
        // PDF files
        if (ext === 'pdf' || fileType === 'application/pdf') {
            return 'fas fa-file-pdf';
        }
        // Word documents
        if (['doc', 'docx'].includes(ext) || fileType.includes('word')) {
            return 'fas fa-file-word';
        }
        // Excel files
        if (['xls', 'xlsx'].includes(ext) || fileType.includes('sheet')) {
            return 'fas fa-file-excel';
        }
        // PowerPoint files
        if (['ppt', 'pptx'].includes(ext) || fileType.includes('presentation')) {
            return 'fas fa-file-powerpoint';
        }
        // Text files
        if (['txt', 'md'].includes(ext) || fileType.startsWith('text/')) {
            return 'fas fa-file-alt';
        }
        // Default file icon
        return 'fas fa-file';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    container.innerHTML = window.uploadedFiles.map((file, index) => `
        <div class="uploaded-file-item" style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; padding: 0.8rem; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #667eea;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="${getFileIcon(file.name, file.type)}" style="color: #667eea; font-size: 1.2rem;"></i>
                <div>
                    <div style="font-weight: 600; color: #333;">${file.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" onclick="removeFile(${index})" style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 1.1rem; padding: 0.2rem;" title="Remove file">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(index) {
    window.uploadedFiles.splice(index, 1);
    updateFileDisplay();
}

function downloadFile(filename, data) {
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateComplaintStatus(complaintId, newStatus) {
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
        complaint.status = newStatus;
        complaint.lastUpdated = new Date().toISOString();
        localStorage.setItem('complaints', JSON.stringify(complaints));
        showNotification('Status updated successfully!', 'success');
    }
}

function updateAdminResponse(complaintId, response) {
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
        complaint.adminResponse = response;
        complaint.lastUpdated = new Date().toISOString();
        localStorage.setItem('complaints', JSON.stringify(complaints));
    }
}

// Auto-escalation function
function checkAutoEscalation() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    complaints.forEach(complaint => {
        if (complaint.status === 'pending' && new Date(complaint.submittedAt) < threeDaysAgo) {
            complaint.status = 'escalated';
            complaint.escalatedAt = new Date().toISOString();
            complaint.adminResponse = (complaint.adminResponse || '') + '\n[SYSTEM] This complaint has been automatically escalated due to no response within 3 days.';
        }
    });
    
    localStorage.setItem('complaints', JSON.stringify(complaints));
}

function filterComplaints() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredComplaints = getDepartmentComplaints();
    
    if (statusFilter) {
        filteredComplaints = filteredComplaints.filter(c => c.status === statusFilter);
    }
    
    if (categoryFilter) {
        filteredComplaints = filteredComplaints.filter(c => c.category === categoryFilter);
    }
    
    document.getElementById('adminComplaintsContainer').innerHTML = renderFilteredComplaints(filteredComplaints);
}

function renderFilteredComplaints(filteredComplaints) {
    if (filteredComplaints.length === 0) {
        return '<p>No complaints match the selected filters.</p>';
    }
    
    return filteredComplaints.map(complaint => {
        const student = users.find(u => u.id === complaint.studentId);
        return `
            <div class="complaint-card">
                <div class="complaint-header">
                    <span class="complaint-id">#${complaint.id}</span>
                    <span class="status-badge status-${complaint.status}">${complaint.status}</span>
                </div>
                <h4>${complaint.title}</h4>
                <p><strong>Student:</strong> ${student ? student.name : 'Unknown'} (${student ? student.studentId : 'N/A'})</p>
                <p><strong>Category:</strong> ${complaint.category}</p>
                <p><strong>Description:</strong> ${complaint.description}</p>
                <p><strong>Submitted:</strong> ${new Date(complaint.submittedAt).toLocaleDateString()}</p>
                ${complaint.files && complaint.files.length > 0 ? `
                    <div>
                        <strong>Attachments:</strong>
                        ${complaint.files.map(file => `
                            <a href="#" onclick="downloadFile('${file.name}', '${file.data}')" class="file-attachment">
                                <i class="fas fa-download"></i> ${file.name}
                            </a>
                        `).join(', ')}
                    </div>
                ` : ''}
                <div style="margin-top: 1rem;">
                    <div class="form-group">
                        <label>Update Status:</label>
                        <select onchange="updateComplaintStatus(${complaint.id}, this.value)">
                            <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${complaint.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="escalated" ${complaint.status === 'escalated' ? 'selected' : ''}>Escalated</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Admin Response:</label>
                        <textarea placeholder="Enter your response..." onblur="updateAdminResponse(${complaint.id}, this.value)">${complaint.adminResponse || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function refreshComplaints() {
    document.getElementById('complaintsContainer').innerHTML = renderStudentComplaints();
}

function refreshAdminComplaints() {
    // Force reload the complaints data and refresh dashboard
    if (currentUser && currentUser.type === 'admin') {
        // Update stats first
        updateAdminStats();
        // Then update complaints list
        document.getElementById('adminComplaintsContainer').innerHTML = renderAdminComplaints();
        showNotification('Complaints refreshed!', 'success');
    }
}

function updateAdminStats() {
    const departmentComplaints = getDepartmentComplaints();
    
    // Update stats in the dashboard
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = departmentComplaints.length;
        statCards[1].textContent = departmentComplaints.filter(c => c.status === 'pending').length;
        statCards[2].textContent = departmentComplaints.filter(c => c.status === 'processing').length;
        statCards[3].textContent = departmentComplaints.filter(c => c.status === 'escalated').length;
    }
}

// Chatbot functions
function getChatbotHTML() {
    return `
        <!-- AI Chatbot Button -->
        <div class="chatbot-container">
            <button class="chatbot-btn" onclick="toggleChatbot()">
                <i class="fas fa-robot"></i>
                <span class="chatbot-text">AI Support 24/7</span>
            </button>
        </div>

        <!-- AI Chatbot Modal -->
        <div id="chatbotModal" class="modal chatbot-modal">
            <div class="modal-content chatbot-content">
                <div class="chatbot-header">
                    <h3><i class="fas fa-robot"></i> AI Support Assistant</h3>
                    <span class="close" onclick="closeChatbot()">&times;</span>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="message bot-message">
                        <i class="fas fa-robot"></i>
                        <div class="message-content">
                            Hello! I'm your AI support assistant. How can I help you today?
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Type your message...">
                    <button onclick="sendChatMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function toggleChatbot() {
    document.getElementById('chatbotModal').style.display = 'block';
}

function closeChatbot() {
    document.getElementById('chatbotModal').style.display = 'none';
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    if (sender === 'bot') {
        messageElement.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">${message}</div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced AI responses with comprehensive coverage
    const responses = {
        // Greetings
        'hello': 'Hello! I\'m your 24/7 AI assistant. How can I help you with the grievance portal today?',
        'hi': 'Hi there! Welcome to the College Grievance Portal. I\'m here to assist you with any questions or concerns.',
        'good morning': 'Good morning! How can I assist you with your grievances today?',
        'good afternoon': 'Good afternoon! What can I help you with regarding the portal?',
        'good evening': 'Good evening! I\'m here to help with any portal-related questions.',
        
        // Help and guidance
        'help': 'I can assist you with:\n• Student registration and login\n• Submitting and tracking complaints\n• File uploads and downloads\n• Understanding the complaint process\n• Technical support\n• Department information\n• Admin contact details\n\nWhat would you like help with?',
        
        // Complaint related
        'complaint': 'To submit a complaint:\n1. Register/Login as a student\n2. Click "New Complaint" in your dashboard\n3. Fill in title, category, and description\n4. Upload supporting files (optional)\n5. Submit\n\nYour complaint will be automatically routed to the appropriate department admin.',
        'submit': 'To submit a complaint, go to your student dashboard and click the "New Complaint" button. Fill in all required details and attach any relevant files.',
        'track': 'You can track your complaints in the student dashboard. Each complaint shows its current status and any admin responses.',
        
        // Status information
        'status': 'Complaint statuses:\n• Pending: Newly submitted, awaiting admin review\n• Processing: Admin is working on your complaint\n• Resolved: Complaint has been addressed\n• Escalated: Auto-escalated after 3 days (priority handling)',
        'pending': 'Pending complaints are newly submitted and awaiting admin review. Admins typically respond within 24-48 hours.',
        'processing': 'Processing status means an admin is actively working on your complaint. You should receive updates soon.',
        'resolved': 'Resolved complaints have been addressed by the admin. Check the admin response for details.',
        'escalated': 'Escalated complaints receive priority attention. This happens automatically after 3 days without response.',
        
        // File handling
        'file': 'File upload guidelines:\n• Maximum size: 5MB per file\n• Multiple files supported\n• Formats: PDF, DOC, DOCX, images, etc.\n• Drag & drop or click to browse\n• Admins can securely download your files',
        'upload': 'To upload files: Click the upload area in the complaint form, or drag and drop files directly. Max 5MB per file.',
        'download': 'Admins can download complaint files through secure links. Students can see their uploaded files in complaint details.',
        
        // Department information
        'department': 'Available departments:\n• Computer Science\n• Information Technology\n• Electronics\n• Mechanical\n• Civil\n• BCOM\n• BMS\n• JR.CLG Science (11th & 12th)\n• JR.CLG Commerce (11th & 12th)',
        'computer science': 'Computer Science department handles programming, software, database, and CS curriculum related complaints.',
        'it': 'Information Technology department manages IT infrastructure, network, and technology-related issues.',
        'electronics': 'Electronics department handles circuit design, embedded systems, and electronics lab related complaints.',
        'mechanical': 'Mechanical department covers machine design, thermodynamics, and mechanical lab issues.',
        'civil': 'Civil department handles construction, structural design, and civil engineering related complaints.',
        'bcom': 'BCOM department manages commerce, accounting, and business studies related issues.',
        'bms': 'BMS department handles business management and administration related complaints.',
        'junior college': 'Junior College sections for 11th and 12th with Science and Commerce streams are available.',
        
        // Admin information
        'admin': 'Admin accounts are available for department management. Please contact the college administration for admin access credentials.',
        'admin login': 'To access admin features, use the Admin Login button on the main page. Admin credentials are managed by the college administration.',
        'login': 'Students can register and login. Admins use pre-configured accounts with department-specific access.',
        'password': 'Forgot password? Currently using localStorage - clear browser data to reset. In production, this would have proper password recovery.',
        
        // Technical support
        'technical': 'For technical issues:\n1. Try refreshing the page\n2. Clear browser cache\n3. Check internet connection\n4. Try different browser\n5. Contact developer: vaibhavchoudhary@gmail.com',
        'error': 'If you\'re experiencing errors, try refreshing the page or clearing your browser cache. The portal works best on modern browsers.',
        'browser': 'Supported browsers: Chrome, Firefox, Safari, Edge. Internet Explorer is not recommended.',
        'mobile': 'The portal is fully responsive and works on mobile devices. Use portrait mode for best experience.',
        
        // Process information
        'escalation': 'Auto-escalation process:\n• Triggered after 3 days of no admin response\n• Status automatically changes to "Escalated"\n• System adds escalation notice\n• Escalated complaints get priority handling',
        'time': 'Typical response times:\n• Admin acknowledgment: 24-48 hours\n• Initial response: 2-3 business days\n• Resolution: Depends on complexity\n• Auto-escalation: After 3 days',
        
        // Developer information
        'developer': 'Portal developed by Vaibhav Choudhary\nEmail: vaibhavchoudhary@gmail.com\nWebsite Developer specializing in web applications',
        'contact': 'Contact information:\n• Developer: Vaibhav Choudhary (vaibhavchoudhary@gmail.com)\n• College Admin: admin@college.edu\n• 24/7 Support: This AI chatbot',
        
        // Features
        'features': 'Portal features:\n• Student registration & login\n• Complaint submission with file upload\n• Real-time status tracking\n• Department-wise routing\n• Admin dashboard\n• Auto-escalation\n• 24/7 AI support\n• Mobile responsive design',
        
        // Security
        'security': 'Security features:\n• Password-based authentication\n• Department-level access control\n• Secure file handling\n• Session management\n• Input validation',
        
        // General questions
        'how': 'I can help explain how to use any feature of the portal. What specifically would you like to know how to do?',
        'what': 'I can explain what any feature does. What would you like to know about?',
        'why': 'I can explain why certain processes exist. What would you like to understand?',
        'when': 'I can provide timing information for various processes. What timeframe are you asking about?',
        'where': 'I can help you find features in the portal. What are you looking for?',
        
        // Appreciation
        'thank': 'You\'re welcome! I\'m always here to help. Is there anything else you\'d like to know?',
        'thanks': 'Glad I could help! Feel free to ask if you have more questions.',
        'appreciate': 'Happy to assist! Don\'t hesitate to reach out if you need more help.',
        
        // Default responses for unmatched queries
        'default': 'I\'m here to help with any questions about the College Grievance Portal. You can ask me about:\n\n• How to submit complaints\n• Checking status\n• Department information\n• Technical support\n• Admin contacts\n• Portal features\n\nWhat would you like to know?'
    };
    
    // Check for keyword matches
    for (const keyword in responses) {
        if (keyword !== 'default' && lowerMessage.includes(keyword)) {
            return responses[keyword];
        }
    }
    
    // Advanced pattern matching for more natural responses
    if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
        return 'To register: Click "Register" on the Student Portal card, fill in your details including name, email, student ID, department, and password. After registration, you can login and start submitting complaints.';
    }
    
    if (lowerMessage.includes('forgot') || lowerMessage.includes('reset')) {
        return 'This demo uses localStorage for data. To reset, clear your browser data. In a production system, there would be proper password recovery via email.';
    }
    
    if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
        return 'Currently, complaints cannot be deleted once submitted to maintain audit trail. You can contact the relevant department admin for assistance.';
    }
    
    if (lowerMessage.includes('edit') || lowerMessage.includes('modify')) {
        return 'Complaints cannot be edited after submission to maintain integrity. If you need changes, submit a new complaint or contact the admin with clarifications.';
    }
    
    if (lowerMessage.includes('notification') || lowerMessage.includes('alert')) {
        return 'The portal shows real-time notifications for actions like login, complaint submission, and status updates. In production, email notifications would also be available.';
    }
    
    if (lowerMessage.includes('backup') || lowerMessage.includes('data')) {
        return 'Your data is stored in browser localStorage. In production, data would be stored in secure databases with regular backups.';
    }
    
    // Return default response if no match found
    return responses.default;
}

// Utility functions
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for global access
window.showSection = showSection;
window.showStudentLogin = showStudentLogin;
window.showStudentRegister = showStudentRegister;
window.showAdminLogin = showAdminLogin;
window.closeModal = closeModal;
window.logout = logout;
window.showNewComplaintForm = showNewComplaintForm;
window.refreshComplaints = refreshComplaints;
window.refreshAdminComplaints = refreshAdminComplaints;
window.updateComplaintStatus = updateComplaintStatus;
window.updateAdminResponse = updateAdminResponse;
window.filterComplaints = filterComplaints;
window.handleFileUpload = handleFileUpload;
window.removeFile = removeFile;
window.downloadFile = downloadFile;
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.sendChatMessage = sendChatMessage;

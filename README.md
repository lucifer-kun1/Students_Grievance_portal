# College Grievance Portal - Enhanced Version

A comprehensive web-based college grievance portal with advanced features including student registration, complaint management, file uploads, admin dashboard, auto-escalation, and AI chatbot support.

## 🌟 Features

### Student Features
- **Student Registration & Login**: Secure registration and login system
- **Complaint Submission**: Submit detailed complaints with categorization
- **File Upload Support**: Upload multiple files (up to 5MB each) with drag-and-drop
- **Student Dashboard**: Track complaint status and view admin responses
- **Real-time Status Updates**: View complaint progress in real-time
- **24/7 AI Chatbot**: Get instant help and support

### Admin Features
- **Department-based Admin Login**: Secure login with department access control
- **Complaint Management**: View and manage department-specific complaints
- **Status Updates**: Update complaint status and provide responses
- **File Downloads**: Securely download complaint attachments
- **Advanced Filtering**: Filter complaints by status and category
- **Auto-escalation Monitoring**: View automatically escalated complaints

### System Features
- **Auto-escalation**: Complaints automatically escalate after 3 days of no response
- **Department-wise Routing**: Complaints routed to appropriate department admins
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **3D Styling**: Modern 3D effects with gradient colors and animations
- **Real-time Notifications**: Instant feedback for all actions

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download all files to your desired directory
2. Open `index.html` in your web browser
3. The portal is ready to use!

## 📖 User Guide

### For Students

#### Registration
1. Click "Register" on the Student Portal card
2. Fill in your details:
   - Full Name
   - Email
   - Student ID
   - Department
   - Password
3. Click "Register" to create your account

#### Logging In
1. Click "Login" on the Student Portal card
2. Enter your email and password
3. Click "Login" to access your dashboard

#### Submitting a Complaint
1. In your dashboard, click "New Complaint"
2. Fill in the complaint details:
   - Title
   - Category (Academic, Infrastructure, Faculty, etc.)
   - Description
3. Upload files if needed (drag & drop or click to browse)
4. Click "Submit Complaint"

#### Tracking Complaints
- View all your complaints in the dashboard
- Check status updates and admin responses
- Use the refresh button to get latest updates

### For Admins

#### Pre-configured Admin Accounts
The system comes with pre-configured admin accounts for testing:

- **Computer Science**: admin@cs.edu / admin123
- **Information Technology**: admin@it.edu / admin123
- **Electronics**: admin@ee.edu / admin123
- **Mechanical**: admin@me.edu / admin123
- **Civil**: admin@ce.edu / admin123
- **BCOM**: admin@bcom.edu / admin123
- **BMS**: admin@bms.edu / admin123
- **JR.CLG Science-11**: admin@jrscience11.edu / admin123
- **JR.CLG Science-12**: admin@jrscience12.edu / admin123
- **JR.CLG Commerce-11**: admin@jrcommerce11.edu / admin123
- **JR.CLG Commerce-12**: admin@jrcommerce12.edu / admin123

#### Logging In
1. Click "Admin Login" on the Admin Portal card
2. Enter admin email, password, and select department
3. Click "Login" to access admin dashboard

#### Managing Complaints
1. View all complaints for your department
2. Update complaint status using dropdown:
   - Pending
   - Processing
   - Resolved
   - Escalated
3. Add admin responses in the text area
4. Download complaint attachments by clicking file links
5. Use filters to find specific complaints

### Using the AI Chatbot

#### Accessing the Chatbot
- Click the "AI Support 24/7" button (bottom-right corner)
- Available on all pages for instant help

#### What the Chatbot Can Help With
- Student registration and login guidance
- Complaint submission and tracking
- File upload and download assistance
- Department information and contacts
- Admin account details
- Technical troubleshooting
- Portal features explanation
- Security and process information
- Developer contact information
- General navigation help

#### Sample Questions
- "How do I register as a student?"
- "What are the complaint statuses?"
- "How does auto-escalation work?"
- "Can I upload files? What's the size limit?"
- "What departments are available?"
- "Who is the developer of this portal?"
- "How do I contact technical support?"
- "What are the admin login credentials?"
- "How long does complaint resolution take?"
- "Is the portal mobile-friendly?"

## 🔧 Technical Details

### File Structure
```
CollegeComplaintPortal_Enhanced/
├── index.html          # Main landing page
├── styles.css          # 3D styling with gradients
├── script.js           # All functionality
└── README.md          # This file
```

### Data Storage
- Uses browser localStorage for data persistence
- No external database required
- Data includes users, complaints, and admin accounts

### Auto-escalation Logic
- Runs every minute to check complaint ages
- Automatically escalates pending complaints after 3 days
- Adds system notification to complaint response

### File Upload Features
- Maximum file size: 5MB per file
- Multiple file uploads supported
- Drag and drop functionality
- Files stored as base64 in localStorage
- Secure download links for admins

## 🎨 Design Features

### 3D Effects
- Glassmorphism design with backdrop blur
- Hover animations with scale and shadow effects
- Floating background elements
- Shine effects on card hover

### Gradient Colors
- Purple to blue gradient backgrounds
- Dynamic color transitions
- Shiny button effects
- Status-based color coding

### Animations
- Floating circles background animation
- Slide-in modals
- Pulsing chatbot button
- Smooth transitions throughout

## 🔒 Security Features

- Password-based authentication
- Department-level access control
- Secure file handling
- Input validation and sanitization
- Session management with localStorage

## 📱 Responsive Design

The portal is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🔄 Auto-escalation System

### How It Works
1. System checks all pending complaints every minute
2. Complaints older than 3 days are automatically escalated
3. Status changes from "pending" to "escalated"
4. System adds escalation notice to admin response
5. Escalated complaints get priority attention

### Benefits
- Ensures no complaint is forgotten
- Provides accountability
- Improves response times
- Automatic priority assignment

## 💡 Tips for Best Use

### For Students
- Be specific and detailed in complaint descriptions
- Use appropriate categories for faster routing
- Upload relevant files to support your complaint
- Check back regularly for admin responses
- Use the AI chatbot for quick questions

### For Admins
- Respond to complaints promptly to avoid escalation
- Use clear and helpful responses
- Update status as you work on complaints
- Download and review all attached files
- Use filters to organize workload effectively

## 🆘 Troubleshooting

### Common Issues
1. **Login not working**: Check email and password, ensure correct user type
2. **Files not uploading**: Check file size (max 5MB), try different browser
3. **Complaints not showing**: Click refresh button, check browser localStorage
4. **Chatbot not responding**: Refresh page, try again
5. **Responsive issues**: Try different browser or clear cache

### Browser Compatibility
- Chrome: Fully supported
- Firefox: Fully supported
- Safari: Fully supported
- Edge: Fully supported
- Internet Explorer: Not recommended

## 🔮 Future Enhancements

Potential features for future versions:
- Email notifications
- Real-time chat between students and admins
- Advanced analytics and reporting
- Integration with external systems
- Mobile app version
- Multi-language support

## 📞 Support

For technical support or questions about the portal:
- Use the built-in AI chatbot
- Contact your system administrator
- Check this README for common issues

---

**Note**: This is a demonstration portal using localStorage for data persistence. In a production environment, you would integrate with a proper backend database and authentication system.

## 🏆 Features Highlight

✅ **Complete Authentication System**
✅ **File Upload & Download**
✅ **Auto-escalation After 3 Days**
✅ **Department-wise Admin Access**
✅ **Real-time Status Updates**
✅ **AI Chatbot Support 24/7**
✅ **3D Styling with Gradients**
✅ **Fully Responsive Design**
✅ **Advanced Filtering**
✅ **Secure File Handling**

The portal is production-ready and includes all requested features with modern web technologies and best practices!

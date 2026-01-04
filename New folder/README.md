# Admin Content Manager - React Implementation

A beautiful, modern admin dashboard built with React for managing educational content. Features glassmorphism design, smooth animations, and a complete content management system.

## ✨ Features

- 🔐 **Secure Login** - Beautiful login page with gradient background
- 📊 **Dashboard Overview** - Stats cards and progress tracking
- ✏️ **Content Editor** - Full-featured editor with rich text, SEO fields, quizzes
- 🎨 **Modern Design** - Glassmorphism effects, smooth animations
- 📱 **Responsive** - Works on all devices
- 🎯 **Organized Navigation** - Sidebar with curriculum structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Extract the files** to your project directory

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser** to `http://localhost:3000`

### Default Login Credentials
- **Email:** admin@example.com
- **Password:** admin123

## 📁 Project Structure

```
react-admin/
├── public/
│   └── index.html              # HTML template with Tailwind CDN
├── src/
│   ├── components/
│   │   ├── AdminLogin.jsx      # Login page component
│   │   ├── AdminDashboard.jsx  # Main dashboard controller
│   │   ├── AdminLayout.jsx     # Layout with sidebar & topbar
│   │   ├── AdminSidebar.jsx    # Navigation sidebar
│   │   ├── DashboardOverview.jsx  # Stats and overview cards
│   │   └── ContentEditor.jsx   # Content editing interface
│   ├── data/
│   │   └── curriculum.js       # Curriculum data structure
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # All custom styles
│   └── index.js                # React entry point
└── package.json                # Dependencies
```

## 🎨 Component Overview

### AdminLogin
- Glassmorphism login card
- Animated gradient background
- Form validation
- Error handling

### AdminDashboard
- View state management (overview/editor)
- Context handling for selected subjects
- Route coordination

### AdminLayout
- Sidebar integration
- Top navigation bar
- Search functionality
- Mobile menu support

### AdminSidebar
- Curriculum navigation
- Expandable year/semester sections
- User profile display
- Logout functionality

### DashboardOverview
- Stats cards (Users, Content, Quizzes, Status)
- Year progress cards
- Subject count tracking

### ContentEditor
- Topic management
- Rich text editing
- SEO metadata fields
- Quiz question builder
- File upload interface
- YouTube video integration

## 🔧 Customization

### Changing Colors

Edit the Tailwind config in `public/index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
          500: '#YOUR_COLOR',
          600: '#YOUR_COLOR',
        },
        accent: {
          // Your custom accent colors
          500: '#YOUR_COLOR',
          600: '#YOUR_COLOR',
        }
      }
    }
  }
}
```

### Adding New Years/Subjects

Edit `src/data/curriculum.js`:

```javascript
export const curriculumData = [
  {
    id: 'year-5',
    title: 'Fifth Year',
    subjectCount: 8,
    semesters: [
      {
        id: 'sem-9',
        title: 'Semester 9',
        subjects: [
          { id: 'new-subject', title: 'New Subject' }
        ]
      }
    ]
  }
];
```

### Connecting to API

Replace mock data in components with actual API calls:

**Example in AdminLogin.jsx:**
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (data.success) {
      setCurrentUser(data.user);
    } else {
      setAuthError(data.message);
    }
  } catch (error) {
    setAuthError('Login failed. Please try again.');
  }
};
```

**Example in ContentEditor.jsx:**
```javascript
const handleSave = async () => {
  try {
    const response = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## 🎯 Key Features to Implement

### For Production

1. **Authentication**
   - JWT token management
   - Session persistence
   - Protected routes

2. **API Integration**
   - RESTful API endpoints
   - Error handling
   - Loading states

3. **Rich Text Editor**
   - Replace textarea with React Quill or similar
   - Image upload support
   - Code syntax highlighting

4. **File Upload**
   - Actual file handling
   - Progress indicators
   - File validation

5. **Form Validation**
   - Input validation
   - Error messages
   - Required field indicators

6. **State Management**
   - Consider Redux or Context API for complex state
   - API caching
   - Optimistic updates

## 📦 Additional Dependencies (Optional)

For production-ready features:

```bash
# Rich text editor
npm install react-quill

# Form handling
npm install react-hook-form

# State management
npm install @reduxjs/toolkit react-redux

# Routing (if needed)
npm install react-router-dom

# HTTP client
npm install axios

# File upload
npm install react-dropzone
```

## 🐛 Troubleshooting

**Tailwind classes not working?**
- Make sure the CDN script is loaded in `public/index.html`
- Check browser console for errors

**Components not rendering?**
- Verify all imports are correct
- Check React Developer Tools for component hierarchy

**Lucide icons not showing?**
- Run `npm install lucide-react`
- Restart dev server

## 📝 Typography Guard

The `.admin-scope` class prevents large headings from breaking the layout. It's applied to:
- AdminLayout component
- Dashboard containers

This ensures consistent typography sizing within the admin panel.

## 🎨 Design System

**Colors:**
- Primary: Blue (#0ea5e9)
- Accent: Purple (#a855f7)
- Success: Green (#22c55e)
- Warning: Orange (#fb923c)

**Effects:**
- Glassmorphism panels
- Smooth hover transitions
- Gradient backgrounds
- Custom scrollbars

**Typography:**
- Headers: Bold, gradient text
- Body: Regular weight, gray tones
- Labels: Semi-bold, smaller size

## 📄 License

MIT License - Feel free to use this in your projects!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using React, Tailwind CSS, and Lucide Icons

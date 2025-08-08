# WebMusic Frontend

Ứng dụng phát nhạc trực tuyến được xây dựng với React, Vite và TailwindCSS theo kiến trúc modular.

## 🚀 Tính năng chính

### Người dùng (User)
- ✅ Đăng ký/Đăng nhập (local + OAuth)
- ✅ Quản lý profile cá nhân
- 🔄 Nghe nhạc và tạo playlist
- 🔄 Nâng cấp Premium
- 🔄 Tìm kiếm bài hát, nghệ sĩ, playlist

### Nhà sáng tạo (Creator)
- 🔄 Gửi yêu cầu đăng bài hát
- 🔄 Quản lý nghệ sĩ
- 🔄 Theo dõi trạng thái duyệt

### Quản trị viên (Admin)
- 🔄 Quản lý người dùng
- 🔄 Duyệt bài hát
- 🔄 Tạo bài hát trực tiếp
- 🔄 Thống kê hệ thống

## 🏗️ Kiến trúc dự án

```
src/
├── components/          # Shared components
│   ├── common/          # Button, Input, Modal, Card...
│   └── layout/          # LandingPage, DashboardLayout
├── hooks/               # Custom hooks
│   ├── useAuth.jsx      # Authentication logic
│   ├── useAudio.jsx     # Audio player logic
│   ├── useDarkMode.jsx  # Theme management
│   └── useLanguage.jsx  # Internationalization
├── modules/             # Feature modules
│   ├── auth/            # Authentication features
│   ├── admin/           # Admin features
│   ├── music/           # Music player & management
│   ├── creator/         # Creator workflow
│   ├── premium/         # Subscription features
│   └── search/          # Search functionality
├── shared/              # Shared utilities
│   ├── services/        # API services
│   ├── constants/       # App constants
│   ├── translations/    # i18n files
│   └── utils/           # Helper functions
└── theme/               # Theme configuration
```

## 🛠️ Tech Stack

- **Frontend:** React 19.1.0 + Vite 7.0.4
- **Styling:** TailwindCSS 3.4.17 + Dark mode
- **Routing:** React Router DOM 7.7.0
- **Audio:** HTML5 Audio API + React hooks
- **HTTP Client:** Axios 1.10.0
- **UI Components:** Lucide React + React Icons
- **Notifications:** React Toastify
- **Development:** ESLint + PostCSS + Autoprefixer

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Backend API (xem [API Documentation](../backend/README.md))

## 🚀 Cài đặt và chạy

### 1. Clone và cài đặt dependencies

```bash
# Clone repository
git clone <repository-url>
cd WebMusic_frontend

# Cài đặt dependencies
npm install
```

### 2. Cấu hình environment

```bash
# Copy file cấu hình mẫu
cp .env.example .env

# Chỉnh sửa file .env với thông tin backend
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### 4. Build production

```bash
npm run build
npm run preview
```

## 📝 Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 🎨 Theme và Styling

### Dark Mode
Ứng dụng hỗ trợ dark/light mode với TailwindCSS:
- Toggle qua hook `useDarkMode()`
- CSS classes tự động chuyển đổi
- Lưu preferences trong localStorage

### Color Palette
```css
/* Primary Colors */
music-500: #a855f7    /* Purple */
music-600: #9333ea

/* Accent Colors */
accent-500: #ec4899   /* Pink */
accent-600: #db2777
```

### Components
Tất cả components được thiết kế responsive và accessible:
- Button với multiple variants
- Card với hover effects
- Modal với backdrop
- Input với validation states

## 🌐 Internationalization (i18n)

Hỗ trợ đa ngôn ngữ qua hook `useLanguage()`:
- Tiếng Việt (vi) - mặc định
- English (en)

Thêm ngôn ngữ mới:
1. Cập nhật `src/hooks/useLanguage.jsx`
2. Thêm translations vào object `translations`

## 🔧 API Integration

### Authentication Flow
```javascript
// Login
const response = await authService.login({ email, password })

// Register  
await authService.register({ email, password, displayName })

// Profile
const user = await authService.getCurrentUser()
```

### Music Operations
```javascript
// Get songs
const songs = await musicService.getSongs({ page: 1, limit: 20 })

// Play song
const song = await musicService.getSong(songId)
audioPlayer.playSong(song)

// Create playlist
await musicService.createPlaylist({ name, description })
```

## 📱 Responsive Design

- **Mobile First:** Thiết kế ưu tiên mobile
- **Breakpoints:** sm, md, lg, xl (TailwindCSS)
- **Touch Friendly:** Nút bấm và controls tối ưu cho touch
- **Audio Player:** Sticky player ở bottom trên mọi màn hình

## 🔒 Security

- JWT token authentication
- Automatic token refresh
- Route protection với ProtectedRoute
- Input validation và sanitization
- HTTPS enforcement (production)

## 🧪 Testing (Coming Soon)

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Performance

- Code splitting theo modules
- Lazy loading components
- Image optimization
- Audio streaming optimized
- Bundle analyzer

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Frontend Developer:** [Your Name]
- **UI/UX Designer:** [Designer Name]
- **Backend Developer:** [Backend Dev Name]

## 🆘 Support

Nếu gặp vấn đề:
1. Check [Issues](../../issues) 
2. Tạo issue mới với template
3. Contact: [email@example.com]

---

Made with ❤️ in Vietnam 🇻🇳

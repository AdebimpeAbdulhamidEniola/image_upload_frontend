# ImageUpload - Frontend

A modern, responsive image upload application with drag-and-drop functionality, instant sharing, and dark mode support. Built with Next.js 16, React 19, and TypeScript.

![ImageUpload Demo](public/logo.svg)

## ✨ Features

- **📤 Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **🖼️ Image Preview**: Instant preview after successful upload
- **📥 Quick Download**: One-click image download with proper filename extraction
- **🔗 Shareable Links**: Generate unique shareable URLs for uploaded images
- **🌓 Dark Mode**: System-aware dark mode with manual toggle
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop
- **⚡ Real-time Loading States**: Beautiful loading indicators and animations
- **🎨 Modern UI**: Clean interface with smooth transitions
- **🔒 Type-Safe**: Full TypeScript support with strict typing
- **♿ Accessible**: Keyboard navigation and screen reader friendly

## 🛠️ Tech Stack

### Core
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 4.1.18** - Utility-first CSS framework

### UI Components
- **Radix UI** - Headless UI primitives
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Modern icon library

### State & Data
- **TanStack Query (React Query)** - Server state management
- **React Dropzone** - File upload with drag-and-drop
- **Axios** - HTTP client with interceptors

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **PNPM** - Fast, efficient package manager

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PNPM installed (or npm/yarn)
- Backend API running (see backend README)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-uploader-frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Create environment file:
```bash
# Create .env.local in the root directory
```

4. Add environment variables:
```env
# Backend API URL
NEXT_PUBLIC_BACKEND_LINK=http://localhost:3000/api

# Site URL (for share links)
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

5. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

6. Open [http://localhost:3001](http://localhost:3001) in your browser

## 📁 Project Structure

```
image-uploader-frontend/
├── app/                          # Next.js App Router
│   ├── contexts/                 # React Context providers
│   │   └── DarkModeContext.tsx  # Dark mode state management
│   ├── share/[publicId]/        # Dynamic share route
│   │   └── page.tsx             # Share page component
│   ├── globals.css              # Global styles & Tailwind
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # Client-side providers
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── HeaderLayout.tsx         # Header with logo & theme toggle
│   ├── LoadingIndicator.tsx    # Upload loading state
│   ├── ShareDialog.tsx          # Share link modal
│   ├── UploadArea.tsx           # Main upload container
│   ├── UploadBox.tsx            # Drag & drop zone
│   └── UploadedImageDisplay.tsx # Image preview with actions
├── lib/                         # Utility functions
│   ├── api.ts                   # Axios instance & interceptors
│   ├── backendApi.ts            # API endpoints
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
│   ├── logo.svg
│   ├── logo-small.svg
│   ├── exit.svg
│   ├── Moon_fill.svg
│   └── Sun_fill.svg
├── types.ts                     # TypeScript type definitions
├── components.json              # shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

## 🎯 Core Features

### 1. Image Upload

**Supported Formats**: JPG, JPEG, PNG, GIF  
**Maximum Size**: 2MB  
**Method**: Drag & drop or file browser

```typescript
// Upload flow in UploadArea.tsx
const { mutate } = useMutation({
  mutationFn: (payload: FormData) => createImage(payload),
  onSuccess: (response) => {
    setUploadedImageUrl(response.data.imageURL);
  },
  onError: (error) => {
    // Enhanced error handling with specific messages
  }
});
```

**Features**:
- Real-time file validation
- Progress indicator during upload
- Error messages for invalid files
- Automatic retry on network failure

### 2. Image Download

Downloads the uploaded image with the correct filename.

```typescript
// Download implementation in lib/utils.ts
export async function downloadImage(
  imageUrl: string,
  filename?: string
): Promise<void> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  
  // Trigger download
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename || 'image.jpg';
  link.click();
  
  // Cleanup
  URL.revokeObjectURL(blobUrl);
}
```

**Features**:
- Automatic filename extraction from Cloudinary URL
- Loading state during download
- Error handling with user feedback
- Cross-browser compatible

### 3. Share Functionality

Generate shareable links for uploaded images using the Cloudinary public ID.

**Share URL Format**:
```
https://yoursite.com/share/{publicId}
```

**Example**:
```typescript
// Extract public ID from Cloudinary URL
const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
// Returns: "image_uploader/abc123xyz"

// Generate share URL
const shareUrl = generateShareUrl(publicId);
// Returns: "https://yoursite.com/share/image_uploader%2Fabc123xyz"
```

**Features**:
- Clean, SEO-friendly URLs
- Copy to clipboard with visual feedback
- Server-side rendering for share pages
- Automatic URL encoding/decoding

### 4. Dark Mode

System-aware dark mode with manual toggle and localStorage persistence.

```typescript
// Dark mode context in app/contexts/DarkModeContext.tsx
const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
}, []);
```

**Features**:
- Respects system preferences
- Smooth transitions between modes
- Persistent across sessions
- No flash of unstyled content

## 🔌 API Integration

### Axios Configuration

```typescript
// lib/api.ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_LINK || "",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Remove Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized error handling
    if (error.response) {
      const apiError = new Error(error.response.data.message);
      apiError.status = error.response.status;
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints

**Upload Image**:
```typescript
// POST /api/upload
export const createImage = async (payload: FormData) => {
  const response = await api.post<APIResponse<ImageUploadData>>(
    "/upload",
    payload
  );
  return response.data;
};
```

**Get Image by Public ID**:
```typescript
// GET /api/download/:publicId
export const getImage = async (publicId: string) => {
  const encodedPublicId = encodeURIComponent(publicId);
  const response = await api.get<APIResponse<ImageUploadData>>(
    `/download/${encodedPublicId}`
  );
  return response.data;
};
```

## 🎨 Styling

### Tailwind Configuration

Using Tailwind CSS 4 with custom theme variables:

```css
/* globals.css */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode variables */
}
```

### Component Styling

Components use Tailwind utilities with responsive variants:

```tsx
<div className="
  w-[95%] sm:w-[85%] md:w-[700px] lg:w-[800px] xl:w-[900px]
  min-h-[400px] sm:min-h-[450px] md:min-h-[500px]
  bg-white dark:bg-[#1a2533]
  rounded-2xl shadow-xl
  hover:bg-gray-50 dark:hover:bg-[#22304a]
  transition-all duration-200
">
```

## 🚦 Available Scripts

```bash
# Development
pnpm dev          # Start development server (localhost:3001)

# Building
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint

# Type Checking
pnpm type-check   # Run TypeScript compiler check
```

## 🔧 Configuration

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};
```


## 📱 Responsive Design

The application is fully responsive with breakpoints:

| Breakpoint | Width | Device |
|------------|-------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large desktop |

## 🎯 Usage Examples

### Basic Upload Flow

```typescript
// 1. User drags/drops file or clicks to browse
// 2. File is validated (type, size)
// 3. FormData is created
const formData = new FormData();
formData.append("image", file);

// 4. Upload mutation is triggered
mutate(formData);

// 5. On success, image URL is displayed
// 6. User can download or share
```

### Share Link Generation

```typescript
// Extract public ID from Cloudinary URL
const imageUrl = "https://res.cloudinary.com/cloud/image/upload/v123/folder/image.jpg";
const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
// Result: "folder/image"

// Generate share URL
const shareUrl = generateShareUrl(publicId);
// Result: "https://yoursite.com/share/folder%2Fimage"

// Share page automatically decodes and displays image
```

## 🐛 Error Handling

The application includes comprehensive error handling:

### Upload Errors

- **File too large**: "File too large. Maximum size is 2MB."
- **Invalid file type**: "Unsupported file type. Please use JPG, PNG, or GIF."
- **Network error**: "Network error. Please check your connection."
- **Server error**: "Server error. Please try again later."

### Download Errors

- **Fetch failed**: "Failed to download image. Please try again."
- **Network error**: Displays error message with retry option

### Share Errors

- **Invalid public ID**: Redirects to 404 page
- **Image not found**: Displays "Image not found" message

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG 2.1 AA)

## 🔒 Security

- Client-side file validation
- URL encoding for special characters
- Cloudinary URL validation on share pages
- HTTPS-only image sources
- XSS protection through React's escaping

## 🚀 Performance Optimizations

- Next.js Image component with automatic optimization
- Code splitting with dynamic imports
- React Query for efficient data caching
- Lazy loading for images
- Optimized bundle size
- Efficient re-renders with proper memoization

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel
```

### Other Platforms

Build the production bundle:

```bash
pnpm build
```

Deploy the `.next` folder and run:

```bash
pnpm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add TypeScript types for new code
- Test on multiple devices/browsers
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Cloudinary](https://cloudinary.com/) - Image hosting

## 📧 Support

If you encounter any issues or have questions:

- Open an issue in the repository
- Check existing issues for solutions
- Review the [Next.js documentation](https://nextjs.org/docs)
- Review the [React documentation](https://react.dev)

## 🗺️ Roadmap

- [ ] Multiple image upload
- [ ] Image compression before upload
- [ ] Image editing (crop, resize, filters)
- [ ] Upload history/gallery
- [ ] Password-protected shares
- [ ] Share expiration dates
- [ ] Social media sharing
- [ ] QR code generation for shares
- [ ] Image metadata display
- [ ] Batch download

---

**Built with ❤️ using Next.js and React by Abdulhamid Eniola Adebimpe**
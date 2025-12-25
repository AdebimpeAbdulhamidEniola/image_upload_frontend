# Drag & Drop Image Upload with react-dropzone

## What is react-dropzone?

Think of react-dropzone as a tool that listens when users drag files into a zone on your webpage. It handles all the tricky browser stuff for you so you can focus on your image uploader.

---

## Step 1: Install react-dropzone

```bash
pnpm add react-dropzone
```

That's it! Now you have the library ready to use.

---

## Step 2: Build Your Component (Piece by Piece)

Create a new file: `components/ImageDropzone.tsx`

### Part A: The Imports

```tsx
'use client';  // This is required because we use React hooks
// 'use client' tells Next.js this runs in the browser, not the server

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
```

**What each import does:**
- `useCallback` → Remembers our file-handling function so it doesn't get recreated every render
- `useState` → Stores our uploaded files in memory
- `useDropzone` → The main function from react-dropzone that creates the drag-and-drop zone

---

### Part B: Define the File Structure

```tsx
interface UploadedFile {
  file: File;        // The actual file object from the browser
  preview: string;   // A temporary URL to show the image thumbnail
}
```

**Why this matters for YOUR project:**
- `file` = the actual image you'll upload to your server
- `preview` = lets users see what they're uploading before clicking "Upload"

---

### Part C: Set Up State Management

```tsx
export default function ImageDropzone() {
  // This array stores ALL images the user selected
  // Each item has both the file AND a preview URL
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
```

**In your image uploader project:**
- `uploadedFiles` holds all selected images
- When user drags/clicks files, they get added here
- Display them in a grid below the dropzone

---

### Part D: The File Drop Handler

```tsx
  // This function runs whenever the user drops files or clicks to select
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // acceptedFiles = only the files that passed our validation rules
    // (we'll define those rules in a moment)

    // For each file, create an object with the file + a preview URL
    const newFiles = acceptedFiles.map((file) => ({
      file,                              // The actual file
      preview: URL.createObjectURL(file) // A temporary URL like "blob:http://..."
    }));

    // Add these new files to our list
    // prev = the old list of files
    // We use [...prev, ...newFiles] to KEEP old files and ADD new ones
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);
```

**How this works for YOUR project:**
1. User drags 3 images into the dropzone
2. `onDrop` is called with those 3 files
3. For each file, we create a preview URL (this shows the thumbnail instantly)
4. We add all 3 to `uploadedFiles` so they show in the grid below

---

### Part E: Configure the Dropzone Rules

```tsx
  // This is where we tell react-dropzone what to accept
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,                    // "When files drop, run onDrop function"
    
    accept: {                  // Only accept images
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    
    maxSize: 5 * 1024 * 1024,  // Max 5MB per file (5 * 1024 * 1024 = 5242880 bytes)
    
    multiple: true,            // Allow multiple files at once
  });
```

**Breaking down the rules:**
- `accept`: Users can only drag image files. Non-images are rejected.
- `maxSize`: Files bigger than 5MB get rejected (you set this size)
- `multiple`: Users can select many images, not just one

**For YOUR project:**
These rules protect you from:
- Users accidentally uploading PDFs or documents
- Users uploading huge files that crash your server
- Users uploading one file at a time when they want batch uploads

---

### Part F: The Remove Function

```tsx
  // This function removes an image from the list
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];                          // Copy the list
      URL.revokeObjectURL(newFiles[index].preview);       // Free up memory
      newFiles.splice(index, 1);                           // Remove from list
      return newFiles;
    });
  };
```

**Why `revokeObjectURL` matters:**
- `URL.createObjectURL()` uses memory to create preview URLs
- If you don't clean up with `revokeObjectURL()`, memory leaks occur
- Your app slows down after uploading many images

---

### Part G: The Dropzone UI

```tsx
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* This div becomes your drag-and-drop zone */}
      <div
        {...getRootProps()}  // Spreads all necessary event listeners (drag, drop, click)
        className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer 
          transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'      // When dragging: blue highlight
            : 'border-gray-300 bg-gray-50'      // Normal: gray zone
        }`}
      >
        {/* Hidden file input - this opens the file picker when you click */}
        <input {...getInputProps()} />

        {/* Visual feedback to the user */}
        <div className="flex flex-col items-center gap-3">
          <svg className="w-12 h-12 text-gray-400" /* upload icon */ />
          <p className="text-lg font-semibold text-gray-700">
            {isDragActive
              ? 'Drop your images here'              // While dragging
              : 'Drag images here or click to select' // Normal state
            }
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF, WebP up to 5MB
          </p>
        </div>
      </div>
```

**What's happening:**
- `getRootProps()` connects all drag/drop listeners automatically
- `getInputProps()` creates a hidden file input (clicking the zone opens file picker)
- `isDragActive` changes text/color when user hovers with files

---

### Part H: Show Uploaded Files

```tsx
      {/* Only show this if user has uploaded at least 1 file */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Uploaded Images ({uploadedFiles.length})
          </h2>

          {/* Grid of image previews */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedFiles.map((item, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-gray-200"
              >
                {/* Show the preview image */}
                <img
                  src={item.preview}           // The blob URL we created earlier
                  alt={`Preview ${index + 1}`}
                  className="w-full h-40 object-cover"
                />

                {/* Delete button - only shows on hover */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 
                    rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>

                {/* Show the filename */}
                <p className="text-xs text-gray-600 p-2 truncate">
                  {item.file.name}
                </p>
              </div>
            ))}
          </div>

          {/* Upload button to send to server */}
          <button
            onClick={() => {
              console.log('Ready to upload:', uploadedFiles.map((f) => f.file));
              // TODO: Add your server upload logic here
            }}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg 
              font-semibold hover:bg-blue-700 transition-colors"
          >
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
}
```

**For YOUR project:**
- Grid shows thumbnails of what user is about to upload
- Delete button lets them remove mistakes before uploading
- Upload button will send files to your backend

---

## Step 3: Use This Component in Your App

Update `app/page.tsx`:

```tsx
import ImageDropzone from "@/components/ImageDropzone";
import CenterLayout from "@/components/CenterLayout";

export default function Home() {
  return (
    <div>
      <CenterLayout />
      <ImageDropzone />  {/* Add this line */}
    </div>
  )
}
```

That's it! Your drag-and-drop uploader is now live.

---

## How to Send Files to Your Server

When user clicks "Upload Files", add this to the button's onClick:

```tsx
const handleUpload = async () => {
  // Create a FormData object (special format for sending files)
  const formData = new FormData();
  
  // Add each file to the FormData
  uploadedFiles.forEach((item) => {
    formData.append('files', item.file); // 'files' is the field name your server expects
  });

  // Send to your server
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,  // Don't set Content-Type, browser handles it
  });

  const data = await response.json();
  console.log('Server response:', data);
  setUploadedFiles([]); // Clear the list after upload
};
```

---

## Common Mistakes & Fixes

| What Goes Wrong | Why It Happens | How to Fix |
|---|---|---|
| Dropzone doesn't work | Missing `'use client'` at top | Add `'use client';` as first line |
| Memory leaks after uploading many files | Not cleaning up preview URLs | Always call `URL.revokeObjectURL()` |
| Can't upload files | Component not added to page | Make sure you added it to `app/page.tsx` |
| Large files freeze the app | No file size limit | Add `maxSize: 5 * 1024 * 1024` |

---

## Online References

- **Official Docs**: https://react-dropzone.js.org/
- **GitHub**: https://github.com/react-dropzone/react-dropzone
- **npm Package**: https://www.npmjs.com/package/react-dropzone
- **MDN File API**: https://developer.mozilla.org/en-US/docs/Web/API/File
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## What You've Built

✅ Drag-and-drop zone for images  
✅ Validation (only images, max 5MB)  
✅ Live preview of selected files  
✅ Delete button for each image  
✅ Upload button ready for server integration  

Next, implement the server upload and you're done! 🚀

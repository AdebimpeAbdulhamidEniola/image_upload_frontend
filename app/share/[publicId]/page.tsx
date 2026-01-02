import { getImage } from "@/lib/backendApi";
import { notFound } from "next/navigation";
import Image from "next/image";

interface SharePageProps {
  params: {
    publicId: string;
  };
}

export default async function SharePage({ params }: SharePageProps) {
  // Await params since it's a Promise in Next.js 13+
  const { publicId } = await params;

  console.log("=== SHARE PAGE DEBUG ===");
  console.log("1. Raw publicId from params:", publicId);
  console.log("2. Encoded publicId:", encodeURIComponent(publicId));

  // Fetch image data from backend
  let response;
  try {
    console.log("3. Calling getImage with publicId:", publicId);
    response = await getImage(publicId);
    console.log("4. Response received:", response.data);
  } catch (error) {
    // If error occurs (404, network error, etc.), show 404 page
    console.error("5. Error fetching image:", error);
    notFound();
  }

  // Validate response
  if (!response || !response.data || !response.data.imageURL) {
    notFound();
  }

  const imageUrl = response.data.imageURL;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative w-full aspect-auto min-h-[300px] sm:min-h-[400px] md:min-h-[500px] p-2">
            <Image
              src={imageUrl}
              alt="Shared image"
              fill
              className="object-contain"
              unoptimized={imageUrl.startsWith("http://") || !imageUrl.includes("cloudinary")}
              sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 768px) calc(100vw - 48px), (max-width: 1024px) 640px, 768px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

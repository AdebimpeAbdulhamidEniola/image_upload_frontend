import { getImage } from "@/lib/backendApi";
import { notFound } from "next/navigation";
import Image from "next/image";

interface SharePageProps {
  params: {
    publicId: string;
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { publicId } = params;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative w-full aspect-auto min-h-[400px]">
            <Image
              src={imageUrl}
              alt="Shared image"
              fill
              className="object-contain"
              unoptimized={imageUrl.startsWith("http://") || !imageUrl.includes("cloudinary")}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

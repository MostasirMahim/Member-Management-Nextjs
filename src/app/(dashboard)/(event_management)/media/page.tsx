import { MediaUploadForm } from "@/components/events/MediaUpload";
export default async function MediaPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Management</h1>
          <p className="text-muted-foreground">
            Upload and manage event media files
          </p>
        </div>
      </div>
      <MediaUploadForm />
    </div>
  );
}

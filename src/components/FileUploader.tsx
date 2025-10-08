interface FileUploaderProps {
  onUpload: (file: File) => void;
}

export default function FileUploader({ onUpload }: FileUploaderProps) {
  return (
    <div className="flex justify-center mb-2">
      <div className="p-2 bg-white rounded-2xl text-center w-60">
        <h2 className="font-semibold mb-3">Upload background</h2>
        <label
          htmlFor="fileUpload"
          className="inline-block px-4 py-2 rounded-xl bg-clubgreen text-white cursor-pointer hover:opacity-90 transition"
        >
          Choose Image
        </label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
}
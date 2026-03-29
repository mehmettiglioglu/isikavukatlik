import { FolderOpen } from "lucide-react";

export default function DosyalarPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-light text-navy">Dosya Takibi</h1>
        <p className="mt-1 text-sm text-gray-400">Dava dosyalarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-gray-200 bg-white py-20 text-center">
        <FolderOpen size={40} className="mb-4 text-gray-200" />
        <p className="font-medium text-gray-400">Yakında Aktif Olacak</p>
        <p className="mt-1 text-sm text-gray-300">Dosya takip modülü geliştirme aşamasındadır.</p>
      </div>
    </div>
  );
}

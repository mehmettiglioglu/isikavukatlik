import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  Link2, Link2Off, ImageIcon,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo,
} from "lucide-react";
import clsx from "clsx";
import { adminUploadImage } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Makale içeriğini buraya yazın..." }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı URL'si:", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor || uploadingRef.current) return;
    e.target.value = "";
    const token = getAdminToken();
    if (!token) return;
    uploadingRef.current = true;
    try {
      const { url } = await adminUploadImage(token, file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      uploadingRef.current = false;
    }
  }

  if (!editor) return null;

  return (
    <div className="border border-gray-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-3 py-2">
        <ToolGroup>
          <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Kalın"><Bold size={14} /></Btn>
          <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="İtalik"><Italic size={14} /></Btn>
          <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Altı çizili"><UnderlineIcon size={14} /></Btn>
          <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Üstü çizili"><Strikethrough size={14} /></Btn>
        </ToolGroup>

        <Sep />

        <ToolGroup>
          <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Başlık 1"><Heading1 size={14} /></Btn>
          <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Başlık 2"><Heading2 size={14} /></Btn>
          <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Başlık 3"><Heading3 size={14} /></Btn>
        </ToolGroup>

        <Sep />

        <ToolGroup>
          <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Sola hizala"><AlignLeft size={14} /></Btn>
          <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Ortala"><AlignCenter size={14} /></Btn>
          <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Sağa hizala"><AlignRight size={14} /></Btn>
        </ToolGroup>

        <Sep />

        <ToolGroup>
          <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Madde listesi"><List size={14} /></Btn>
          <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numaralı liste"><ListOrdered size={14} /></Btn>
          <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Alıntı"><Quote size={14} /></Btn>
          <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay çizgi"><Minus size={14} /></Btn>
        </ToolGroup>

        <Sep />

        <ToolGroup>
          <Btn active={editor.isActive("link")} onClick={setLink} title="Bağlantı ekle"><Link2 size={14} /></Btn>
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Bağlantıyı kaldır"><Link2Off size={14} /></Btn>
        </ToolGroup>

        <Sep />

        <ToolGroup>
          <Btn onClick={() => fileInputRef.current?.click()} title="Görsel yükle">
            <ImageIcon size={14} />
          </Btn>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleImageUpload} />
        </ToolGroup>

        <Sep />

        <ToolGroup>
          <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri al"><Undo size={14} /></Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Yinele"><Redo size={14} /></Btn>
        </ToolGroup>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="rich-editor min-h-105 px-6 py-5 text-sm text-gray-800 outline-none"
      />
    </div>
  );
}

function ToolGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center">{children}</div>;
}

function Sep() {
  return <div className="mx-1.5 h-5 w-px bg-gray-200" />;
}

function Btn({
  children, onClick, active, disabled, title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={clsx(
        "flex h-7 w-7 items-center justify-center transition-colors",
        active ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-200 hover:text-navy",
        disabled && "cursor-not-allowed opacity-30"
      )}
    >
      {children}
    </button>
  );
}

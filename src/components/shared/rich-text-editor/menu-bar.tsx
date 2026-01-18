import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-input flex flex-wrap items-center gap-1 border-b p-2">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bold")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("strike")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("underline")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("link")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={insertLink}
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Separator */}
      <div className="bg-border h-6 w-px" />

      {/* Paragraph & Structure */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 1 })
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 2 })
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 3 })
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-strong h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Paragraph"
        >
          <span className="text-xs font-semibold">P</span>
        </Button>
        {/* <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("blockquote")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => {
            editor.chain().focus().toggleBlockquote().run();
          }}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button> */}
        {/* <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-strong h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button> */}
      </div>

      {/* Separator */}
      <div className="bg-border h-6 w-px" />

      {/* Lists & Indentation */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bulleted List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList")
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Separator */}
      <div className="bg-border h-6 w-px" />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "left" })
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "center" })
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive({ textAlign: "right" })
              ? "bg-secondary text-primary"
              : "text-text-strong",
          )}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

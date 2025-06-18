import { useEffect, useCallback } from 'react';
import { useEditor, EditorContent, type Editor, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from 'shared/components/shadcn/button'; // Đảm bảo import Button từ đúng vị trí

interface TipTapEditorProps {
  content?: string; // Dự kiến là chuỗi JSON của Tiptap hoặc chuỗi HTML
  onChange?: (contentAsJSONString: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Helper function to parse raw content string (from DB or prop)
 * Tiptap's 'content' option in useEditor can take a JSON object or an HTML string.
 * This function tries to parse string as Tiptap JSON; if not, returns original string (assuming HTML).
 */
const getInitialEditorContent = (rawContent?: string): string | JSONContent | undefined => {
  if (!rawContent || rawContent.trim() === '') {
    // Return undefined to let Tiptap use its default empty state,
    // which is typically an empty paragraph.
    // editor.commands.clearContent() also results in this state.
    return undefined;
  }
  try {
    const parsed = JSON.parse(rawContent);
    // Basic check for Tiptap's document structure
    if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
      return parsed as JSONContent; // Return the parsed JSON object
    }
    // If it's JSON but not Tiptap's structure, return raw string (Tiptap will treat as HTML)
    return rawContent;
  } catch (error) {
    console.error('Error parsing Tiptap content:', error);
    // Not a valid JSON string, assume it's an HTML string
    return rawContent;
  }
};

/**
 * TipTap Rich Text Editor Component
 * Hỗ trợ chỉnh sửa và hiển thị nội dung với toolbar.
 * Cải thiện logic load và đồng bộ hóa content để tránh lỗi nhảy con trỏ.
 */
export function TipTapEditor({
  content = '', // Default to empty string if undefined
  onChange,
  editable = true,
  placeholder = 'Nhập nội dung...',
  className = '',
}: TipTapEditorProps) {
  
  // Memoize onChange callback to prevent unnecessary re-renders if passed to Tiptap
  const handleUpdate = useCallback(({ editor }: { editor: Editor }) => {
    // Output Tiptap's content as a JSON string
    const jsonString = editor.isEmpty ? '' : JSON.stringify(editor.getJSON());
    onChange?.(jsonString);
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    // Initialize editor content directly using the prop.
    // getInitialEditorContent handles parsing JSON string or using HTML string.
    content: getInitialEditorContent(content),
    editable: editable,
    onUpdate: handleUpdate, // This will call onChange with JSON string
         editorProps: {
       attributes: {
        class: `tiptap-editor min-h-[200px] p-4 focus:outline-none ${className}`, // className này là từ props của TipTapEditor
        'data-placeholder': !editable && !content ? '' : placeholder,
       },
     },
    autofocus: false,
    // Consider Tiptap's default for these unless specific issues arise:
    // immediatelyRender: true, // Default
    // shouldRerenderOnTransaction: true, // Default behavior
  });

  // Effect to synchronize external `content` prop changes with the editor.
  useEffect(() => {
    if (!editor) { // If editor is not initialized, do nothing
      return;
    }

    // If editor is not editable, we generally don't want to sync incoming changes
    // as it's likely meant to be a static view, and initial content is set via `useEditor`.
    // However, if the parent component *does* want to update a non-editable viewer,
    // this check can be removed or made conditional.
    // For now, assuming content prop changes are relevant mostly for editable instances
    // or for the initial load of a viewer.
    // The `useEditor`'s `content` key already handles the initial load.
    // This effect is primarily for *subsequent* prop changes.

    // Get the external content string (this should be a JSON string from the parent
    // after the first `onChange` cycle, or the initial HTML/JSON string from DB).
    const externalContentString = content || '';

    // Get the current editor content, also as a JSON string for consistent comparison.
    // If editor is empty, getJSON() returns the default empty doc structure.
    // We'll represent truly empty content as an empty string for comparison.
    const currentEditorJSONString = editor.isEmpty ? '' : JSON.stringify(editor.getJSON());

    // If the external content string is identical to the editor's current state (as JSON string),
    // then no update is needed. This is crucial to prevent feedback loops and cursor jumps.
    if (externalContentString === currentEditorJSONString) {
      return;
    }
    
    // If they differ, it means an external change has occurred (e.g., data re-fetched,
    // undo/redo from parent, collaborative editing, etc.), or it's the initial content
    // that differs from a blank editor state if `useEditor`'s `content` was initially undefined.
    
    // Parse the external content string (which could be Tiptap JSON string or an HTML string)
    // for `setContent`.
    const newContentForEditor = getInitialEditorContent(externalContentString);

    // Set content, ensuring not to trigger the onUpdate callback again (emitUpdate: false).
    // Passing `undefined` or an empty string to `setContent` clears the editor.
    editor.commands.setContent(newContentForEditor || '', false);

  }, [content, editor, editable]); // Dependencies: external content prop, editor instance, and editable status.


  if (!editor) {
    return <div className="min-h-[200px] border rounded-lg p-4 animate-pulse bg-gray-100 dark:bg-gray-700" />;
  }

  return (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
      {editable && editor && (
        /* Toolbar */
        <div className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-600 p-2 flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'outline' : 'ghost'} // shadcn variants
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            variant={editor.isActive('strike') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <s>S</s>
          </Button>
          
          <div className="h-6 border-l border-gray-300 dark:border-gray-500 mx-1" />
          
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 1 }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={!editor.can().chain().focus().toggleHeading({level: 1}).run()}
          >
            H1
          </Button>
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 2 }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={!editor.can().chain().focus().toggleHeading({level: 2}).run()}
          >
            H2
          </Button>
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 3 }) ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={!editor.can().chain().focus().toggleHeading({level: 3}).run()}
          >
            H3
          </Button>
          
          <div className="h-6 border-l border-gray-300 dark:border-gray-500 mx-1" />
          
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
          >
            &#x2022; {/* Bullet symbol */}
          </Button>
          <Button
            type="button"
            variant={editor.isActive('orderedList') ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          >
            1.
          </Button>
          
          <div className="h-6 border-l border-gray-300 dark:border-gray-500 mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Nhập URL hình ảnh:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
          >
            📷
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Nhập URL link:');
              // Potentially also prompt for link text or wrap selection
              if (url) {
                // Ensure there's a selection or provide a default text for the link
                if (editor.state.selection.empty) {
                    editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
                } else {
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }
              }
            }}
            disabled={!editor.can().setLink({ href: '' })} // Basic check
          >
            🔗
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className={`
          max-w-none
          ${editable ? 'min-h-[200px] p-4' : 'p-4'} 
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
          focus:outline-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:dark:text-gray-100 [&_h1]:my-4
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h2]:my-3
          [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100 [&_h3]:my-2
          [&_p]:text-gray-700 [&_p]:dark:text-gray-300 [&_p]:my-2
          [&_strong]:text-gray-900 [&_strong]:dark:text-gray-100 [&_strong]:font-semibold
          [&_em]:text-gray-700 [&_em]:dark:text-gray-300 [&_em]:italic
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic
          ${className}
        `}
      />
    </div>
  );
}

/**
 * Read-only TipTap Viewer Component.
 * Displays content without editing capabilities or toolbar.
 */
export function TipTapViewer({ content, className = '' }: { content: string; className?: string }) {
  return (
    <TipTapEditor
      content={content}
      editable={false}
      className={className}
      placeholder="" // No placeholder for viewer
    />
  );
}
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered,
    Quote, Undo, Redo, ImageIcon, LinkIcon, Unlink, Maximize,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus,
    Table as TableIcon, PlusSquare, Trash
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const res = await fetch(`${API}/api/upload`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    });
                    const data = await res.json();
                    if (res.ok && data.url) {
                        editor.chain().focus().setImage({ src: data.url }).run();
                    } else {
                        alert(data.message || 'Upload failed');
                    }
                } catch (e) {
                    alert('Upload failed: ' + e.message);
                }
            }
        };
        input.click();
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const btnStyle = (active) => ({
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.45rem', borderRadius: '6px',
        background: active ? 'rgba(16,185,129,0.2)' : 'transparent',
        color: active ? '#10b981' : 'rgba(255,255,255,0.7)',
        border: 'none', cursor: 'pointer',
        transition: 'all 0.2s',
        hover: { background: 'rgba(255,255,255,0.1)' }
    });

    const Divider = () => <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 0.25rem', alignSelf: 'center' }}></div>;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.15rem', padding: '0.6rem', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))} title="Bold"><Bold size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))} title="Italic"><Italic size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={btnStyle(editor.isActive('strike'))} title="Strike"><Strikethrough size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} style={btnStyle(editor.isActive('code'))} title="Code"><Code size={16} /></button>
            <Divider />
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive('heading', { level: 1 }))} title="H1"><Heading1 size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))} title="H2"><Heading2 size={16} /></button>
            <Divider />
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} style={btnStyle(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} style={btnStyle(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} style={btnStyle(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} style={btnStyle(editor.isActive({ textAlign: 'justify' }))} title="Justify"><AlignJustify size={16} /></button>
            <Divider />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))} title="Bullet List"><List size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))} title="Ordered List"><ListOrdered size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))} title="Quote"><Quote size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)} title="Horizontal Rule"><Minus size={16} /></button>
            <Divider />
            <button type="button" onClick={setLink} style={btnStyle(editor.isActive('link'))} title="Link"><LinkIcon size={16} /></button>
            <button type="button" onClick={addImage} style={btnStyle(false)} title="Upload Image"><ImageIcon size={16} /></button>
            <Divider />
            <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} style={btnStyle(false)} title="Insert Table"><TableIcon size={16} /></button>
            {editor.isActive('table') && (
                <>
                    <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} style={btnStyle(false)} title="Add Column"><PlusSquare size={16} /></button>
                    <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} style={btnStyle(false)} title="Delete Table"><Trash size={16} /></button>
                </>
            )}
            <div style={{ flex: 1 }}></div>
            <button type="button" onClick={() => editor.chain().focus().undo().run()} style={btnStyle(false)} title="Undo"><Undo size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} style={btnStyle(false)} title="Redo"><Redo size={16} /></button>
        </div>
    );
};

export default function TipTapEditor({ value, onChange, placeholder = 'Start writing...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ inline: true, HTMLAttributes: { style: 'max-width: 100%; border-radius: 8px;' } }),
            Link.configure({ openOnClick: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            HorizontalRule
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content',
                style: 'min-height: 400px; padding: 1.5rem; outline: none; color: white; font-family: inherit; font-size: 1rem; line-height: 1.7;'
            }
        }
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (!editor.isFocused) {
                editor.commands.setContent(value || '');
            }
        }
    }, [value, editor]);

    return (
        <div className="tiptap-professional-wrapper" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <style jsx global>{`
                .tiptap-editor-content p { margin-bottom: 1.25em; }
                .tiptap-editor-content p.is-editor-empty:first-child::before {
                    content: "${placeholder}"; float: left; color: rgba(255,255,255,0.25); pointer-events: none; height: 0;
                }
                .tiptap-editor-content h1, .tiptap-editor-content h2, .tiptap-editor-content h3 { margin-top: 1.5em; margin-bottom: 0.75em; color: white; font-weight: 700; }
                .tiptap-editor-content ul, .tiptap-editor-content ol { padding-left: 1.5rem; margin-bottom: 1.25em; }
                .tiptap-editor-content li { margin-bottom: 0.5em; }
                .tiptap-editor-content blockquote { border-left: 4px solid #10b981; padding-left: 1.25rem; margin: 1.5rem 0; color: rgba(255,255,255,0.8); font-style: italic; background: rgba(16,185,129,0.05); padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .tiptap-editor-content code { background: rgba(59,130,246,0.15); color: #60a5fa; padding: 0.2em 0.4em; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 0.85em; }
                .tiptap-editor-content a { color: #3b82f6; text-decoration: underline; text-underline-offset: 4px; }
                .tiptap-editor-content img { display: block; margin: 2rem auto; max-width: 100%; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
                .tiptap-editor-content hr { border: none; border-top: 2px solid rgba(255,255,255,0.1); margin: 2rem 0; }
                
                /* Table Styles */
                .tiptap-editor-content table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 2rem 0; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
                .tiptap-editor-content table td, .tiptap-editor-content table th { min-width: 1em; border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1rem; vertical-align: top; box-sizing: border-box; position: relative; }
                .tiptap-editor-content table th { font-weight: bold; text-align: left; background-color: rgba(255,255,255,0.05); }
                .tiptap-editor-content table .selectedCell:after { z-index: 2; position: absolute; content: ""; left: 0; right: 0; top: 0; bottom: 0; background: rgba(16,185,129,0.1); pointer-events: none; }
                .tiptap-editor-content table .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px; background-color: #3b82f6; pointer-events: none; }
            `}</style>
        </div>
    );
}

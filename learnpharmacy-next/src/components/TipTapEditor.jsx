import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { lowlight } from 'lowlight';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus, Image as ImageIcon, Link as LinkIcon, Video,
    Table as TableIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter,
    Undo, Redo, Code2
} from 'lucide-react';

const MenuButton = ({ onClick, active, disabled, children, title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        type="button"
        style={{
            padding: '0.5rem',
            background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
            border: active ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            color: active ? '#60a5fa' : disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            opacity: disabled ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
            if (!disabled && !active) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }
        }}
        onMouseLeave={(e) => {
            if (!disabled && !active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }
        }}
    >
        {children}
    </button>
);

const TipTapEditor = ({ value, onChange }) => {
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [showCodeDialog, setShowCodeDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We'll use CodeBlockLowlight instead
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    style: 'color: #60a5fa; text-decoration: underline;'
                }
            }),
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    style: 'max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;'
                }
            }),
            Youtube.configure({
                width: 640,
                height: 360,
                HTMLAttributes: {
                    style: 'margin: 1rem 0; border-radius: 8px;'
                }
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    style: 'background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0;'
                }
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    style: 'border-collapse: collapse; width: 100%; margin: 1rem 0;'
                }
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    style: 'background: rgba(59,130,246,0.1); border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem;'
                }
            }),
            TableCell.configure({
                HTMLAttributes: {
                    style: 'border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem;'
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                style: 'min-height: 400px; padding: 1rem; outline: none; color: white; font-size: 0.95rem; line-height: 1.6;'
            }
        }
    });

    const addImage = useCallback(() => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
            setShowImageDialog(false);
        }
    }, [editor, imageUrl]);

    const addLink = useCallback(() => {
        if (linkUrl && editor) {
            if (linkText) {
                editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
            } else {
                editor.chain().focus().setLink({ href: linkUrl }).run();
            }
            setLinkUrl('');
            setLinkText('');
            setShowLinkDialog(false);
        }
    }, [editor, linkUrl, linkText]);

    const addYoutube = useCallback(() => {
        if (youtubeUrl && editor) {
            editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
            setYoutubeUrl('');
            setShowYoutubeDialog(false);
        }
    }, [editor, youtubeUrl]);

    const addCodeSnippet = useCallback(() => {
        if (codeSnippet && editor) {
            editor.chain().focus().setCodeBlock({ language: codeLanguage }).insertContent(codeSnippet).run();
            setCodeSnippet('');
            setShowCodeDialog(false);
        }
    }, [editor, codeSnippet, codeLanguage]);

    if (!editor) return null;

    return (
        <div style={{ width: '100%' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
                borderRadius: '10px 10px 0 0',
                marginBottom: 0
            }}>
                {/* Text Formatting */}
                <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '0.5rem' }}>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        active={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        active={editor.isActive('highlight')}
                        title="Highlight"
                    >
                        <Highlighter size={16} />
                    </MenuButton>
                </div>

                {/* Headings */}
                <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '0.5rem' }}>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        active={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        active={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 size={16} />
                    </MenuButton>
                </div>

                {/* Lists */}
                <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '0.5rem' }}>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote size={16} />
                    </MenuButton>
                </div>

                {/* Alignment */}
                <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '0.5rem' }}>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        active={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        active={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        active={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        active={editor.isActive({ textAlign: 'justify' })}
                        title="Justify"
                    >
                        <AlignJustify size={16} />
                    </MenuButton>
                </div>

                {/* Insert Elements */}
                <div style={{ display: 'flex', gap: '0.25rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '0.5rem' }}>
                    <MenuButton onClick={() => setShowImageDialog(true)} title="Insert Image">
                        <ImageIcon size={16} />
                    </MenuButton>
                    <MenuButton onClick={() => setShowLinkDialog(true)} title="Insert Link">
                        <LinkIcon size={16} />
                    </MenuButton>
                    <MenuButton onClick={() => setShowYoutubeDialog(true)} title="Embed YouTube">
                        <Video size={16} />
                    </MenuButton>
                    <MenuButton onClick={() => setShowCodeDialog(true)} title="Insert Code Block">
                        <Code2 size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        title="Insert Table"
                    >
                        <TableIcon size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Horizontal Line"
                    >
                        <Minus size={16} />
                    </MenuButton>
                </div>

                {/* Undo/Redo */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo size={16} />
                    </MenuButton>
                </div>
            </div>

            {/* Editor Content */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0 0 10px 10px',
                overflow: 'auto',
                maxHeight: '600px'
            }}>
                <EditorContent editor={editor} />
            </div>

            {/* Image Dialog */}
            {showImageDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#1a1a2e', padding: '2rem', borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: 500
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Insert Image</h3>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addImage()}
                            autoFocus
                            style={{
                                width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                color: 'white', marginBottom: '1rem', boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setShowImageDialog(false); setImageUrl(''); }}
                                style={{
                                    padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                    color: 'white', cursor: 'pointer'
                                }}
                            >Cancel</button>
                            <button
                                onClick={addImage}
                                style={{
                                    padding: '0.5rem 1rem', background: '#3b82f6',
                                    border: 'none', borderRadius: 8, color: 'white',
                                    cursor: 'pointer', fontWeight: 600
                                }}
                            >Insert</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Dialog */}
            {showLinkDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#1a1a2e', padding: '2rem', borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: 500
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Insert Link</h3>
                        <input
                            type="text"
                            placeholder="Link URL (https://...)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                color: 'white', marginBottom: '0.75rem', boxSizing: 'border-box'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Link Text (optional)"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addLink()}
                            style={{
                                width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                color: 'white', marginBottom: '1rem', boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setShowLinkDialog(false); setLinkUrl(''); setLinkText(''); }}
                                style={{
                                    padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                    color: 'white', cursor: 'pointer'
                                }}
                            >Cancel</button>
                            <button
                                onClick={addLink}
                                style={{
                                    padding: '0.5rem 1rem', background: '#3b82f6',
                                    border: 'none', borderRadius: 8, color: 'white',
                                    cursor: 'pointer', fontWeight: 600
                                }}
                            >Insert</button>
                        </div>
                    </div>
                </div>
            )}

            {/* YouTube Dialog */}
            {showYoutubeDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#1a1a2e', padding: '2rem', borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: 500
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Embed YouTube Video</h3>
                        <input
                            type="text"
                            placeholder="YouTube URL"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addYoutube()}
                            autoFocus
                            style={{
                                width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                color: 'white', marginBottom: '1rem', boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setShowYoutubeDialog(false); setYoutubeUrl(''); }}
                                style={{
                                    padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                    color: 'white', cursor: 'pointer'
                                }}
                            >Cancel</button>
                            <button
                                onClick={addYoutube}
                                style={{
                                    padding: '0.5rem 1rem', background: '#ef4444',
                                    border: 'none', borderRadius: 8, color: 'white',
                                    cursor: 'pointer', fontWeight: 600
                                }}
                            >Embed</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Code Block Dialog */}
            {showCodeDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#1a1a2e', padding: '2rem', borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: 700
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Insert Code Snippet</h3>
                        <select
                            value={codeLanguage}
                            onChange={(e) => setCodeLanguage(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                color: 'white', marginBottom: '0.75rem', boxSizing: 'border-box'
                            }}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="jsx">React (JSX)</option>
                            <option value="sql">SQL</option>
                            <option value="bash">Bash</option>
                            <option value="json">JSON</option>
                        </select>
                        <textarea
                            placeholder="Paste your code here..."
                            value={codeSnippet}
                            onChange={(e) => setCodeSnippet(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%', minHeight: 200, padding: '0.75rem',
                                background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8, color: 'white', marginBottom: '1rem',
                                fontFamily: 'monospace', fontSize: '0.9rem', boxSizing: 'border-box',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setShowCodeDialog(false); setCodeSnippet(''); }}
                                style={{
                                    padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                    color: 'white', cursor: 'pointer'
                                }}
                            >Cancel</button>
                            <button
                                onClick={addCodeSnippet}
                                style={{
                                    padding: '0.5rem 1rem', background: '#8b5cf6',
                                    border: 'none', borderRadius: 8, color: 'white',
                                    cursor: 'pointer', fontWeight: 600
                                }}
                            >Insert Code</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipTapEditor;

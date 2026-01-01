import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Code, Image, Link } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your article...',
}) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: List, label: 'Bullet List', action: () => insertMarkdown('\n- ') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('\n1. ') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('\n> ') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: Image, label: 'Image', action: () => insertMarkdown('![alt](', ')') },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 p-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              onClick={button.action}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={button.label}
              type="button"
            >
              <button.icon size={18} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`px-3 py-1 text-sm rounded ${
              mode === 'write' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 text-sm rounded ${
              mode === 'preview' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === 'write' ? (
        <textarea
          id="editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[500px] p-4 focus:outline-none resize-none font-mono text-sm"
        />
      ) : (
        <div className="prose max-w-none p-4 min-h-[500px]">
          <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
};

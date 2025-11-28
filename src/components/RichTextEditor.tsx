'use client';

import { useEffect, useRef } from 'react';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export default function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = '请输入内容...',
  style 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className="rich-text-editor" style={style}>
      <div className="rich-text-toolbar">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          title="粗体"
          className="toolbar-btn"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          title="斜体"
          className="toolbar-btn"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
          title="下划线"
          className="toolbar-btn"
        >
          <u>U</u>
        </button>
        <div className="toolbar-divider" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
          title="无序列表"
          className="toolbar-btn"
        >
          • 列表
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }}
          title="有序列表"
          className="toolbar-btn"
        >
          1. 列表
        </button>
        <div className="toolbar-divider" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'h3'); }}
          title="标题"
          className="toolbar-btn"
        >
          H
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'p'); }}
          title="段落"
          className="toolbar-btn"
        >
          P
        </button>
        <div className="toolbar-divider" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('removeFormat'); }}
          title="清除格式"
          className="toolbar-btn"
        >
          清除
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}

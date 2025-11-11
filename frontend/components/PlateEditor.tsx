'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Plate } from '@udecode/plate/react';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import type { Descendant } from 'slate';

// --- serialize/deserialize string <-> Slate nodes ---
function stringToNodes(s: string): Descendant[] {
  return (s ?? '').split('\n').map((line) => ({
    type: 'p',
    children: [{ text: line }],
  })) as Descendant[];
}

function nodesToString(nodes: Descendant[]): string {
  if (!Array.isArray(nodes)) return '';
  return nodes
    .map((n: any) =>
      Array.isArray(n?.children)
        ? n.children.map((c: any) => (typeof c?.text === 'string' ? c.text : '')).join('')
        : ''
    )
    .join('\n');
}

export default function PlateEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Plate v28+ accepts a plain array of plugins
  const plugins = useMemo(() => [createParagraphPlugin()], []);
  const [editorValue, setEditorValue] = useState<Descendant[]>(stringToNodes(value));

  useEffect(() => {
    setEditorValue(stringToNodes(value));
  }, [value]);

  useEffect(() => {
    onChange(nodesToString(editorValue));
  }, [editorValue, onChange]);

  const plateProps: any = {
    plugins,
    value: editorValue,
    onChange: (options: any) => setEditorValue(options.value as Descendant[]),
    editableProps: { style: { minHeight: 160, padding: 8 } },
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: 8 }}>
      <Plate {...plateProps} />
    </div>
  );
}

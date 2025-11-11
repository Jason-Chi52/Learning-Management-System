'use client';

import React, { useEffect, useMemo, useState } from 'react';
// ✅ Use the /react entrypoints
import { Plate } from '@udecode/plate/react';
import { createParagraphPlugin } from '@udecode/plate-paragraph/react';
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

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: 8 }}>
      <Plate
        plugins={plugins}
        value={editorValue}
        onChange={setEditorValue}
        editableProps={{ style: { minHeight: 160, padding: 8 } }}
      />
    </div>
  );
}

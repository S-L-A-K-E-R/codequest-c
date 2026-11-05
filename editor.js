// CodeQuest's editor adapter: Ace for IDE features, with a usable textarea fallback.
// The C code and drafts always remain on the student's device.
const $ = id => document.getElementById(id);

export function createCodeEditor({ onChange, onRun }) {
  const textarea = $('codeEditor');
  const host = $('aceEditor');
  const cursor = $('editorCursor');
  let editor = null;
  let settingValue = false;
  let currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

  function updateCursor(row, column) {
    cursor.textContent = 'Ln ' + row + ', Col ' + column;
  }

  function textareaCursor() {
    const before = textarea.value.slice(0, textarea.selectionStart);
    const lines = before.split('\n');
    updateCursor(lines.length, lines[lines.length - 1].length + 1);
  }

  function fallbackReplace(start, end, text, selectionStart, selectionEnd = selectionStart) {
    textarea.setRangeText(text, start, end, 'end');
    textarea.setSelectionRange(selectionStart, selectionEnd);
    onChange(textarea.value);
    textareaCursor();
  }

  // The plain textarea remains fully editable if the CDN cannot be reached.
  // Its minimal smart editing mirrors the most useful Ace behaviors.
  textarea.addEventListener('input', () => {
    if (!editor) {
      onChange(textarea.value);
      textareaCursor();
    }
  });
  textarea.addEventListener('click', textareaCursor);
  textarea.addEventListener('keyup', textareaCursor);
  textarea.addEventListener('keydown', event => {
    if (editor || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key;
    const value = textarea.value;
    const start = textarea.selectionStart, end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const before = value.slice(lineStart, start);
    const indent = (before.match(/^[ \t]*/) || [''])[0];
    const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    const closers = [')', ']', '}', '"', "'"];

    if (key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        const removable = before.match(/^ {1,4}$/);
        if (removable) fallbackReplace(lineStart, start, '', lineStart);
      } else {
        fallbackReplace(start, end, '    ', start + 4);
      }
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();
      const after = value.slice(end);
      const openingBrace = before.trimEnd().endsWith('{');
      const inner = indent + (openingBrace ? '    ' : '');
      if (openingBrace && after.startsWith('}')) {
        // Turn a paired {} into a nicely indented multiline block.
        const text = '\n' + inner + '\n' + indent;
        fallbackReplace(start, end, text, start + 1 + inner.length);
      } else {
        fallbackReplace(start, end, '\n' + inner, start + 1 + inner.length);
      }
      return;
    }

    if (closers.includes(key) && !selected && value.charAt(start) === key) {
      // The closing delimiter is already there: type through it.
      event.preventDefault();
      textarea.setSelectionRange(start + 1, start + 1);
      textareaCursor();
      return;
    }

    if (Object.hasOwn(pairs, key)) {
      // Don't auto-pair quote characters in the middle of an existing word.
      if ((key === '"' || key === "'") && !selected && /[\w]/.test(value.charAt(start))) return;
      event.preventDefault();
      const closing = pairs[key];
      fallbackReplace(start, end, key + selected + closing,
        start + 1, start + 1 + selected.length);
    }
  });

  const ace = window.ace;
  if (ace) {
    try {
      const basePath = 'https://cdn.jsdelivr.net/npm/ace-builds@1.45.2/src-min-noconflict';
      ace.config.set('basePath', basePath);
      ace.config.set('modePath', basePath);
      ace.config.set('themePath', basePath);
      editor = ace.edit(host, {
        mode: 'ace/mode/c_cpp',
        theme: currentTheme === 'light' ? 'ace/theme/chrome' : 'ace/theme/tomorrow_night',
        fontSize: '16px',
        fontFamily: "Consolas, 'Cascadia Code', 'Fira Code', monospace",
        tabSize: 4,
        useSoftTabs: true,
        enableAutoIndent: true,
        behavioursEnabled: true,
        wrapBehavioursEnabled: true,
        showPrintMargin: false,
        showLineNumbers: true,
        showGutter: true,
        displayIndentGuides: true,
        highlightActiveLine: true,
        highlightSelectedWord: true,
        showFoldWidgets: true,
        cursorStyle: 'slim',
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false
      });
      editor.session.setUseSoftTabs(true);
      editor.session.setTabSize(4);
      editor.setBehavioursEnabled(true);
      editor.setWrapBehavioursEnabled(true);
      editor.commands.addCommand({
        name: 'codequestRun',
        bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
        exec: () => onRun()
      });
      editor.session.on('change', () => {
        if (!settingValue) onChange(editor.getValue());
      });
      editor.selection.on('changeCursor', () => {
        const position = editor.getCursorPosition();
        updateCursor(position.row + 1, position.column + 1);
      });
      host.hidden = false;
      textarea.hidden = true;
      editor.textInput.getElement().setAttribute('aria-label', 'Éditeur de code C');
    } catch (error) {
      // If the editor fails to initialize, the original textarea still works.
      console.warn('CodeQuest: éditeur avancé indisponible', error);
      if (editor) {
        try { editor.destroy(); } catch { /* Preserve the fallback. */ }
      }
      editor = null;
      host.hidden = true;
      textarea.hidden = false;
    }
  }

  return {
    getValue() {
      return editor ? editor.getValue() : textarea.value;
    },
    setValue(value) {
      textarea.value = value;
      if (editor) {
        settingValue = true;
        try {
          editor.setValue(value, -1);
          editor.session.getUndoManager().reset();
        } finally {
          settingValue = false;
        }
      }
      updateCursor(1, 1);
    },
    focus() {
      if (editor) {
        editor.resize(true);
        editor.focus();
      } else {
        textarea.focus();
        textareaCursor();
      }
    },
    resize() {
      if (editor) editor.resize(true);
    },
    setTheme(theme) {
      currentTheme = theme === 'light' ? 'light' : 'dark';
      if (editor) editor.setTheme(currentTheme === 'light' ? 'ace/theme/chrome' : 'ace/theme/tomorrow_night');
    },
    isEnhanced() {
      return !!editor;
    }
  };
}

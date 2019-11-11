import React, { useState, useRef, useEffect } from 'react';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
  const [styles, setStyles] = useState('');
  const textRef = useRef(null);
  // const textbox = useRef<HTMLInputElement>(undefined);

  // const countRef = useCallback((element: HTMLInputElement) => {
  //     if (element) element.value = '5';
  //     textbox.current = element;
  // }, []);

  // const onCreate = useCallback(() => {
  //     const count = parseInt(textbox.current.value, 10);
  //     parent.postMessage({pluginMessage: {type: 'create-rectangles', count}}, '*');
  // }, []);

  // const onCancel = useCallback(() => {
  //     parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
  // }, []);

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;
      console.log({ type, message });
      if (type === 'export-styles') {
        setStyles(JSON.stringify(message));
      }
    };
  }, []);

  const saveColors = () => {
    parent.postMessage({ pluginMessage: { type: 'save-colors' } }, '*');
  };

  const copyStyle = () => {
    if (textRef && textRef.current) {
      textRef.current.select();
      document.execCommand('copy');
    }
  };

  return (
    <div>
      <img src={require('../assets/logo.svg')} />
      <h2>Minerva Design System</h2>
      <div>
        <button id="create" onClick={saveColors}>
          Export Theme
        </button>
      </div>
      <div>
        <button id="create" onClick={copyStyle}>
          Copy Theme Config
        </button>
        <textarea ref={textRef} value={styles} rows={10} readOnly />
      </div>
    </div>
  );
};

export default App;

import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider, Button, Block, Flex } from 'minerva-ui';
import '../styles/ui.css';

declare function require(path: string): any;

const App = () => {
  const [styles, setStyles] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);
  // const textbox = useRef<HTMLInputElement>(undefined);

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
        setStyles(JSON.stringify(message, null, 2));
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

  // convert styles object into a blob file
  const data = new Blob([JSON.stringify(styles)], {
    type: 'text/plain;charset=utf-8'
  });

  // create ObjectURL to use for downloading
  const url = window.URL.createObjectURL(data);

  return (
    <ThemeProvider>
      <div>
        <img src={require('../assets/logo.svg')} />
        <h2>Minerva Design System</h2>
        <div>
          <Button className="create" onClick={saveColors}>
            Export Theme
          </Button>
        </div>
        <Flex mt={4} justifyContent="center">
          <Block>
            <Button
              as="a"
              className="download-link create"
              href={url}
              download="theme.json"
            >
              Download Theme File
            </Button>
          </Block>
          <Button className="create" onClick={copyStyle}>
            Copy Theme Config
          </Button>
        </Flex>
        <Block>
          <textarea ref={textRef} value={styles} rows={10} readOnly />
        </Block>
      </div>
    </ThemeProvider>
  );
};

export default App;

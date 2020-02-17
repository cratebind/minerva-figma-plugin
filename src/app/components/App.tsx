import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider, Button, Block, Flex, GlobalStyles } from 'minerva-ui';
// import '../styles/ui.css';

declare function require(path: string): any;

const App = () => {
  const [styles, setStyles] = useState({});
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
        setStyles(message);
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

  console.log({ styles });

  const hasStyles = Object.keys(styles).length > 0;

  // convert styles object into a blob file
  const data = new Blob([JSON.stringify(styles)], {
    type: 'text/plain;charset=utf-8'
  });

  // create ObjectURL to use for downloading
  const url = window.URL.createObjectURL(data);

  return (
    <ThemeProvider>
      <GlobalStyles />
      <Block p={3}>
        <Flex flexDirection="column" justifyContent="center" textAlign="center">
          <img src={require('../assets/logo.svg')} alt="Minerva Logo" />
          <h2>Minerva Design System</h2>
        </Flex>
        <Button className="create" onClick={saveColors}>
          Export Theme
        </Button>
        <Flex
          mt={4}
          as="fieldset"
          flexDirection="column"
          disabled={!hasStyles}
          alignItems="center"
        >
          <a
            href={url}
            download="theme.json"
            style={{ display: 'none' }}
            aria-label="Hidden download theme link"
            id="download-link"
          >
            Download Theme File
          </a>
          <Button
            onClick={() => {
              document.getElementById('download-link').click();
            }}
          >
            Download Theme File
          </Button>
          <Button className="create" onClick={copyStyle}>
            Copy Theme Config
          </Button>
        </Flex>
        <Block>
          <textarea
            ref={textRef}
            value={hasStyles ? JSON.stringify(styles, null, 2) : ''}
            rows={10}
            readOnly
          />
        </Block>
      </Block>
    </ThemeProvider>
  );
};

export default App;

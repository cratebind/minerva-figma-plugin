figma.showUI(__html__, { width: 500, height: 700 });

const getComponents = (root, components = []) => {
  root.children.forEach(child => {
    if (child.type === 'COMPONENT') {
      components.push(child);
    }

    if (child.children && child.children.length > 0) {
      getComponents(child, components);
    }
  });

  return components;
};

const convertColor = color => {
  const { r, g, b } = color;
  return `rgb(${(r * 255).toFixed()}, ${(g * 255).toFixed()}, ${(
    b * 255
  ).toFixed()})`;
};

figma.ui.onmessage = msg => {
  // if (msg.type === 'create-rectangles') {
  //     const nodes = [];

  //     for (let i = 0; i < msg.count; i++) {
  //         const rect = figma.createRectangle();
  //         rect.x = i * 150;
  //         rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
  //         figma.currentPage.appendChild(rect);
  //         nodes.push(rect);
  //     }

  //     figma.currentPage.selection = nodes;
  //     figma.viewport.scrollAndZoomIntoView(nodes);

  //     // This is how figma responds back to the ui
  //     figma.ui.postMessage({
  //         type: 'create-rectangles',
  //         message: `Created ${msg.count} Rectangles`,
  //     });
  // }
  const components = getComponents(figma.root);
  const styles = {
    Button: {},
    Text: {}
  };

  console.log(components);

  components.forEach(component => {
    if (component.name === 'Button') {
      const [containerStyles, textStyles] = component.children;
      const { fills, height, cornerRadius } = containerStyles;
      const { fontSize, fontName, letterSpacing, lineHeight } = textStyles;
      styles.Button = {
        container: {
          backgroundColor: convertColor(fills[0].color),
          borderRadius: cornerRadius,
          height
        },
        text: {
          fontSize,
          letterSpacing,
          lineHeight,
          fontFamily: fontName.family,
          fontWeight: fontName.style.toLowerCase()
        }
      };
    }

    if (component.name === 'Body Text') {
      const textNode = component.children[0];
      const { fontSize, lineHeight, opacity, fills } = textNode;
      const color = convertColor(fills[0].color);

      styles.Text = {
        fontSize,
        lineHeight: `${lineHeight.value}${
          lineHeight.unit === 'PIXELS' ? 'px' : '%'
        }`,
        opacity,
        color
      };
    }
  });

  if (msg.type === 'save-colors') {
    console.log(figma);
    console.log({ styles });
    figma.ui.postMessage({
      type: 'export-styles',
      message: styles
    });
    // console.log(figma.getLocalPaintStyles())
  }

  // figma.closePlugin();
};

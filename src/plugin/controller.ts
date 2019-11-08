figma.showUI(__html__);

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
    console.log(components);
    const styles = {
        Button: null,
    };

    components.forEach(component => {
        if (component.name === 'Button') {
            console.log({component});
            const [containerStyles, textStyles] = component.children;
            console.log({textStyles});
            const {fills, height, cornerRadius} = containerStyles;
            const {fontSize, fontName, letterSpacing, lineHeight} = textStyles;
            styles.Button = {
                container: {
                    backgroundColor: fills[0].color,
                    borderRadius: cornerRadius,
                    height,
                },
                text: {
                    fontSize,
                    letterSpacing,
                    lineHeight,
                    fontFamily: fontName.family,
                    fontWeight: fontName.style.toLowerCase(),
                },
            };
        }
    });

    if (msg.type === 'save-colors') {
        console.log(figma);
        console.log({styles});
        // console.log(figma.getLocalPaintStyles())
    }

    // figma.closePlugin();
};

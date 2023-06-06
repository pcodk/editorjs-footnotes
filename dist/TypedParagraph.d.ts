import Paragraph from '@editorjs/paragraph';
import { API, BlockToolData, EditorConfig } from '@editorjs/editorjs';
export declare class TypedParagraph extends Paragraph {
    api: API;
    constructor(opts: {
        data: BlockToolData;
        config: EditorConfig;
        api: API;
    });
    clear(): void;
    save(blockContent: BlockToolData): any;
    render(): HTMLDivElement;
    renderSettings(): HTMLDivElement;
}
//# sourceMappingURL=TypedParagraph.d.ts.map
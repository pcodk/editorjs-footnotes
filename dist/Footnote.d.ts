import Paragraph from '@editorjs/paragraph';
import { API, BlockToolData, EditorConfig } from '@editorjs/editorjs';
export interface TuneSetting {
    name: string;
    icon: string;
    active: boolean;
    handleClick: () => void;
}
export declare class Footnote extends Paragraph {
    constructor(opts: {
        data: BlockToolData;
        config: EditorConfig;
        api: API;
    });
    renderEmbedCode(e?: any): void;
    static get sanitize(): {
        id: boolean;
        label: boolean;
        text: {
            i: boolean;
            a: boolean;
            b: boolean;
        };
        embedCode: boolean;
    };
    save(blockContent: BlockToolData): {
        id: any;
        label: any;
        text: any;
        embedCode: any;
    };
    render(): HTMLDivElement;
    /**
     * Icon and title for displaying at the Toolbox
     *
     * @return {{icon: string, title: string}}
     */
    static get toolbox(): {
        icon: string;
        title: string;
    };
}
//# sourceMappingURL=Footnote.d.ts.map
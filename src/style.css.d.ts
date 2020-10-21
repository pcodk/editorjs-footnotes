declare namespace StyleCssNamespace {
  export interface IStyleCss {
    barLabel: string;
    contentArea: string;
    embedCode: string;
    embedPreview: string;
    footnoteBlock: string;
    textInput: string;
  }
}

declare const StyleCssModule: StyleCssNamespace.IStyleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StyleCssNamespace.IStyleCss;
};

export = StyleCssModule;

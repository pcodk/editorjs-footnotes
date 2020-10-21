import Paragraph from "@editorjs/paragraph";
import { FootnoteMaker } from "./FootnoteMaker";
import { generateID } from "./generateID";
import { API, BlockToolData, EditorConfig } from "@editorjs/editorjs";
import styles from "./style.css";

interface TuneSetting {
  name: string;
  icon: string;
  active: boolean;
  handleClick: () => void;
}

export class Footnote extends Paragraph {
  constructor(opts: { data: BlockToolData; config: EditorConfig; api: API }) {
    const { data, config, api } = opts;
    super({ data, config, api });

    // if no ID is set, set one
    if (!data.id) {
      const initialID = generateID();
      this._data.id = initialID;
    }

    // if not text is set, set it
    if (!data.text) {
      this._data.text = "";
    }

    this.enableEmbedCode = false;

    this.toggleEmbedCode = this.toggleEnableEmbedCode.bind(this);
    this.save = this.save.bind(this);
    this.render = this.render.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderEmbedCode = this.renderEmbedCode.bind(this);

    this.settings = [
      {
        name: "addEmbedCode",
        icon: `<>`,
        active: false,
        handleClick: this.toggleEmbedCode.bind(this),
      },
    ];
  }

  renderEmbedCode() {
    let preview = this.wrapper.querySelector("." + styles.embedPreview);
    let embedCode = this.wrapper.querySelector("." + styles.embedCode).value;

    console.log("renderEmbedCode", this.enableEmbedCode);
    if (!this.enableEmbedCode) {
      console.log("Removing embed code preview");
      preview.remove();

      // // remove preview
      // if (preview) {
      //   preview.remove();
      // }
    }

    if (!preview) {
      preview = document.createElement("div");
      preview.classList.add(styles.embedPreview);
      this.wrapper.appendChild(preview);
    }

    preview.innerHTML = embedCode;
  }

  toggleEnableEmbedCode() {
    this.enableEmbedCode = !this.enableEmbedCode;

    console.log("Enable embed code", this.enableEmbedCode);
    let embedCode = this.wrapper.querySelector("." + styles.embedCode);
    let embedCodeLabel = this.wrapper.querySelector(".embed-code-label");
    let embedCodePreview = this.wrapper.querySelector(
      "." + styles.embedPreview
    );

    if (this.enableEmbedCode) {
      if (embedCode) {
        return;
      }

      embedCodeLabel = document.createElement("div");
      embedCodeLabel.classList.add("embed-code-label");
      embedCodeLabel.classList.add(styles.barLabel);
      embedCodeLabel.innerHTML = "Embed code";
      this.wrapper.appendChild(embedCodeLabel);

      embedCode = document.createElement("textarea");
      embedCode.classList.add(styles.embedCode);
      this.wrapper.appendChild(embedCode);
      embedCode.addEventListener("change", this.renderEmbedCode);
      embedCode.addEventListener("keyup", this.renderEmbedCode);
    } else {
      embedCodeLabel.remove();
      embedCode.remove();
      if (embedCodePreview) {
        embedCodePreview.remove();
      }
    }
  }

  static get sanitize() {
    return {
      id: false,
      text: { i: true, a: true, b: true },
      embedCode: true,
    };
  }

  save(blockContent: BlockToolData) {
    const content = blockContent.querySelector("." + styles.contentArea);
    const text = content ? content.innerHTML : "";

    const id = blockContent
      // .querySelector("." + styles.metaBar)
      .querySelector(".id-field")
      .getAttribute("data-id");

    const label = blockContent.querySelector(".label-field").textContent;

    const embedCode = blockContent.querySelector("." + styles.embedCode)
      ? blockContent.querySelector("." + styles.embedCode).value
      : undefined;

    const ret = {
      id,
      label,
      text,
      embedCode,
    };

    return ret;
  }

  renderSettings() {
    const wrapper = document.createElement("div");

    this.settings.forEach((tune: TuneSetting) => {
      let button = document.createElement("div");

      button.classList.add("cdx-settings-button");
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);

      if (tune.active) {
        button.classList.add("cdx-settings-button--active");
      }

      button.addEventListener("click", tune.handleClick);
    });

    return wrapper;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add(styles.footnoteBlock);

    const metaBar = document.createElement("div");
    // metaBar.classList.add(styles.metaBar);
    metaBar.classList.add("id-field");
    metaBar.classList.add(styles.barLabel);
    metaBar.setAttribute("data-id", this.data.id);
    metaBar.innerHTML = "[ #" + this.data.id + " ]";
    wrapper.appendChild(metaBar);

    const labelBar = document.createElement("div");
    // labelBar.classList.add(styles.metaBar);
    labelBar.classList.add(styles.barLabel);
    const label = document.createElement("div");

    label.innerHTML = "footnote label";
    const labelInput = document.createElement("div");
    labelInput.setAttribute("contentEditable", "true");
    labelInput.classList.add("label-field");
    // labelInput.classList.add(styles.flexFill);
    labelInput.classList.add(styles.textInput);
    labelBar.appendChild(label);
    labelBar.appendChild(labelInput);
    wrapper.appendChild(labelBar);

    const contentLabel = document.createElement("div");
    contentLabel.classList.add(styles.barLabel);
    contentLabel.innerHTML = "footnote body";
    wrapper.appendChild(contentLabel);

    const contentArea = document.createElement("div");
    contentArea.classList.add(styles.contentArea);
    contentArea.classList.add(styles.textInput);

    contentArea.classList.add("ce-paragraph");
    contentArea.innerHTML = this.data.text;
    contentArea.contentEditable = "true";
    wrapper.appendChild(contentArea);

    contentArea.addEventListener("keyup", this.onKeyUp);

    this.wrapper = wrapper;

    return wrapper;
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: "F",
      title: "Footnote",
    };
  }
}

console.log("Defined class", FootnoteMaker);

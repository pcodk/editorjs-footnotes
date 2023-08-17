var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Paragraph from '@editorjs/paragraph';
import { FootnoteMaker } from './FootnoteMaker';
import { generateID } from './generateID';
import * as styles from './style.css';
var Footnote = /** @class */ (function (_super) {
    __extends(Footnote, _super);
    function Footnote(opts) {
        var _this = this;
        var data = opts.data, config = opts.config, api = opts.api;
        _this = _super.call(this, { data: data, config: config, api: api }) || this;
        // if no ID is set, set one
        if (!data.id) {
            var initialID = generateID();
            _this._data.id = initialID;
        }
        // if not text is set, set it
        if (!data.text) {
            _this._data.text = '';
        }
        _this.save = _this.save.bind(_this);
        _this.render = _this.render.bind(_this);
        _this.renderEmbedCode = _this.renderEmbedCode.bind(_this);
        return _this;
    }
    Footnote.prototype.renderEmbedCode = function (e) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        var embedCodeLabel = this.wrapper.querySelector('.' + styles.embedCodeLabel);
        var embedCode = this.wrapper.querySelector('.' + styles.embedCode);
        var embedCodePreview = this.wrapper.querySelector('.' + styles.embedPreview);
        if (!embedCodeLabel) {
            embedCodeLabel = document.createElement('div');
            embedCodeLabel.classList.add(styles.embedCodeLabel);
            embedCodeLabel.classList.add(styles.barLabel);
            embedCodeLabel.innerHTML = 'Embed code';
            this.wrapper.appendChild(embedCodeLabel);
        }
        if (!embedCode) {
            embedCode = document.createElement('textarea');
            embedCode.value = this.data.embedCode || '';
            embedCode.classList.add(styles.embedCode);
            embedCode.addEventListener('change', this.renderEmbedCode);
            embedCode.addEventListener('keyup', this.renderEmbedCode);
            this.wrapper.appendChild(embedCode);
        }
        if (!embedCodePreview) {
            embedCodePreview = document.createElement('div');
            embedCodePreview.classList.add(styles.embedPreview);
            embedCodePreview.innerHTML = embedCode.value;
            this.wrapper.appendChild(embedCodePreview);
        }
        embedCodePreview.innerHTML = embedCode.value;
    };
    Object.defineProperty(Footnote, "sanitize", {
        get: function () {
            return {
                id: false,
                label: false,
                text: { i: true, a: true, b: true },
                embedCode: true,
            };
        },
        enumerable: false,
        configurable: true
    });
    Footnote.prototype.save = function (blockContent) {
        var content = blockContent.querySelector('.' + styles.contentArea);
        var text = content ? content.innerHTML : '';
        var id = blockContent
            .querySelector('.' + styles.idField)
            .getAttribute('data-id');
        var label = blockContent.querySelector('.label-field').textContent;
        var embedCode = blockContent.querySelector('.' + styles.embedCode).value;
        var ret = {
            id: id,
            label: label,
            text: text,
            embedCode: embedCode,
        };
        console.log('Saving', ret);
        return ret;
    };
    Footnote.prototype.render = function () {
        var wrapper = document.createElement('div');
        wrapper.classList.add(styles.footnoteBlock);
        var idBar = document.createElement('div');
        idBar.classList.add(styles.idField);
        idBar.classList.add(styles.barLabel);
        idBar.setAttribute('data-id', this.data.id);
        idBar.innerHTML = '[ #' + this.data.id + ' ]';
        wrapper.appendChild(idBar);
        // const labelBar = document.createElement('div')
        // labelBar.classList.add(styles.barLabel)
        var label = document.createElement('div');
        label.innerHTML = 'footnote label';
        label.classList.add(styles.barLabel);
        var labelInput = document.createElement('div');
        labelInput.setAttribute('contentEditable', 'true');
        labelInput.classList.add('label-field');
        // labelInput.classList.add(styles.flexFill);
        labelInput.classList.add(styles.textInput);
        labelInput.innerHTML = this.data.label || '';
        wrapper.appendChild(label);
        wrapper.appendChild(labelInput);
        // wrapper.appendChild(labelBar)
        var contentLabel = document.createElement('div');
        contentLabel.classList.add(styles.barLabel);
        contentLabel.innerHTML = 'footnote body';
        wrapper.appendChild(contentLabel);
        var contentArea = document.createElement('div');
        contentArea.classList.add(styles.contentArea);
        contentArea.classList.add(styles.textInput);
        contentArea.classList.add('ce-paragraph');
        contentArea.innerHTML = this.data.text;
        contentArea.contentEditable = 'true';
        wrapper.appendChild(contentArea);
        contentArea.addEventListener('keyup', this.onKeyUp);
        this.wrapper = wrapper;
        this.renderEmbedCode();
        return wrapper;
    };
    Object.defineProperty(Footnote, "toolbox", {
        /**
         * Icon and title for displaying at the Toolbox
         *
         * @return {{icon: string, title: string}}
         */
        get: function () {
            return {
                icon: 'F',
                title: 'Footnote',
            };
        },
        enumerable: false,
        configurable: true
    });
    return Footnote;
}(Paragraph));
export { Footnote };
console.log('Defined class', FootnoteMaker);
//# sourceMappingURL=Footnote.js.map
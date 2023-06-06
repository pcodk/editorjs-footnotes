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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Paragraph from '@editorjs/paragraph';
import styles from "./TypedParagraph.css";
var TypedParagraph = /** @class */ (function (_super) {
    __extends(TypedParagraph, _super);
    function TypedParagraph(opts) {
        var _this = this;
        var data = opts.data, config = opts.config, api = opts.api;
        _this = _super.call(this, { data: data, config: config, api: api }) || this;
        _this.api = api;
        // if no paragraph type is set, set one
        if (!data.paragraphType) {
            _this.data.paragraphType = "paragraph";
        }
        _this.clear = _this.clear.bind(_this);
        _this.onPaste = _this.onPaste.bind(_this);
        _this.save = _this.save.bind(_this);
        _this.render = _this.render.bind(_this);
        _this.renderSettings = _this.renderSettings.bind(_this);
        return _this;
    }
    TypedParagraph.prototype.clear = function () {
        console.log("Clearing");
        _super.prototype.clear.call(this);
    };
    // onPaste(event: Event) {
    // }
    TypedParagraph.prototype.save = function (blockContent) {
        var innerBlock = blockContent.querySelector(".ce-paragraph");
        var paragraphType = blockContent
            .getAttribute("data-paragraph-type");
        var ret = _super.prototype.save.call(this, innerBlock);
        return __assign({ paragraphType: paragraphType }, ret);
    };
    TypedParagraph.prototype.render = function () {
        var _this = this;
        var ret = _super.prototype.render.call(this);
        ret.addEventListener('paste', function (event) {
            console.log(event.clipboardData.types);
            // console.log(event.clipboardData.getData("text/html"))
            var s = "";
            try {
                s = event.clipboardData.getData("text/html");
                // console.log("Loaded text/html")
            }
            catch (_a) {
                console.log("Falling back to plain text");
                s = event.clipboardData.getData("text/plain");
            }
            // s = s.replace(/<!--StartFragment-->([^<]*(?:<(?!!--(?:Start|End)Fragment-->)[^<]*)*)<!--EndFragment-->/g, '$1');
            // var arr = [s]
            if (s.indexOf("<!--StartFragment-->") < 0) {
                console.log("Not MS Word Content", s);
                return;
            }
            if (!window.confirm("Use MS Word super-pasting black magic?")) {
                return;
            }
            console.log("MS Word Content");
            event.preventDefault();
            var rx = /<!--StartFragment-->([^<]*(?:<(?!!--(?:Start|End)Fragment-->)[^<]*)*)<!--EndFragment-->/g;
            var arr = rx.exec(s);
            arr.forEach(function (item, index) {
                console.log("arr [".concat(index + 1, " / ").concat(arr.length, "]: ").concat(item));
            });
            ret.innerHTML = "";
            var tmp = document.createElement("div");
            tmp.innerHTML = s;
            var paragraphs = tmp.getElementsByTagName("p");
            for (var i = 0; i < paragraphs.length; i++) {
                var p = paragraphs.item(i);
                var isFootnote = p.classList.contains("MsoFootnoteText");
                var blockContent = _this.api.sanitizer.clean(p.innerHTML, {
                    i: true,
                    a: { href: true },
                    b: true,
                });
                var blockData = {
                    text: blockContent
                };
                var blockType = "paragraph";
                if (isFootnote) {
                    var anchors = p.getElementsByTagName("a");
                    if (anchors.length < 1) {
                        console.log("ruh-roh no anchors found. can't get footnote id", p);
                        continue;
                    }
                    var firstLink = anchors[0];
                    // remove the reundent first link
                    p.removeChild(firstLink);
                    blockData["text"] = _this.api.sanitizer.clean(p.innerHTML, {
                        i: true,
                        a: { href: true },
                        b: true,
                    });
                    console.log("isFootnote", firstLink.getAttribute("href"), firstLink.getAttribute("name"));
                    var footnoteID = firstLink.getAttribute("name");
                    var footnoteLabel = firstLink.innerText.replace("[", "").replace("]", "").trim();
                    console.log("footnoteLabel Text", footnoteLabel);
                    blockType = "footnoteParagraph";
                    blockData["id"] = footnoteID;
                    blockData["label"] = footnoteLabel;
                }
                console.log("inserting parsed-paragraph", isFootnote, p);
                _this.api.blocks.insert(blockType, blockData);
            }
            // if (s && s.length > 0) {
            // console.log('arr.length', arr.length, 'arr[1]', arr[1])
            // ret.innerHTML = arr[1]
            var cleaned = _this.api.sanitizer.clean(s, {
                i: true,
                a: { href: true, name: true },
                b: true,
                p: {}
            });
            console.log("cleaned", cleaned);
            // ret.innerHTML = cleaned
        });
        // const currentParagraphType: ParagraphType = this._data.paragraphType === "paragraph" ? "paragraph" : "blockquote"
        console.log("currentParagraphType", this.data.paragraphType);
        var currentParagraphType = this.data.paragraphType || "paragraph";
        // const currentParagraphType = "paragraph"
        // console.log("154: currentParagraphType:", currentParagraphType)
        var wrapper = document.createElement("div");
        wrapper.setAttribute("data-paragraph-type", currentParagraphType);
        wrapper.classList.add(styles["typed-paragraph-wrapper"]);
        this.wrapper = wrapper;
        wrapper.appendChild(ret);
        return wrapper;
    };
    TypedParagraph.prototype.renderSettings = function () {
        var _this = this;
        var getParagraphType = function () {
            var paragraphTypeAttribute = _this.wrapper.getAttribute("data-paragraph-type");
            console.log("paragraphTypeAttribute", paragraphTypeAttribute);
            return paragraphTypeAttribute === "paragraph" ? "paragraph" : "blockquote";
        };
        var reverseParagraphType = function (p) {
            return p === "paragraph" ? "blockquote" : "paragraph";
        };
        var setParagraphType = function (newParagraphType) {
            _this.wrapper.setAttribute("data-paragraph-type", newParagraphType);
            // toggleTypeButton.innerHTML = newParagraphType === "paragraph" ? "P" : "B"
        };
        var settings = [
            {
                name: 'BlockQuote',
                icon: getParagraphType() === "paragraph" ? "B" : "P",
                onclick: function () {
                    setParagraphType(reverseParagraphType(getParagraphType()));
                    var settings = _this.wrapper.querySelector(".ce-settings");
                }
            },
        ];
        var wrapper = document.createElement('div');
        settings.forEach(function (tune) {
            var button = document.createElement('div');
            button.classList.add('cdx-settings-button');
            button.innerHTML = tune.icon;
            wrapper.appendChild(button);
            button.onclick = tune.onclick;
        });
        return wrapper;
    };
    return TypedParagraph;
}(Paragraph));
export { TypedParagraph };
//# sourceMappingURL=TypedParagraph.js.map
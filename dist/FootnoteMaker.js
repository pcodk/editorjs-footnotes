import { generateID } from './generateID';
var FootnoteMaker = /** @class */ (function () {
    function FootnoteMaker(args) {
        var api = args.api;
        this.api = api;
        // this.button = null;
        this.state = false;
        this.render = this.render.bind(this);
        this.surround = this.surround.bind(this);
    }
    Object.defineProperty(FootnoteMaker, "isInline", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    FootnoteMaker.prototype.render = function () {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContent = 'M';
        this.button.classList.add(this.api.styles.inlineToolButton);
        return this.button;
    };
    FootnoteMaker.prototype.surround = function (range) {
        // TODO - Check to see if there are any <mark> elements inside
        // the selectedText. If so, don't allow a footnote to be created.
        // however, this will require us to create a "delete" footnote
        // button. Or we could automatically broaden a footnote when
        // the user selects beyond either end of a mark, or srhink the
        // footnote when the user selects within it.
        // The way link handles it is if any part of an existing link is
        // selected, the icon changes to a delete link icon. this is
        // probably a good solution.
        // https://github.com/codex-team/editor.js/blob/next/src/components/inline-tools/inline-tool-link.ts
        if (this.state) {
            // If highlights is already applied, do nothing for now
            return;
        }
        var selectedText = range.extractContents();
        // Create MARK element
        var id = generateID();
        var mark = document.createElement('a');
        mark.href = '#' + id;
        var footnoteNumber = document.createElement('small');
        footnoteNumber.innerHTML = ' [ #' + id + ' ]';
        // Append to the MARK element selected TextNode
        mark.appendChild(selectedText);
        mark.appendChild(footnoteNumber);
        // Insert new element
        range.insertNode(mark);
        // add a footnote block now
        var newBlock = this.api.blocks.insert('footnoteParagraph', { id: id }, undefined, undefined, true);
        // console.log(
        //   this.api.blocks
        //     .getBlockByIndex(this.api.blocks.getCurrentBlockIndex())
        //     .save()
        //     .then((d) => console.log(d))
        // );
        this.api.inlineToolbar.close();
        // this.api.focus(this.api.blocks.getCurrentBlockIndex() + 1)
    };
    FootnoteMaker.prototype.clear = function () {
        console.log('Clear called');
    };
    FootnoteMaker.prototype.checkState = function (selection) {
        var text = selection.anchorNode;
        if (!text) {
            return;
        }
        var anchorElement = text instanceof Element ? text : text.parentElement;
        this.state = !!anchorElement.closest('MARK');
        return this.state;
    };
    return FootnoteMaker;
}());
export { FootnoteMaker };
console.log('Defined class', FootnoteMaker);
//# sourceMappingURL=FootnoteMaker.js.map
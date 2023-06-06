var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function getFootnoteBlockIndex(footnoteID, editor) {
    return __awaiter(this, void 0, void 0, function () {
        var blocks, i, block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, editor.save().then(function (d) { return d.blocks; })];
                case 1:
                    blocks = _a.sent();
                    console.log("getFootnoteBlockIndex", footnoteID);
                    for (i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        // console.log("getFootnoteBlockIndex", footnoteID, "block", block)
                        if (block["type"] !== "footnoteParagraph") {
                            continue;
                        }
                        console.log("getFootnoteBlockIndex", footnoteID, "id", block["data"]["id"], "block", block);
                        if (block["data"]["id"] === footnoteID) {
                            console.log("FOUND", block);
                            return [2 /*return*/, i];
                        }
                    }
                    throw ("No footnote found with id: " + footnoteID);
            }
        });
    });
}
function getFootnotes(blockText) {
    var ret = [];
    var tmp = document.createElement("div");
    tmp.innerHTML = blockText;
    var anchors = tmp.getElementsByTagName("a");
    var footnoteIDs = [];
    console.log();
    for (var i = 0; i < anchors.length; i++) {
        var a = anchors[i];
        console.log("logging-a:", a);
        var href = a.getAttribute("href");
        if (!href) {
            continue;
        }
        footnoteIDs.push(href);
    }
    tmp.remove();
    console.log("footnoteIDs", footnoteIDs);
    return footnoteIDs;
}
function popFootnoteBlocks(editor) {
    return __awaiter(this, void 0, void 0, function () {
        var footnotes, i, blockObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    footnotes = {};
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < editor.blocks.getBlocksCount())) return [3 /*break*/, 3];
                    return [4 /*yield*/, editor.blocks.getBlockByIndex(i).save()];
                case 2:
                    blockObject = _a.sent();
                    if (blockObject["data"] && blockObject["tool"] == "footnoteParagraph" && blockObject["data"]["text"]) {
                        footnotes[blockObject["data"]["id"]] = blockObject;
                        console.log("Deleting footnote", blockObject);
                        editor.blocks.delete(i);
                        i = 0;
                        return [3 /*break*/, 1];
                    }
                    i++;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, footnotes];
            }
        });
    });
}
function addFoonotesBack(footnotes, editor) {
    return __awaiter(this, void 0, void 0, function () {
        var i, block, blockData, footnoteIDs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Adding footnotes back", footnotes);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < editor.blocks.getBlocksCount())) return [3 /*break*/, 3];
                    block = editor.blocks.getBlockByIndex(i);
                    return [4 /*yield*/, block.save()];
                case 2:
                    blockData = _a.sent();
                    if (blockData["tool"] !== "paragraph") {
                        i++;
                        return [3 /*break*/, 1];
                    }
                    footnoteIDs = getFootnotes(blockData["data"]["text"]);
                    footnoteIDs.reverse().map(function (footnoteID) {
                        editor.caret.setToBlock(i);
                        var footnoteData = footnotes[footnoteID.replace("#", "")];
                        if (!footnoteData) {
                            return;
                        }
                        console.log("Inserting at index", i, footnoteID, footnoteData); // footnotes[footnoteID].data)
                        editor.blocks.insert("footnoteParagraph", footnoteData["data"]);
                        // clear the footnote so it can't be inserted again
                        // footnotes[footnoteID.replace("#", "")] = undefined
                    });
                    i++;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
export default function sortBlocks(editor) {
    return __awaiter(this, void 0, void 0, function () {
        var footnotes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, popFootnoteBlocks(editor)];
                case 1:
                    footnotes = _a.sent();
                    console.log("popped footnotes", footnotes);
                    addFoonotesBack(footnotes, editor);
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=sortBlocks.js.map
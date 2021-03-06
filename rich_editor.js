/**
 * Copyright (C) 2015 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var RE = {};

RE.currentSelection = {
    "startContainer": 0,
    "startOffset": 0,
    "endContainer": 0,
    "endOffset": 0};


RE.editor = document.getElementById('editor');

document.addEventListener("selectionchange", function() { RE.backuprange(); });

// Initializations
RE.callback = function() {
    window.location.href = "re-callback://" + encodeURI(RE.getHtml());
}

RE.setHtml = function(contents) {
    RE.editor.innerHTML = decodeURIComponent(contents.replace(/\+/g, '%20'));
}

RE.getHtml = function() {
    return RE.editor.innerHTML;
}

RE.getText = function() {
    return RE.editor.innerText;
}

RE.setBaseTextColor = function(color) {
    RE.editor.style.color  = color;
}

RE.setBaseFontSize = function(size) {
    RE.editor.style.fontSize = size;
}

RE.setPadding = function(left, top, right, bottom) {
  RE.editor.style.paddingLeft = left;
  RE.editor.style.paddingTop = top;
  RE.editor.style.paddingRight = right;
  RE.editor.style.paddingBottom = bottom;
}

RE.setBackgroundColor = function(color) {
    document.body.style.backgroundColor = color;
}

RE.setBackgroundImage = function(image) {
    RE.editor.style.backgroundImage = image;
}

RE.setWidth = function(size) {
    RE.editor.style.minWidth = size;
}

RE.setHeight = function(size) {
    document.body.style.minHeight = size;
    G("text_linenumber").style.height = size + "px";
}

RE.setTextAlign = function(align) {
    RE.editor.style.textAlign = align;
}

RE.setVerticalAlign = function(align) {
    RE.editor.style.verticalAlign = align;
}

RE.setPlaceholder = function(placeholder) {
    RE.editor.setAttribute("placeholder", placeholder);
}

RE.undo = function() {
    document.execCommand('undo', false, null);
}

RE.redo = function() {
    document.execCommand('redo', false, null);
}

RE.setBold = function() {
    document.execCommand('bold', false, null);
}

RE.setItalic = function() {
    document.execCommand('italic', false, null);
}

RE.setSubscript = function() {
    document.execCommand('subscript', false, null);
}

RE.setSuperscript = function() {
    document.execCommand('superscript', false, null);
}

RE.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
}

RE.setUnderline = function() {
    document.execCommand('underline', false, null);
}

RE.setTextColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

RE.setTextBackgroundColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

RE.setHeading = function(heading) {
    document.execCommand('formatBlock', false, '<h'+heading+'>');
}

RE.setIndent = function() {
    document.execCommand('indent', false, null);
}

RE.setOutdent = function() {
    document.execCommand('outdent', false, null);
}

RE.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
}

RE.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
}

RE.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
}

RE.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
}

RE.insertImage = function(url, alt) {
    var html = '<img src="' + url + '" alt="' + alt + '" />';
    RE.insertHTML(html);
}

RE.insertHTML = function(html) {
    RE.restorerange();
    document.execCommand('insertHTML', false, html);
}

RE.insertLink = function(url, title) {
    RE.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length != 0) {
        if (sel.rangeCount) {

            var el = document.createElement("a");
            el.setAttribute("href", url);
            el.setAttribute("title", title);

            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    RE.callback();
}

RE.prepareInsert = function() {
    RE.backuprange();
}

RE.backuprange = function(){
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      RE.currentSelection = {
          "startContainer": range.startContainer,
          "startOffset": range.startOffset,
          "endContainer": range.endContainer,
          "endOffset": range.endOffset};
    }
}

RE.restorerange = function(){
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
}

RE.enabledEditingItems = function(e) {
    var items = [];
    if (document.queryCommandState('bold')) {
        items.push('bold');
    }
    if (document.queryCommandState('italic')) {
        items.push('italic');
    }
    if (document.queryCommandState('subscript')) {
        items.push('subscript');
    }
    if (document.queryCommandState('superscript')) {
        items.push('superscript');
    }
    if (document.queryCommandState('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (document.queryCommandState('underline')) {
        items.push('underline');
    }
    if (document.queryCommandState('insertOrderedList')) {
        items.push('orderedList');
    }
    if (document.queryCommandState('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (document.queryCommandState('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (document.queryCommandState('justifyFull')) {
        items.push('justifyFull');
    }
    if (document.queryCommandState('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (document.queryCommandState('justifyRight')) {
        items.push('justifyRight');
    }
    if (document.queryCommandState('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }
    //window.getSelection().focusOffset
    //window.getSelection().createRange();
    //document.selection.createRange();
    //document.selection
    var rng = document.createRange();

    var sel = window.getSelection();
    sel.addRange()
    var cursor = 0; // 光标位置
    var range = document.selection.createRange();
    var srcele = range.parentElement();//获取到当前元素
    var copy = document.body.createTextRange();
    copy.moveToElementText(srcele);
    for (cursor = 0; copy.compareEndPoints("StartToStart", range) < 0; cursor++)
    {
        copy.moveStart("character", 1);//改变光标位置，实际上我们是在记录cursor的数量.
    }
    window.location.href = "re-state://" + encodeURI(items.join(','));
}

RE.focus = function() {
    var range = document.createRange();
    range.selectNodeContents(RE.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
}

RE.blurFocus = function() {
    RE.editor.blur();
}

RE.removeFormat = function() {
    execCommand('removeFormat', false, null);
}

RE.testFun = function(){
//    window.TestJS.printTest("111111111111111111");
//    window.TestJS.getText(RE.getText());
    var properties = "";
    for(var i in RE.editor)
    {
        properties += "s=[" + i + "]\n";
    }
    var lines = RE.getText().split(/\n/g);
//    window.TestJS.getSelection(properties);//(RE.editor.length);
    var test = "******\n";
    for(i = 0; i < lines.length; i++ )
    {
        test += i + " " + lines[i] + "\n"
    }
    test += "\n";
    window.TestJS.getSelection(test);//(lines.length);
//    RE.setUnderline();

}
RE.touchStart = function () {
    window.location.href = "re-touchstart://";
}
RE.touchMove = function () {
    //window.location.href = "re-touchmove://" + encodeURI(RE.getHtml());

    window.location.href = "re-touchmove://";

}
RE.touchEnd = function () {
    window.location.href = "re-touchend://";
}
//此方法是无效的，此处只有window.onscroll是有效的
RE.onScroll = function() {
    window.location.href = "re-scroll://";
}
window.onscroll = function(){
    window.location.href = "re-scroll://";
}

var cursor = 0; // 光标位置
document.onselectionchange = function () {
    var range = document.selection.createRange();
    var srcele = range.parentElement();//获取到当前元素
    var copy = document.body.createTextRange();
    copy.moveToElementText(srcele);
    for (cursor = 0; copy.compareEndPoints("StartToStart", range) < 0; cursor++) {
        copy.moveStart("character", 1);//改变光标位置，实际上我们是在记录cursor的数量.
    }
    alert(cursor);

    window.scrollY
    RE.editor.scrollY
}

function keyUp()
{
    var ed = document.getElementById('editor');
    window.getSelection().anchorOffset;
    window.getSelection().anchorNode.
    //RE.editor.getUserData().selectionStart;
    //navigator.userAgent.indexOf("MSIE")
    //ed.selection().start
    //doucment.body.style.minHeight;
    //RE.editor.he;
    //RE.editor.getAttribute().se
    window.event.clientY
}
    function keyUp(){
    var obj=G("c2");
    var str=obj.value;
    str=str.replace(/\r/gi,"");
    str=str.split("\n");
    n=str.length;
    line(n);
    }
// Event Listeners
RE.editor.addEventListener("input", RE.callback);
RE.editor.addEventListener("keyup", function(e) {
    var KEY_LEFT = 37, KEY_RIGHT = 39;
    if (e.which == KEY_LEFT || e.which == KEY_RIGHT) {
        RE.enabledEditingItems(e);
    }
});

window.onload
RE.editor.scrollTop
//RE.editor.addEventListener("focus")
RE.editor.addEventListener("click", RE.enabledEditingItems);
RE.editor.addEventListener("touchstart", RE.touchStart);
RE.editor.addEventListener("touchmove", RE.touchMove);
RE.editor.addEventListener("touchend", RE.touchEnd);
RE.editor.addEventListener("scroll",RE.onScroll);
//document.addEventListener("click",document.onselectionchange)
RE.editor.addEventListener("change",RE.callback);

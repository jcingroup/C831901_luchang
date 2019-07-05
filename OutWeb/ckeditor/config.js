﻿/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
var d = new Date();
var n = d.getTime();
CKEDITOR.editorConfig = function (config) {
    config.skin = 'bootstrapck';
    config.height = 300;
    config.language = 'zh';
    config.extraPlugins = 'youtube,emojione';
    config.contentsCss = ['../../Content/css/editor.css?v=' + n];
    config.toolbar = [
        { name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteFromWord", "Undo", "Redo"] },
    { name: "basicstyles", items: ["FontSize", "Bold", "Underline", "Strike", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "-", "RemoveFormat"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
    { name: "styles", items: ["Styles"] },
    { name: "links", items: ["Link", "Unlink"] },
    { name: 'insert', items: ['Image', 'Table', 'Youtube', 'Emojione'] },    
    { name: "document", items: ["Source", "-"] },
    { name: "tools", items: ["Maximize", "-"] },
    { name: "editing" }
    ];

    config.autoUpdateElement = true;
    config.allowedContent = true;
    config.fontSize_sizes = '13/13px;14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;22/22px;24/24px;36/36px;48/48px;';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;新細明體;細明體;標楷體;微軟正黑體';
    config.stylesSet = [
        { name: '標題1', element: 'h2' },
        { name: '標題2', element: 'h3' },
        { name: '標題3', element: 'h4' },      
        { name: '標題4', element: 'h5' },
        { name: '數字列表-有數字', element: 'ol', attributes: { 'class': 'ml-l' } },
        { name: '數字列表-無數字', element: 'ol', attributes: { 'class': 'list-unstyled ml-l' } },
        { name: '圖標列表-有圖標', element: 'ul', attributes: { 'class': 'ml-l' } },
        { name: '圖標列表-無圖標', element: 'ul', attributes: { 'class': 'list-unstyled ml-l' } },
        { name: '表格-有框線', element: 'table', attributes: { 'class': 'table-bordered' } },
        { name: '表格-寬度滿版', element: 'table', attributes: { 'class': 'full' } }
    ];
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
};
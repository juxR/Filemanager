;
(function ($) {
    var oLang,
        file = $('#file_filemanager'),
        button_file = $('#filemanager_library'),
        finder = $('#folder_finder'),
        foldersName = $('#folder').find('div.name'),
        foldersInput = $('#folder').find('input.name'),
        folders = [],
        folderList = $('#folder'),
        nav_link = $('#filemanager_library-popup .navigation a');

    $(function () {
        getModuleTranslation();
        button_file.on('click', openFileUpload);
        nav_link.on('click', createFolder);
        foldersInput.on('blur', editFolderName);
        foldersName.on('dblclick', editFolderName);

        file.fileupload({
            url: 'ajax/upload',
            dataType: 'json',
            done: function (e, oData) {
                console.log(oData);
            }
        });

    });
    var editFolderName = function (e) {
        e.preventDefault();
        console.log($(this));
        displayInputFolderName($(this));
    }
    var displayInputFolderName = function ($that) {
        $that.parent().find('input.name').toggleClass('hidden');
        $that.parent().find('div.name').toggleClass('hidden');

        refreshHtmlFolderNameValue($that);
    }
    var hiddenInputAndShowName = function () {
        $(this).toggleClass('hidden');
    }
    var displayFolder = function (oData) {
        if (oData !== "undefined") {
            var folder = {};
            folder.id = oData.id;
            folder.name = oLang.library.folder.default_name;
            folder.icon = null;

            folders.push(folder);
            var folder_output = '<div id="folder" data-id="' + folder.id + '"> <div class="icon"> <a href="javascript:void(0)" data-request="open_folder"> <img src="http://placehold.it/60x60" alt="' + oLang.library.Folder + '"/> </a> </div> <div class="name">' + oLang.library.folder.default_name + ' </div><input type="text" data-request="edit_folder_name" class="name hidden" value="' + oLang.library.folder.default_name + '"/> </div>';

            return folder_output;

            refreshHtmlFolderNameValue();
        }
    }
    var refreshHtmlFolderNameValue = function ($that) {
        refreshFolderNameValue($that);
        $that.parent().find('div.name').html($that.parent().find('input.name').val());
    }
    var refreshFolderNameValue = function ($that) {
        if ($that === "undefined") {
            $that = $(this);
        }
        var data = {'name': $that.val()};
        $.ajax({
            url: 'ajax/folder/update/' + $that.parents('#folder').attr('data-id'),
            data: data,
            success: function (oData) {
                console.log(oData);
            }
        });
    }
    var createFolder = function () {
        $.ajax({
            url: 'ajax/folder/create',
            dataType: 'json',
            data: {'name': oLang.library.folder.default_name},
            success: function (oData) {
                var folder = $(displayFolder(oData));
                console.log(folder);
                finder.append(folder);
                folder.find('input.name').removeClass('hidden').focus();
                folder.find('input.name').on('blur', hiddenInputAndShowName);
                folder.find('input.name').on('change', refreshFolderNameValue);
            }
        });
    }


    var openFileUpload = function (e) {
        e.preventDefault();
        file.click();
    }
    var getModuleTranslation = function () {
        $.ajax({
            url: 'ajax/getTranslation',
            dataType: 'json',
            async: false,
            success: function (oData) {
                oLang = oData;
            }
        });
    }
}).
    call(this, jQuery);
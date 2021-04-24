var dataTable;

function resetData($, btn, table) {
    
    $('#nav-data').addClass('d-none')
    
    $('#labels-content').find('.custom-control').each(function() {
        $(this).remove()
    })  

    $('#pills-table thead, #pills-table tbody')
        .empty().html('<tr></tr>')

    // Debug DataTables warning - Cannot reinitialise DataTable
    if ($('.list-table').hasClass('datatable-loaded')) {
        $('.list-table').html(table)
    }
}
function isItJSON(data) {
    try {
        // If JSON, parse it and return value into strig
        var array = JSON.parse(data);
        var string = '';
        jQuery.each(array,function(key, val) {
            string += val +' ';
        })
        return string;
    } catch (e) {
        // Return data as string
        return data;
    }
}

function loadData($,data,formId) {
            
        $.each(data,function(key1, val1) {

            // Get config data form
            if(key1 == 'form') {
                $.each(val1,function(key2, val2) {

                    if(key2 == 'formName') {
                        
                        // Load form name as title
                        $.each(val2,function(key3, val3) {
                            $('#formName').text(val3)
                        })
                        
                    } else if(key2 == 'labels') {

                        $('#pills-table thead tr').append(
                            '<th data-id="">#</th>');
                    
                        var i = 1;
                        $.each(val2,function(key3, val3) {
                            
                            if (val3['type'] != 'html' && val3['type'] != 'button'
                             && val3['entry_list'] == 1) {
                            
                                // Load labels into thead
                                $('#pills-table thead tr').append(
                                    '<th data-id="'+ val3['id'] +'">'+ val3['label'] +'</th>'
                                )

                                // Load labels to unselect
                                $('#labels-content').attr('data-form', formId).append(
                                    '<div class="custom-control custom-checkbox col-sm-3 col-6 mb-1">'
                                        +'<input type="checkbox" id="'+ val3['id'] +'" '
                                            +'class="custom-control-input labels-input-control" '
                                            +'value="'+ val3['id'] +'" data-column="'+ i +'" '
                                            +'checked>'
                                        +'<label class="custom-control-label labels-label-control" '
                                            +'for="'+ val3['id'] +'" data-column="'+ i++ +'">'
                                            + val3['label']  +'</label>'
                                    +'</div>'
                                )

                                // Init tbody depending on form labels id
                                $('#pills-table tbody tr').append(
                                    '<td data-id="'+ val3['id'] +'"></td>'
                                )
                        
                            }
                            
                        })

                    }
                })

            // Get values entries
            } else if(key1 == 'values') {

                // Get initiated tbody id labels than remove them
                var tr = $('#pills-table tbody').html()
                $('#pills-table tbody').empty()

                // Add tbody > tr depending on entries length (2 entries = 2 tr)
                for (var i = 0; i < Object.keys(val1).length; i++) {
                    $('#pills-table tbody').append(tr)
                }

                // For each entry add entryId to tr data-id
                Object.keys(val1).forEach(function(key2, i, val2) {
                    $('#pills-table tbody tr:eq('+ i +')').attr('data-id', key2)
                            .prepend('<td data-id="'+ key2 
                                +'" class="control-check noExl">'+ key2 +'</td>');
                })

                // Get JSON data values
                $.each(val1,function(key2, val2) {
                    $.each(val2,function(key3, val3) {
                        $('#pills-table tbody tr').each(function() {

                            // If tr data-id == entryId
                            if ($(this).attr('data-id') == key2) {

                                // Load values depending on labels id
                                $(this).find('td').each(function() {
                                    if ($(this).attr('data-id') == key3) {
                                        $(this).text(isItJSON(val3))
                                    }
                                })

                            }

                        })
                    })
                })

            }

        })
        $('#nav-data').removeClass('d-none')
        $('#loader').hide()
}

// Get locale to load datatables i18n file name
function getDatatablesLang(locale) {
    var langName, lang = locale.replace('-', '_')
    jQuery.ajax({
       url: pluginUrl +'/asset/js/locale.json',
       type: 'get',
       dataType: 'json',
       async: false,
       success: function(data) {
           langName = data[lang]
       } 
    });
    return langName
}

// Nest table into div to get overflow with datatables config
function overflowTable($) {
    var table = $('#pills-table').contents()
                    ['prevObject'][0]['childNodes'][1]['childNodes'][2]
                    ['previousElementSibling']['childNodes'][3]
    var div = '<div class="table-overflow col-12 pt-2"></div>'
    var newTable = $(div).html(table)
    var newDiv = $(newTable).insertAfter($('#datatables_filter'))
    return $(newDiv).insertAfter($('#datatables_filter'))
}

// Create file's name depending on form name
function nameFile($) {
    var today = new Date(),
        d = String(today.getDate()).padStart(2, '0'),
        m = String(today.getMonth() + 1).padStart(2, '0'),
        Y = today.getFullYear(),
        h = String(today.getHours()).padStart(2, '0'),
        m = String(today.getMinutes()).padStart(2, '0'),
        s = String(today.getSeconds()).padStart(2, '0'),
        name = $('#formName').text();
    var filename = name.replace(' ', '-')
    return filename +'_'+ Y + m + d +'-'+ h + m + s
}

// Hide pagination if only one page
function togglePagination($) {
    if ($('#datatables_paginate > span > a').length == 1) {
        $('#datatables_paginate').addClass('d-none')
    }
}

// Init Datatables
function loadDatatables($) {
    var langName = getDatatablesLang($('html').attr('lang'))
    dataTable = $('#datatables').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/'+ langName +'.json',
            select: {
                rows: {
                    _: '<span class="d-custom"> &nbsp; &nbsp; &nbsp; </span>%d<span class="dashicons dashicons-yes"></span>' 
                            +'&nbsp; <span id="deselect" class="dashicons dashicons-dismiss"></span>',
                    0: ''
                }
            },
            buttons: {
                selectNone: '<span class="dashicons dashicons-dismiss"></span>'
            }
        },
        select: {
            style: 'multi'
        }, 
        dom: 'Blfrtip',
        buttons: [
            {
                extend: 'selectNone',
                text: ''
            },
            {
                extend: 'excelHtml5',
                title:  nameFile($),
                text: '',
                exportOptions: {
                    columns: [ 0, ':visible' ]
                }
            }
        ],
        'order': [],
        'initComplete': function(settings, json) {
            overflowTable($),
            togglePagination($)
            
        }
    });
    $('.list-table').addClass('datatable-loaded')
}

jQuery(function($) {
    
    // Hide loder at the end of dom ready
    $('#loader').hide()
    
    // Unselect/hide column
    $('#labels-content').delegate('.labels-input-control', 'change', function(e) {
        e.preventDefault();
        var column = dataTable.column( $(this).attr('data-column') );
        column.visible( ! column.visible() );
    })
    
    // Load entries clicked form
    var tableInit = $('.list-table').html()
    $('.read-form').click(function() {
        
        $('#loader').show()
        
        // Reset data
        resetData($, $(this), tableInit)
        
        // Load datas form
        var formId = $(this).attr('data-form')
        $.ajax({
            url: ajax_object.ajax_url,
            type: "POST",
            data: {
                action: 'twx_excel_entries_values',
                formId: formId
            }
        }).done(function(data){
            loadData($,data,formId)
            loadDatatables($)
	})
    })
    
    // Reset selection row
    $('#pills-table').delegate('#deselect', 'click', function(e) {
        $('#datatables_wrapper .dt-buttons button.buttons-select-none').click()
    })
    
    // Download file
    $('#pills-tab .download-file button').click(function() {
        $('#datatables_wrapper .dt-buttons button.buttons-excel').click()
    })
    
})
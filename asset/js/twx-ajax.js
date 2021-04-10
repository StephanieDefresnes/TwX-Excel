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
                        if (!$('#labels-content').hasClass('onReload')) {
                            // Load form name as title
                            $.each(val2,function(key3, val3) {
                                $('#formName').text(val3)
                            })
                        }

                    } else if(key2 == 'labels') {

                        $('#pills-table thead tr').append(
                            '<td data-id="all">'
                            +'<input type="checkbox"'
                                +'class="custom-control-input pills-table-control"'
                                +'value="all" checked></td>');

                        $.each(val2,function(key3, val3) {
                            $.each(val3,function(key4, val4) {

                                // Load labels into thead
                                $('#pills-table thead tr').append(
                                    '<th data-id="'+ key4 +'">'+ val4 +'</th>'
                                )

                                // Load labels to unselect
                                if (!$('#labels-content').hasClass('onReload')) {
                                    $('#labels-content').attr('data-form', formId).append(
                                        '<div class="custom-control custom-checkbox col-sm-3 col-6 mb-1">'
                                            +'<input type="checkbox"'
                                                +'class="custom-control-input labels-input-control"'
                                                +'value="'+ key4 +'" checked>'
                                            +'<label class="custom-control-label labels-label-control"'
                                                +'for="'+ key4 +'">'
                                                + val4 +'</label>'
                                        +'</div>'
                                    )
                                }

                                // Init tbody depending on form labels id
                                $('#pills-table tbody tr').append(
                                    '<td data-id="'+ key4 +'"></td>'
                                )
                                if ($('#labels-content').hasClass('onReload')) {
                                    $('#labels-content').find('input').each(function() {
                                        if(!$(this).is(':checked')) {
                                            var fieldId = $(this).val()
                                            $('#pills-table thead').find('th').each(function() {
                                                if ($(this).attr('data-id') == fieldId) {
                                                    $(this).remove()
                                                }
                                            })
                                            $('#pills-table tbody').find('td').each(function() {
                                                if ($(this).attr('data-id') == fieldId) {
                                                    $(this).remove()
                                                }
                                            })
                                        }     
                                    })
                                }
                            })
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
                            .prepend('<td data-id="'+ key2 +'">'
                                +'<input type="checkbox"'
                                    +'class="custom-control-input pills-table-control"'
                                    +'value="'+ key2 +'" checked></td>');
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
        if (!$('#labels-content').hasClass('onReload')) {
//            $('#labels-content').removeClass('d-none')
            $('#nav-data').removeClass('d-none')
//            $('#pills-table').show()
        }
        $('#loader').hide()
}

jQuery(function($) {
    
    // Unselect/hide column
    $('#labels-content').delegate('.labels-label-control', 'click', function() {
        $(this).prev('.labels-input-control').click()        
    })
    $('#labels-content').delegate('.labels-input-control', 'change', function() {
        var formID = $('#labels-content').attr('data-form')
        $('.table.forms').find('.read-form').each(function() {
            if ($(this).attr('data-form') == formID) {
                $(this).addClass('onReload').click()
            }
        })
        $('#labels-content').addClass('onReload')
    })
    
    // Select/unselect all entries
    $('#pills-table').delegate('.pills-table-control', 'change', function() {
        var entryID = $(this).val()
        
        if (entryID == 'all' && !$(this).is(':checked')) {
            
            $('#pills-table tbody').find('tr').each(function() {
                $(this).addClass('noExl')
                        .find('.pills-table-control').prop('checked', false);
            })
            
        } else if (entryID == 'all' && $(this).is(':checked')) {
            
            $('#pills-table tbody').find('tr').each(function() {
                if ($(this).hasClass('noExl'))
                    $(this).removeClass('noExl')
                        .find('.pills-table-control').prop('checked', true);
            })
            
        } else if (entryID != 'all' && !$(this).is(':checked')) {
            
            $(this).parents('tr').addClass('noExl')
                    .find('.pills-table-control').prop('checked', false);
            
        } else if (entryID != 'all' && $(this).is(':checked')) {
            
            if ($(this).parents('tr').hasClass('noExl'))
                $(this).parents('tr').removeClass('noExl')
                    .find('.pills-table-control').prop('checked', true);
            else $(this).find('.pills-table-control').prop('checked', true);
            
        }
    })
    
    // Load clicked entries form
    $('.read-form').click(function() {
        
        $('#loader').show()
        
        // Reset data
        if (!$(this).hasClass('onReload')) {
            $('#nav-data').addClass('d-none')
            if ($('#labels-content').hasClass('onReload')) {
                $('#labels-content').removeClass('onReload')
            }
            $('.read-form').each(function() {
                if ($(this).hasClass('onReload')) {
                    $(this).removeClass('onReload')
                }
                
            })
//            $('#pills-table').hide()
//            $('#labels-content').addClass('d-none')
            $('#labels-content').find('.custom-control').each(function() {
                $(this).remove()
            })            
        }
        
        $('#pills-table thead, #pills-table tbody')
            .empty().html('<tr></tr>')
            
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
	})
    })
    
//    $('.entries').delegate('.entries tbody td', 'click', function() {alert('ok')
////    $('.entries tbody tr').click(function() {alert('ok')
//        if($(this).hasClass('focus')) $(this).removeClass('focus')
//        else $(this).addClass('focus')
//    })
    
})
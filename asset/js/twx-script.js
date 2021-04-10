var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

jQuery(function($) {
    
    // Hide loder at the end of dom ready
    $('#loader').hide()
    
    // Generate .xls
    $('#download-xls').click(function() {
        
        var today = new Date();
        var d = String(today.getDate()).padStart(2, '0')
        var m = String(today.getMonth() + 1).padStart(2, '0')
        var y = today.getFullYear()
        var h = String(today.getHours()).padStart(2, '0')
        var m = String(today.getMinutes()).padStart(2, '0')
        var s = String(today.getSeconds()).padStart(2, '0')
        
        var name = $('#formName').text()
        var filename = name.replace(' ', '-');
        
        $('#pills-table .entries').table2excel({
            exclude: '.noExl',
            name: 'Excel Document Name',
            filename: filename + '_' + y + m + d + '-' + h + m + s,
            fileext: '.xls',
        })
    })
    
})
<div id="loader"></div>

<div class="wrap plugin-install-tab-featured">
    
    <div class="row">
    
        <div class="col-12">
            <h1 class="wp-heading-inline">
                <?php _e('Forms and Export', 'twx-excel'); ?>
            </h1>
        </div>
        
        <div class="col-sm-6 col-12">
            <?php if ($options['forms']) {?>
            <table class="table table-bordered forms">
                <thead>
                    <tr>
                        <th colspan="3">
                            <?php _e('Active Forms list', 'twx-excel'); ?>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                <?php foreach ($options['forms'] as $form) { ?>
                    <tr>
                        <td><?= $form['name'] ?></td>
                        <td><?= $form['count'] ?></td>
                        <td class="text-center text-primary">
                            <span class="read-form" data-form="<?= $form['id'] ?>"
                                  data-bs-toggle="tooltip" data-bs-placement="right"
                                  title="<?php _e('Consult', 'twx-excel'); ?>">
                                <span class="dashicons dashicons-visibility"></span>
                            </span>
                        </td>
                    </tr>
                <?php } ?>
                </tbody>
            </table>
            <?php } else { ?>
                <p class="text-secondary">
                    <?php _e('No entry recorded among active forms.', 'twx-excel'); ?>
                    <?php _e('Please refer to the ', 'twx-excel'); ?>
                    <?= '<a href="'.admin_url(
                            $path = 'admin.php?page=caldera-forms',
                            $scheme = 'admin').'">Caldera Forms</a>'
                            .__('&nbsp;plugin.', 'twx-excel'); ?>
                </p>
            <?php } ?>
        </div>
        
        <?php if ($options['forms']) {?>
        <div class="col-xl-4 offset-xl-2 col-sm-6 offset-sm-0 col-12">
            
            <div class="alert alert-secondary" role="alert">
                <p class="mb-2 px-2"><?php _e('Please select :', 'twx-excel'); ?></p>
                <ul class="mb-2">
                    <li class="mb-1">
                        <span class="dashicons dashicons-yes"></span>
                        <?php _e('Form to download', 'twx-excel'); ?>
                    </li>
                    <li class="mb-1">
                        <span class="dashicons dashicons-yes"></span>
                        <?php _e('Fields to keep', 'twx-excel'); ?>
                    </li>
                    <li class="mb-1">
                        <span class="dashicons dashicons-yes"></span>
                        <?php _e('Entries to keep', 'twx-excel'); ?>
                    </li>
                </ul>
                <p class="mb-1 px-2"><?php _e('Than download !', 'twx-excel'); ?></p>
            </div>
        </div>
        <?php } ?>
        
    </div>

    <div id="nav-data" class="d-none mt-4">
        
        <h5 id="formName" class="mb-4 pb-2 border-bottom border-secondary"></h5>
        
        <ul class="nav nav-pills mb-2" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="pills-fields-tab"
                    data-bs-toggle="pill" data-bs-target="#pills-fields" type="button"
                    role="tab" aria-controls="pills-fields" aria-selected="true">
                <?php _e('Fields list', 'twx-excel'); ?>
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="pills-table-tab"
                    data-bs-toggle="pill" data-bs-target="#pills-table" type="button"
                    role="tab" aria-controls="pills-table" aria-selected="false">
                <?php _e('Data table', 'twx-excel'); ?>
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="pills-download-tab"
                    data-bs-toggle="pill" data-bs-target="#pills-download"type="button"
                    role="tab" aria-controls="pills-download" aria-selected="false">
                <?php _e('Download', 'twx-excel'); ?>
            </button>
          </li>
        </ul>
        
        <div class="tab-content" id="pills-tabContent">

            <div class="tab-pane fade show active" id="pills-fields" role="tabpanel"
                 aria-labelledby="pills-fields-tab">
                <div id="labels-content" class="row mt-3"></div>
            </div>
            
            <div class="tab-pane fade" id="pills-table" role="tabpanel"
                 aria-labelledby="pills-table-tab">
                <div class="list-table border">
                    <table class="table table-bordered table-sm table-hover entries">   
                        <thead>
                            <tr></tr>
                        </thead>

                        <tbody class="bg-white">
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="tab-pane fade" id="pills-download" role="tabpanel"
                 aria-labelledby="pills-download-tab">
                <div class="text-center mt-4">
                    <p class="small mb-4">
                        <?php _e('Depending on the browser you are downloading the file from, it may be claimed to be <em>&quot;damaged&quot;</em>.',
                                'twx-excel'); ?><br>
                        <?php _e('However, you can open it without risk.', 'twx-excel'); ?>
                    </p>
                    <button class="btn btn-dark pt-1" id="download-xls">
                        <?php _e('Download now', 'twx-excel'); ?>
                    </button>
                </div>
            </div>
            
        </div>

    </div>
    
</div>
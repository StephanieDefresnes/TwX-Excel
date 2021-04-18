<?php
/*
 * Plugin Name: TwX Excel Export for Caldera Forms
 * Text Domain: twx-excel
 * Domain Path: /languages
 * Description: Entries Caldera Forms export in .xls
 * Version: 1.1
 * Requires at least: 5.7
 * Tested up to: 5.7
 * Author: TwXDesign
 * Author URI: https://www.twxdesign.com/
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */
namespace TwxExcel;
    
define('TWX_BASENAME', plugin_basename(__FILE__));
define('TWX_URL', plugins_url('', TWX_BASENAME));

require_once plugin_dir_path( __FILE__ ) . 'src/Service/LoadCalderaFormsService.php';

use TwxExcel\Service\LoadCalderaFormsService;

class TwxExportExcel
{
    protected $views = array();
    
    public function __construct()
    {
        add_action('plugins_loaded', [$this, 'twx_excel_textdomain']);
        add_action('admin_init', [$this, 'twx_excel_has_parent_caldera']);
        add_action('admin_menu', [$this, 'twx_excel_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'twx_excel_load_scripts']);
        add_action('wp_ajax_twx_excel_entries_values', [$this, 'twx_excel_entries_values']);
    }
        
    public function twx_excel_has_parent_caldera() {
        if ( is_admin() && current_user_can( 'activate_plugins' )
                && !is_plugin_active( 'caldera-forms/caldera-core.php' ) ) {
            add_action('admin_notices', [$this, 'twx_excel_notice'], 0);

            deactivate_plugins( plugin_basename( __FILE__ ) ); 

            if ( isset( $_GET['activate'] ) ) {
                unset( $_GET['activate'] );
            }
        }
    }

    public function twx_excel_notice(){ ?>
        <div class="error">
            <p><?php _e('Sorry, but TwX Excel plugin requires Caldera Forms plugin to be installed and active.', 'twx-excel'); ?></p>
        </div>
    <?php }
    
    public function twx_excel_load_view() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to access this page.'));
        }  
        $current_views = $this->views[current_filter()];
        $options['forms'] = $this->twx_excel_forms_list();
        include('templates/index.php');
    }
    
    public function twx_excel_admin_menu()
    {
        $view_hook_name = add_menu_page(
            __('TwX Export', 'twx-export-plugin'),
            __('TwX Export', 'twx-export-plugin'),
            'manage_options',
            'twx-export-excel',
            array($this, 'twx_excel_load_view'),
            'dashicons-editor-table', 2
        );
        $this->views[$view_hook_name] = 'options';
    }
    
    public function twx_excel_textdomain() 
    {
        load_plugin_textdomain( 'twx-excel', false, dirname( TWX_BASENAME ) . '/languages/'); 
    }
    
    public function twx_excel_load_scripts($hook) {
	if( $hook != 'toplevel_page_twx-export-excel' ) return;
    
        wp_enqueue_script('bootstrap',
            TWX_URL . '/asset/bootstrap/5.0.0-beta3/js/bootstrap.bundle.min.js', 
            array('jquery'), '', true);
        
        wp_enqueue_script('table2excel',
            TWX_URL. '/asset/js/jquery.table2excel.js',
            array('jquery'), '', true);
        
        wp_enqueue_script('script',
            TWX_URL. '/asset/js/twx-script.js',
            array('jquery'), '', true);
        
        wp_enqueue_script('ajax-script',
            TWX_URL. '/asset/js/twx-ajax.js',
            array('jquery'), '', true);
        wp_localize_script('ajax-script', 'ajax_object',
            array('ajax_url' => admin_url('admin-ajax.php')));
        
        wp_enqueue_style('bootstrap',
            TWX_URL. '/asset/bootstrap/5.0.0-beta3/css/bootstrap.min.css');
        wp_enqueue_style('parent-style',
            TWX_URL. '/asset/css/style.css' );
    }
    
    public function twx_excel_forms_list() {
        $load_caldera_forms_service = LoadCalderaFormsService::load_forms();
        return $load_caldera_forms_service;
    }
    
    public function twx_excel_entries_values() {
        $load_caldera_forms_service = LoadCalderaFormsService::load_values();
        return $load_caldera_forms_service;
    }
    
}

$twx_export_excel = new TwxExportExcel();
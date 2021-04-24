<?php

namespace TwxExcel\Service;

class LoadCalderaFormsService {
    
    /**
     * @return Caldera active forms, count and labels if form entries are not empty
     */
    public function load_forms() {
        global $wpdb;
        $forms = $wpdb->get_results(
                "SELECT f.config            formConfig,
                        COUNT(e.form_id)    formEntries
                FROM    ". $wpdb->prefix ."cf_forms                 f
                    LEFT JOIN   ". $wpdb->prefix ."cf_form_entries  e
                        ON  f.form_id = e.form_id
                WHERE   f.type =    'primary'
                    AND e.status =  'active'
                GROUP BY f.form_id
                ORDER   BY f.id ASC"
            );
        
        foreach ($forms as $key => $object) {
            $results[] = unserialize($object->formConfig);
            foreach ($results as $key => $value) {
                foreach ($value['fields'] as $key => $field) {
                    $fieldName[] = [$field['ID'] => $field['label']];
                }
                $formDraft = $value['form_draft'];
            }
            $data[] = [
                'id' => $value['ID'],
                'name' => $value['name'],
                'inactive' => $formDraft,
                'count' => $object->formEntries,
                'labels' => $fieldName,
            ];
        }
        return ($options['forms'] = $data);
    }
    
    /**
     * @return values of Caldera form selected
     */
    public function load_values() {
        
        $formId = $_POST['formId'];
        $data = [];
        global $wpdb;
        
        /*
         *  Get labels and form name depending on form id
         */
        $config = $wpdb->get_results(
                "SELECT     config
                FROM        ". $wpdb->prefix. "cf_forms
                WHERE   type =    'primary'
                    AND form_id = '". $formId ."'"
            );
        
        // Rebuild array result to load fields data 
        foreach ($config as $key => $object) {
            $formsName = [];
            $results[] = unserialize($object->config);
            foreach ($results as $key => $value) {
                foreach ($value['fields'] as $key => $field) {
                    $fieldName[] = [
                        'id' => $field['ID'],
                        'label' => $field['label'],
                        'type' => $field['type'],
                        'entry_list' => $field['entry_list']
                    ];
                }
                $formName = [$value['ID'] => $value['name']];
                $form = [
                    'formName' => $formName,
                    'labels' => $fieldName
                ];
            }
        }
        $data['form'] =  $form;
        
        /*
         *  Get entries values depending on form id
         */
        $values = $wpdb->get_results(
            "SELECT e.form_id   fieldForm,
                    v.entry_id  entryId,
                    v.field_id  fieldId,
                    v.value	fieldValue
            FROM    ". $wpdb->prefix. "cf_form_entry_values     v
                LEFT JOIN   ". $wpdb->prefix ."cf_form_entries  e
                    ON  v.entry_id = e.id
            WHERE   e.status = 'active'
                AND e.form_id  = '". $formId ."'
            ORDER   BY e.id DESC"
            );
        
        // Rebuild array values to load fieldForm id entryId id and labels value
        for ($i = 0; $i < count($values); $i++) {
            // If first iteration or entryId is different to previous entryId
            // Create array
            if ($i == 0 || $values[$i]->entryId != $values[$i-1]->entryId) {
                $entryValues[$values[$i]->entryId] = [
                    $values[$i]->fieldId => $values[$i]->fieldValue
                ];
            // If entryId is equal to previous entryId
            // Merge values into array
            } else if ($values[$i]->entryId == $values[$i-1]->entryId) {
                $array2 = [$values[$i]->fieldId => $values[$i]->fieldValue];
                $entryValues[$values[$i]->entryId] =
                        array_merge($entryValues[$values[$i]->entryId], $array2);
            }
        }
        $data['values'] = $entryValues;
        
        wp_send_json($data);
        wp_die();
    }
    
}

$load_caldera_forms_service = new LoadCalderaFormsService();
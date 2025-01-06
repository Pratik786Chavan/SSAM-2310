import { InspectionValuationVar} from '../../Common/Library/GlobalInspectionResults';

export default class {
    /*
    * resets the filter
    */
    static resetFilter(context) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        let count = 0;
        for (let section of sections) {
            section.setVisible(true);
            if (section.getExtensions() && section.getExtensions()[0] && section.getExtensions()[0].constructor && section.getExtensions()[0].constructor.name === 'EditableDataTableViewExtension') {
                let extension = section.getExtensions()[0];
                if (extension) {
                    count = count + extension.getRowBindings().length;
                    extension.resetFilter();
                }
            }
        }
        if (count > 0) {
            context.setCaption(context.localizeText('record_results_x', [count]));
        }
    }

    /*
    * filters sections
    */
    static filterSections(context, filter) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        //let index = section._context.element._props.definition.data.ExtensionProperties.UserData.Index;
        let count = 0;
        let filteredCount = 0;
        for (let index = 0; index < sections.length; index++) {
            //if (sections[index].getExtensions() && sections[index].getExtensions().length > 0 && sections[index].getExtensions()[0].constructor && sections[index].getExtensions()[0].constructor.name === 'EditableDataTableViewExtension') {
            if (sections[index]._context.element.definition._data.Class === 'EditableDataTableViewExtension' && sections[index].getExtensions() && sections[index].getExtensions().length > 0) {
                this.filterSection(context, sections[index-1], sections[index], filter, count, filteredCount, false);
            }
        }
        if (count > 0) {
            if (filteredCount === 0) {
                context.setCaption(context.localizeText('record_results_x', [count]));
            } else {
                context.setCaption(context.localizeText('record_results_x_x', [filteredCount, count]));
            }
        }
    }

    /*
    * filters sections
    */
   /* eslint-disable no-unused-vars */
    static filterSection(context, headerSection, section, filter, count, filteredCount, updateCaption) {
        let filterResults = this.filterEDT(section, filter);
        let filteredRows = filterResults.filteredRows;
        if (filterResults.Visbility) {
            count = count + filterResults.Count;
            if (filteredRows && filteredRows.length > 0) {
                filteredCount = filteredCount + filteredRows.length;
                section.getExtensions()[0].applyFilter(filteredRows);
            } 
        }
        if (section.getVisible() !== filterResults.Visbility) {
            section.setVisible(filterResults.Visbility);
            headerSection.setVisible(filterResults.Visbility);
        }
        
        if (updateCaption) {
            if (count > 0) {
                if (filteredCount === 0) {
                    context.setCaption(context.localizeText('record_results_x', [count]));
                } else {
                    context.setCaption(context.localizeText('record_results_x_x', [filteredCount, count]));
                }
            }
        }
    }
    
    /*
    * filters sections
    */
    static setFilterApplied(context, index) {
        let filterApplied = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilterApplied;
        filterApplied[index] = true;
        context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilterApplied = filterApplied;
    }

    /*
    * id filter applied
    */
    static isFilterApplied(context, index) {
        let filterApplied = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilterApplied;
        return filterApplied[index];
    }

    /*
    * set header & edt section visibility 
    */
     static setVisibility(context, visibility, index) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        for (let section of sections) {
            if (index === section._context.element._props.definition.data.ExtensionProperties.UserData.Index) {
                if (section.getVisible() !== visibility) {
                    section.setVisible(visibility);
                }
            }
        }
    }

    /*
    * get edt section visibility 
    */
    static getVisibility(context, index) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        let section = sections.findIndex(item => item._context.element._props.definition.data.ExtensionProperties.UserData.Index === index);
        return section.getVisible();
    }


    /*
    * get edt section visibility 
    */
    static findSection(context, index) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        return sections[sections.findIndex(item => item._context.element._props.definition.data.ExtensionProperties.UserData.Index === index && item._context.element.definition._data.Class === 'EditableDataTableViewExtension')];
    }

    /*
    * get user data 
    */
    static getUserData(context) {
        let equipments  = [];
        let functionalLocations  = [];
        let operations  = [];
        let filterApplied = [];
        let sections = context.getPageProxy().getControls()[0].getSections();
        for (let section of sections) {
            if (section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData) {
                let equipment = section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.Equipment;
                let floc = section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.FunctionalLocation;
                let opr = section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.Operation;
                if (!equipments.includes(equipment)) {
                    equipments.push(equipment);
                }
                if (!functionalLocations.includes(floc)) {
                    functionalLocations.push(floc);
                }
                if (!operations.includes(opr)) {
                    operations.push(opr);
                }
                filterApplied.push(section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.FilterApplied);
            }
            
        }
        return {
            'FilterData' : {
                'Equipments': equipments,
                'FunctionalLocations': functionalLocations,
                'Operations': operations,
                'FilterApplied': filterApplied,
            },
        };
        //return section._context.element._props.definition.data.ExtensionProperties.UserData;
    }
    /*
    * filters the EDT
    */
    static filterEDT(section, filter) {
        let filteredRows = [];
        let extensionVisible = false;
        let count = 0;
        let valuations = InspectionValuationVar.getInspectionResultValuations();
        filter.replace(/([_\w]+) eq '([\d\w-]+)'/g, (expr) => {
            // Create an object of key-value pairs, e.g. "(__Status: eq 'Error')" ==> {'Status' : 'Error'}
            let obj = Object.fromEntries([Object.values(expr.match(/(?<key>\w+) eq '(?<value>[\d\w-]+)'/).groups)]);
            let extension = section.getExtensions()[0];
            if (extension) {
                //if (extension[0].constructor && extension[0].constructor.name === 'EditableDataTableViewExtension') {
                    let firstRow = extension.getRowBindings()[0];
                    let rows = extension.getAllValues();
                    count = rows.length;
                    // __Status is a special property that won't be in an OData entity set. Handle this separately
                    if (obj.FilterSeg) {
                        let i = 0;
                        for (let row of rows) {
                            switch (obj.FilterSeg) {
                                case 'Empty':
                                    if (Object.prototype.hasOwnProperty.call(row.Properties, 'Valuation') && valuations[row.Properties.Valuation] === '') {
                                        filteredRows.push(i);
                                        extensionVisible = true;
                                    }
                                    break;
                                case 'Error':
                                    if (Object.prototype.hasOwnProperty.call(row.Properties, 'Valuation') && (valuations[row.Properties.Valuation] === 'R' || valuations[row.Properties.Valuation] === 'F')) {
                                        filteredRows.push(i);
                                        extensionVisible = true;
                                    }
                                    break;
                                default:
                                    // Default: show section
                                    break;
                            }
                            i = i + 1;
                        }
                    } else if (obj.Equipment) {
                        let equipId = ''; 
                        if (firstRow.InspectionPoint_Nav && firstRow.InspectionPoint_Nav.EquipNum) {
                            equipId = firstRow.InspectionPoint_Nav.EquipNum;
                        } else if (firstRow.InspectionLot_Nav && firstRow.InspectionLot_Nav.Equipment) {
                            equipId = firstRow.InspectionLot_Nav.Equipment;
                        } else if (firstRow.Equipment) {
                            equipId = firstRow.Equipment;
                        }
                        if (obj.Equipment === equipId) {
                            extensionVisible = true;
                        } else {
                            extensionVisible = false;
                            count = 0;
                            filteredRows = [];
                        }
                    } else if (obj.FuncLoc) {
                        let FuncLoc = ''; 
                        if (firstRow.InspectionPoint_Nav && firstRow.InspectionPoint_Nav.FuncLoc) {
                            FuncLoc = firstRow.InspectionPoint_Nav.FuncLoc;
                        } else if (firstRow.InspectionLot_Nav && firstRow.InspectionLot_Nav.FunctionalLocation) {
                            FuncLoc = firstRow.InspectionLot_Nav.FunctionalLocation;
                        } else if (firstRow.FunctionalLocation) {
                            FuncLoc = firstRow.FunctionalLocation;
                        }
                        
                        if (obj.FuncLoc === FuncLoc) {
                            extensionVisible = true;
                        } else {
                            extensionVisible = false;
                            count = 0;
                            filteredRows = [];
                        }
                    } else if (obj.Operations) {
                        let operationNo = (firstRow.EAMChecklist_Nav) ? firstRow.EAMChecklist_Nav.OperationNo:firstRow.InspectionPoint_Nav.OperationNo;
                        if (obj.Operations === operationNo) {
                            extensionVisible = true;
                        } else {
                            extensionVisible = false;
                            count = 0;
                            filteredRows = [];
                        }
                    }
                //}
                this.setFilterApplied(extension.context.clientAPI, extension.getUserData().Index);
            } else {
                let equipment = section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.Equipment;
                let floc = section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.FunctionalLocation;
                let opr = section._context.element._props.definition.data.ExtensionProperties.UserData.FilterData.Operation;
                if (obj.Equipment) {
                    if (obj.Equipment === equipment) {
                        extensionVisible = true;
                    }
                } else if (obj.FuncLoc) {
                    if (obj.FuncLoc === floc) {
                        extensionVisible = true;
                    }
                } else if (obj.Operations) {
                    if (obj.Operations.includes(opr)) {
                        extensionVisible = true;
                    }
                }
            }
        });
        return {'filteredRows': filteredRows, 'Visbility': extensionVisible, 'Count': count};
    }
    /*
    * filters the EDT
    */
    static checkAnyDataChangedInEDT(context) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        for (let index = 0; index < sections.length; index++) {
            if (sections[index]._context.element.definition._data.Class === 'EditableDataTableViewExtension' && sections[index].getExtensions() && sections[index].getExtensions().length > 0) {
                if (sections[index].getExtensions()[0].getUpdatedValues().length > 0) {
                    return true;
                }
            }
        }
        return false;
    }
}   

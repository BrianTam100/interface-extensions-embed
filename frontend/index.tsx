import {initializeBlock, useBase, useCustomProperties, useRecords} from '@airtable/blocks/interface/ui';
import {Base, Field, type FieldConfig, FieldType, Record} from '@airtable/blocks/interface/models';
import {useCallback, useState} from 'react';
import clsx from 'clsx';
import './style.css';

function InboxSidebar({
    records,
    currentRecordId,
    setCurrentRecordId,
    labelField,
    width = 200,
    className,
}: {
    records: Record[],
    currentRecordId: string,
    setCurrentRecordId: (recordId: string) => void
    labelField: Field,
    width?: number,
    className?: string,
}) {
    return (
        <div
            className={clsx(
                'h-screen overflow-y-auto flex flex-col min-h-screen p-3 border-r border-black/10',
                className
            )}
            style={{width: `${width}px`}}
        >
            {records.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-gray500">No records found</div>
            ) : records.map(record => (
                <InboxSidebarItem
                    key={record.id}
                    label={record.getCellValueAsString(labelField)}
                    isSelected={record.id === currentRecordId}
                    onClick={() => setCurrentRecordId(record.id)}
                />
            ))}
        </div>
    );
}

function InboxSidebarItem({
    label,
    isSelected,
    onClick,
}: {
    label: string,
    isSelected: boolean,
    onClick: () => void
}) {
    return (
        <div
            className={clsx('px-3 py-2 rounded-md', {
                'font-medium bg-blue-blueLight3': isSelected,
                'hover:bg-gray-gray60 hover:cursor-pointer': !isSelected,
            })}
            onClick={isSelected ? undefined : onClick}
        >
            {label}
        </div>
    );
}

function shouldFieldBeAllowedForUrl(field: {id: string, config: FieldConfig}) {
    return (
        field.config.type === FieldType.URL ||
        field.config.type === FieldType.SINGLE_LINE_TEXT ||
        field.config.type === FieldType.AI_TEXT || (
            (field.config.type === FieldType.FORMULA ||
            field.config.type === FieldType.MULTIPLE_LOOKUP_VALUES ||
            field.config.type === FieldType.ROLLUP) &&
            field.config.options?.result?.type === FieldType.SINGLE_LINE_TEXT)
    );
}

function EmbedApp() {
    const getCustomProperties = useCallback((base: Base) => {
        const table = base.tables[0];
        return [
            { key: 'labelField', label: 'Label', type: 'field' as const, table, defaultValue: table.primaryField },
            { key: 'urlField', label: 'URL', type: 'field' as const, table, shouldFieldBeAllowed: shouldFieldBeAllowedForUrl, defaultValue: table.fields.find(field => field.config.type === FieldType.URL) },
        ];
    }, []);

    const {customPropertyValueByKey} = useCustomProperties(getCustomProperties);
    const labelField = customPropertyValueByKey.labelField as Field;
    const urlField = customPropertyValueByKey.urlField as Field;

    const base = useBase();
    const records = useRecords(base.tables[0]);
    const recordsWithUrls = records.filter(record => record.getCellValueAsString(urlField));
    const [currentRecordId, setCurrentRecordId] = useState<string>(recordsWithUrls.length > 0 ? recordsWithUrls[0].id : '');
    const currentRecord = records.find(record => record.id === currentRecordId) ?? null;

    return (
        <div className="h-screen flex">
            <InboxSidebar
                records={recordsWithUrls}
                currentRecordId={currentRecordId}
                setCurrentRecordId={setCurrentRecordId}
                labelField={labelField}
            />
            <div className="flex-auto flex bg-gray-gray50 dark:bg-gray-gray900">
                {currentRecord && currentRecord.getCellValueAsString(urlField) ?
                    <iframe src={currentRecord.getCellValueAsString(urlField)} className="flex-1" /> :
                    <div className="flex-1 flex items-center justify-center text-gray-gray500 font-medium text-xl">Select a record</div>
                }
            </div>
        </div>
    );
}

initializeBlock({interface: () => <EmbedApp />});

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import type { SelectOption } from '../types/DashboardTypes';

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    options: SelectOption[];
    onOptionSelect: (value: string) => void;
}

export default function SelectField({ id, label, value, options, onOptionSelect }: SelectFieldProps) {

    const handleChange = (event: SelectChangeEvent<string>) => {
        onOptionSelect(event.target.value);
    };

    return (
        <FormControl fullWidth size="small">
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                labelId={`${id}-label`}
                id={id}
                label={label}
                value={value}
                onChange={handleChange}>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
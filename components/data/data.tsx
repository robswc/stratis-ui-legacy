"use client"

import {Controller, FormProvider, useForm, useFormContext} from 'react-hook-form';
import {useEffect, useState} from "react";
import axios from "axios";

interface DaisyInputProps {
    name: string;
    label: string;
    tip: string;
    placeholder: string;
    type: string;
    selectOptions?: string[];
}

function DaisyInput(props: DaisyInputProps) {
    const { name, label, tip, placeholder } = props;
    const { control, formState: { errors } } = useFormContext();

    let controllerElement = (
        <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <label className="input-group">
                    <span>{label}</span>
                    <input {...field} type="text" placeholder={placeholder} className="input input-bordered w-full" />
                </label>
            )}
        />
    )
    if (props.type === 'select') {
        console.log('select', props.selectOptions);
        controllerElement = (
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <label className="input-group flex">
                        <span>{label}</span>
                        <select {...field} className="select select-bordered flex-grow">
                            <option value="">Select an option</option>
                            {props.selectOptions?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                )}
            />
        )
    }

    return (
        <>
            <label className="label">
                <span className={label}>{tip}</span>
            </label>
            {controllerElement}
            {errors[name] && <span className='text-error'>This field is required</span>}
        </>
    );
}

function DataForm({onSubmit}: { onSubmit: any }) {
    const methods = useForm();
    const [adapterOptions, setAdapterOptions] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/v1/data/adapters/`).then(res => {
            setAdapterOptions(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const onSubmitHandler = (data: any) => {
        onSubmit(data.adapter, data.data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitHandler)} className='flex flex-col gap-6'>
                <div className='form-control'>
                    <DaisyInput
                        name={'adapter'}
                        label={'Adapter'}
                        tip={'data adapter name'}
                        placeholder={'e.g. "CSVAdapter"'}
                        type={'select'}
                        selectOptions={adapterOptions}
                    />
                    <DaisyInput
                        name={'data'}
                        label={'data'}
                        tip={'data path'}
                        placeholder={'e.g. "tests/data/AAPL.csv"'}
                        type={'string'}
                    />
                </div>
                <button type="submit" className='btn btn-secondary w-full'>Load Data</button>
            </form>
        </FormProvider>
    );
}

export default DataForm;